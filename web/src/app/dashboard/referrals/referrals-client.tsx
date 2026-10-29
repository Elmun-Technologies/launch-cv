"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Check, Copy, Loader2, Mail } from "lucide-react";

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
    <div className="mx-auto flex max-w-[1080px] flex-col gap-5">
      <div>
        <h1 className="text-[28px] font-semibold tracking-[-0.02em] text-[#111111]">
          Referrals <span className="text-[#8A8A86]">— share LaunchCV with a friend.</span>
        </h1>
        <p className="mt-1 text-[15px] text-[#6B6B6B]">
          Anyone who signs up through your link shows up below. Their ATS check is free, like yours.
        </p>
      </div>

      <section className="rounded-[14px] border border-[#E5E5E2] bg-white p-6">
        <h2 className="text-[17px] font-semibold text-[#111111]">Your link</h2>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <label className="min-w-0 flex-1">
            <span className="sr-only">Your referral link</span>
            <input
              readOnly
              value={link}
              placeholder={generating ? "Creating your link…" : ""}
              onFocus={(e) => e.currentTarget.select()}
              className="soha-input bg-[#FAFAF9] text-[#3F3F3F]"
            />
          </label>
          <button
            type="button"
            onClick={() => void copy("link", link)}
            disabled={!link}
            className="soha-btn-primary inline-flex shrink-0 items-center justify-center gap-2 disabled:opacity-60"
          >
            {generating ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            ) : copied === "link" ? (
              <Check className="h-4 w-4" aria-hidden />
            ) : (
              <Copy className="h-4 w-4" aria-hidden />
            )}
            {copied === "link" ? "Copied" : "Copy link"}
          </button>
        </div>
        {error ? (
          <p role="alert" className="mt-3 text-[14px] text-[#B42318]">
            {error}
          </p>
        ) : null}

        <div className="mt-6 border-t border-[#EEEEEB] pt-5">
          <label htmlFor="ref-message" className="soha-label mb-1.5">
            Message
          </label>
          <textarea
            id="ref-message"
            className="soha-textarea min-h-[96px]"
            value={shownMessage}
            onChange={(e) => {
              setEdited(true);
              setMessage(e.target.value);
            }}
          />
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => void copy("msg", shownMessage)}
              disabled={!shownMessage}
              className="soha-btn-secondary inline-flex items-center gap-2 disabled:opacity-60"
            >
              {copied === "msg" ? <Check className="h-4 w-4" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
              {copied === "msg" ? "Copied" : "Copy message"}
            </button>
            {shareLinks.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target={s.label === "Email" ? undefined : "_blank"}
                rel="noreferrer"
                className="inline-flex h-10 items-center gap-2 rounded-full border border-[#D9D9D5] px-4 text-[14px] font-medium text-[#111111] hover:border-[#111111]"
              >
                {s.label === "Email" ? <Mail className="h-4 w-4" aria-hidden /> : null}
                {s.label === "Email" ? "Email" : `Share on ${s.label}`}
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-[14px] border border-[#E5E5E2] bg-white p-6">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="text-[17px] font-semibold text-[#111111]">Signed up through your link</h2>
          <span className="text-[14px] tabular-nums text-[#6B6B6B]">{joined.length}</span>
        </div>
        {joined.length === 0 ? (
          <p className="mt-2 text-[14px] text-[#6B6B6B]">No one yet. When a friend creates an account from your link, they&apos;ll appear here.</p>
        ) : (
          <ul className="mt-4 divide-y divide-[#EEEEEB] border-t border-[#EEEEEB]">
            {joined.map((r) => (
              <li key={r.id} className="flex items-center justify-between gap-3 py-3 text-[14px]">
                <span className="truncate text-[#111111]">{maskEmail(r.referredEmail ?? "")}</span>
                <span className="shrink-0 text-[#0E7A48]">Signed up</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
