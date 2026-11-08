import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getClientIp } from "@/lib/request-ip";
import { consumeRateLimitShared } from "@/lib/rate-limit";
import { logError } from "@/lib/redact";
import { classifyChannel, referrerHostOf } from "@/lib/traffic/channel";
import { isBot, parseUserAgent } from "@/lib/traffic/ua";
import {
  clean,
  geoOf,
  isSkippedPath,
  normalizePath,
  optedOut,
  parseUtm,
  recordEngagement,
  recordPageView,
  siteHosts,
  visitorIdFor,
} from "@/lib/traffic/collect";

/**
 * First-party page analytics collector (components/traffic-tracker.tsx).
 *
 * Body (JSON, sent as text/plain so sendBeacon works):
 *   { t: "pv", p: path, q: query, r: referrer, ti: title, s: sessionId, l: language, tp: touch points, rv: 0|1 }
 *   { t: "leave", id: pageViewId, s: sessionId, ms: visible time }
 *
 * Drops bots, Do Not Track / Global Privacy Control, admin and API paths and
 * Vercel preview deployments. Never stores the IP (see lib/traffic/collect.ts).
 */

const NO_CONTENT = () => new NextResponse(null, { status: 204 });
const SESSION_RE = /^[A-Za-z0-9_-]{8,64}$/;
const ID_RE = /^[a-z0-9]{20,40}$/;

export async function POST(req: Request) {
  // Preview deployments share production settings; their traffic is our own testing.
  if (process.env.VERCEL_ENV === "preview") return NO_CONTENT();
  const ua = req.headers.get("user-agent");
  if (optedOut(req) || isBot(ua)) return NO_CONTENT();

  // Per-IP limit; the bucket key holds a hash, never the address itself.
  const ipKey = createHash("sha256").update(getClientIp(req)).digest("hex").slice(0, 24);
  if (!(await consumeRateLimitShared(`t:${ipKey}`, 600, 3_600_000))) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    const text = await req.text();
    if (text.length > 8_000) return NextResponse.json({ error: "Too large" }, { status: 413 });
    const parsed: unknown = JSON.parse(text);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("not an object");
    body = parsed as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  const sessionId = typeof body.s === "string" && SESSION_RE.test(body.s) ? body.s : null;
  if (!sessionId) return NextResponse.json({ error: "Bad request" }, { status: 400 });

  try {
    if (body.t === "leave") {
      const id = typeof body.id === "string" && ID_RE.test(body.id) ? body.id : null;
      const ms = typeof body.ms === "number" && Number.isFinite(body.ms) ? body.ms : 0;
      if (id) await recordEngagement(id, sessionId, ms);
      return NO_CONTENT();
    }
    if (body.t !== "pv") return NextResponse.json({ error: "Bad request" }, { status: 400 });

    const path = normalizePath(typeof body.p === "string" ? body.p : "");
    if (!path) return NextResponse.json({ error: "Bad request" }, { status: 400 });
    if (isSkippedPath(path)) return NO_CONTENT();

    const utm = parseUtm(typeof body.q === "string" ? body.q : "");
    const referrerHost = referrerHostOf(typeof body.r === "string" ? body.r : null, siteHosts(req));
    const { adClick, ...utmFields } = utm;
    const touch = typeof body.tp === "number" && Number.isFinite(body.tp) ? body.tp : 0;
    const parsedUa = parseUserAgent(ua ?? "", touch);
    const lang = clean(body.l, 16);
    const session = await getSession();

    const id = await recordPageView({
      visitorId: await visitorIdFor(req),
      sessionId,
      userId: session?.sub ?? null,
      path,
      title: clean(body.ti, 200),
      referrerHost,
      utm: utmFields,
      channel: classifyChannel({ referrerHost, utmSource: utmFields.utmSource, utmMedium: utmFields.utmMedium, adClick }),
      ...geoOf(req),
      ...parsedUa,
      lang: lang && /^[A-Za-z]{2,3}(-[A-Za-z0-9]{2,8})*$/.test(lang) ? lang : null,
      isReturning: body.rv === 1 || body.rv === true,
    });
    return NextResponse.json({ id }, { status: 201, headers: { "Cache-Control": "no-store" } });
  } catch (e) {
    logError("[t] page view not recorded", e);
    return NextResponse.json({ error: "Not recorded" }, { status: 500 });
  }
}
