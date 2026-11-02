"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Check, Copy, Loader2, Mail } from "lucide-react";
import { ErrorNote, PageHeader, appBtnPrimary, focusCls } from "@/components/app/jobs/ui";

export type ReferralRow = {
  id: string;
  code: string;
  referredEmail: string | null;
  status: string;
  creditAmount: number;
  createdAt: string;
};

function baseUrl() {
  if (typeof window !== "undefined") return process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
  return process.env.NEXT_PUBLIC_APP_URL || "";
}

/** Show enough of an address to recognise a friend without printing it in full. */
function maskEmail(email: string) {
  const [user, domain] = email.split("@");
  if (!domain) return email;
  return `${user.slice(0, 2)}${"•".repeat(Math.max(1, Math.min(6, user.length - 2)))}@${domain}`;
}

const defaultMessage = (link: string) =>
  `I've been using LaunchCV for my job search. The ATS check is free and shows what applicant tracking software can't read on your resume. Here's my link: ${link}`;

function useCopy() {
  const [copied, setCopied] = useState<string | null>(null);
  async function copy(key: string, text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied((c) => (c === key ? null : c)), 2000);
    } catch {
      setCopied(null);
    }
  }
  return { copied, copy };
}

export function ReferralsClient({ initial }: { initial: ReferralRow[] }) {
  const [rows, setRows] = useState(initial);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { copied, copy } = useCopy();

  const pending = useMemo(() => rows.find((r) => r.status === "pending" && !r.referredEmail) ?? null, [rows]);
  const link = pending ? `${baseUrl()}/register?ref=${pending.code}` : "";
  const joined = useMemo(() => rows.filter((r) => r.referredEmail), [rows]);

  const [message, setMessage] = useState("");
  const [edited, setEdited] = useState(false);
  const shownMessage = edited ? message : link ? defaultMessage(link) : "";

  const generateCode = useCallback(async () => {
    setGenerating(true);
    setError(null);
    const res = await fetch("/api/referrals/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ forceNew: false }),
    }).catch(() => null);
    const j = res ? await res.json().catch(() => ({})) : {};
    setGenerating(false);
    if (!res?.ok || !j.referral) return setError(typeof j.error === "string" ? j.error : "Couldn't create your link. Refresh to try again.");
    const r = j.referral;
    setRows((prev) => [
      { id: r.id, code: r.code, referredEmail: r.referredEmail ?? null, status: r.status, creditAmount: r.creditAmount, createdAt: r.createdAt },
      ...prev.filter((x) => x.id !== r.id),
    ]);
  }, []);

  // Create the link once on first visit; a failure shows the error instead of retrying in a loop.
  const requested = useRef(false);
  useEffect(() => {
    if (pending || requested.current) return;
    requested.current = true;
    queueMicrotask(() => void generateCode());
  }, [pending, generateCode]);

  const shareLinks = link
    ? [
        { label: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(link)}` },
        { label: "X", href: `https://x.com/intent/post?text=${encodeURIComponent(shownMessage)}` },
        { label: "Email", href: `mailto:?subject=${encodeURIComponent("A free resume check I've been using")}&body=${encodeURIComponent(shownMessage)}` },
      ]
    : [];

  return (
    <div className="mx-auto flex w-full max-w-[1180px] flex-col gap-5 text-[#121226] sm:gap-6">
      <PageHeader
        title="Referrals"
        lead="Share LaunchCV with friends who are job hunting. Anyone who signs up through your link shows up here. Their ATS check is free, like yours."
      />

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <section aria-labelledby="ref-link-h" className="relative overflow-hidden rounded-[28px] bg-[#111118] p-5 text-white sm:p-8">
          <p aria-hidden="true" className="lc-poster pointer-events-none absolute -bottom-3.5 right-6 m-0 select-none text-[72px] leading-[72px] text-[#24223a] sm:text-[110px] sm:leading-[110px]">
            SHARE
          </p>
          <div className="relative">
            <h2 id="ref-link-h" className="text-[13px] font-bold uppercase tracking-[0.08em] text-[#c9c0ff]">
              Your referral link
            </h2>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row">
              <label className="min-w-0 flex-1">
                <span className="sr-only">Your referral link</span>
                <input
                  readOnly
                  value={link}
                  placeholder={generating ? "Creating your link…" : ""}
                  onFocus={(e) => e.currentTarget.select()}
                  className="lc-mono block h-[52px] w-full rounded-[16px] border border-[#2f2d48] bg-[#1d1c2e] px-[18px] text-[16px] text-white outline-none placeholder:text-[#a9a7bd] focus:border-[#c9c0ff] focus:ring-4 focus:ring-[#c9c0ff]/20 focus-visible:outline-none! sm:text-[14px]"
                />
              </label>
              <button
                type="button"
                onClick={() => void copy("link", link)}
                disabled={!link}
                className={`${appBtnPrimary} h-[52px] focus-visible:outline-[#c9c0ff]!`}
              >
                {generating ? (
                  <Loader2 className="h-4 w-4 motion-safe:animate-spin" aria-hidden />
                ) : copied === "link" ? (
                  <Check className="h-4 w-4" aria-hidden />
                ) : (
                  <Copy className="h-4 w-4" aria-hidden />
                )}
                {copied === "link" ? "Copied" : "Copy link"}
              </button>
            </div>
            {error ? <ErrorNote className="mt-3">{error}</ErrorNote> : null}

            {shareLinks.length > 0 ? (
              <div className="mt-3.5 flex flex-wrap gap-2">
                {shareLinks.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target={s.label === "Email" ? undefined : "_blank"}
                    rel="noreferrer"
                    className={`inline-flex min-h-11 items-center gap-2 rounded-full bg-[#2a2840] px-4 text-[14px] font-bold text-white transition-colors hover:bg-[#3a3858] motion-reduce:transition-none focus-visible:rounded-full! ${focusCls} focus-visible:outline-[#c9c0ff]!`}
                  >
                    {s.label === "Email" ? <Mail className="h-4 w-4" aria-hidden /> : null}
                    {s.label === "Email" ? "Email" : `Share on ${s.label}`}
                  </a>
                ))}
              </div>
            ) : null}

            <label htmlFor="ref-message" className="mt-6 block text-[13px] font-bold uppercase tracking-[0.08em] text-[#c9c0ff]">
              Message
            </label>
            <textarea
              id="ref-message"
              value={shownMessage}
              onChange={(e) => {
                setEdited(true);
                setMessage(e.target.value);
              }}
              className="mt-2 block min-h-[110px] w-full rounded-[16px] border border-transparent bg-[#1d1c2e] px-4 py-3.5 text-[16px] leading-[1.5] text-[#e9e7f3] outline-none hover:border-[#2f2d48] focus:border-[#c9c0ff] focus:ring-4 focus:ring-[#c9c0ff]/20 focus-visible:outline-none! sm:text-[14px]"
            />
            <button
              type="button"
              onClick={() => void copy("msg", shownMessage)}
              disabled={!shownMessage}
              className={`mt-2.5 inline-flex min-h-11 items-center gap-2 rounded-full px-1 text-[14px] font-bold text-[#c9c0ff] transition-colors hover:text-white disabled:opacity-50 motion-reduce:transition-none mb-14 sm:mb-12 ${focusCls} focus-visible:outline-[#c9c0ff]!`}
            >
              {copied === "msg" ? <Check className="h-4 w-4" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
              {copied === "msg" ? "Copied" : "Copy message"}
            </button>
          </div>
        </section>

        <section aria-labelledby="ref-joined-h" className="lc-card rounded-[28px] p-5 sm:p-6">
          <h2 id="ref-joined-h" className="text-[18px] font-extrabold tracking-[-0.01em]">
            Signed up through your link
          </h2>
          <p className="mt-0.5 text-[13px] text-[#66647c]">
            {joined.length} {joined.length === 1 ? "friend" : "friends"}
          </p>
          {joined.length === 0 ? (
            <p className="mt-4 rounded-[16px] bg-[#f7f6fb] px-4 py-4 text-[14px] leading-[1.55] text-[#4a4862]">
              No one yet. When a friend creates an account from your link, they&apos;ll appear here.
            </p>
          ) : (
            <ul className="mt-3">
              {joined.map((r) => (
                <li key={r.id} className="flex items-center justify-between gap-3 border-t border-[#e2e0ea] py-3.5 text-[14px]">
                  <span className="truncate">{maskEmail(r.referredEmail ?? "")}</span>
                  <span className="shrink-0 rounded-full bg-[#dcf5ea] px-2.5 py-[5px] text-[12px] font-bold text-[#0b4f35]">Signed up</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
