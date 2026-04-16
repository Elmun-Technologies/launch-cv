"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Check,
  Copy,
  Gift,
  Link2,
  Loader2,
  Mail,
  MessageSquare,
  Send,
  Share2,
  UserPlus,
  Users,
  X,
  Zap,
} from "lucide-react";

export type ReferralRow = {
  id: string;
  code: string;
  referredEmail: string | null;
  status: string;
  creditAmount: number;
  createdAt: string;
};

function baseUrl() {
  if (typeof window !== "undefined") {
    return process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
  }
  return process.env.NEXT_PUBLIC_APP_URL || "";
}

export function ReferralsClient({ initial }: { initial: ReferralRow[] }) {
  const [rows, setRows] = useState(initial);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showInviteMsg, setShowInviteMsg] = useState(false);
  const [showEmailInvites, setShowEmailInvites] = useState(false);
  const [emailInviteVal, setEmailInviteVal] = useState("");

  const activePendingCode = useMemo(
    () => rows.find((r) => r.status === "pending" && !r.referredEmail) ?? null,
    [rows],
  );
  const referralLink = activePendingCode
    ? `${baseUrl()}/register?ref=${activePendingCode.code}`
    : "";

  const totalReferrals = useMemo(
    () => rows.filter((r) => Boolean(r.referredEmail)).length,
    [rows],
  );
  const creditedCount = useMemo(
    () => rows.filter((r) => r.status === "credited").length,
    [rows],
  );
  const creditsEarned = useMemo(
    () => rows.filter((r) => r.status === "credited").reduce((sum, r) => sum + r.creditAmount, 0),
    [rows],
  );

  const generateCode = useCallback(async (forceNew = false) => {
    setGenerating(true);
    setError(null);
    try {
      const res = await fetch("/api/referrals/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ forceNew }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Failed to generate referral code");
        return;
      }
      const r = json.referral;
      setRows((prev) => {
        const nextRow: ReferralRow = {
          id: r.id,
          code: r.code,
          referredEmail: r.referredEmail ?? null,
          status: r.status,
          creditAmount: r.creditAmount,
          createdAt: r.createdAt,
        };
        const idx = prev.findIndex((x) => x.id === nextRow.id);
        if (idx >= 0) {
          const copy = [...prev];
          copy[idx] = nextRow;
          return copy;
        }
        return [nextRow, ...prev];
      });
    } catch {
      setError("Network error");
    } finally {
      setGenerating(false);
    }
  }, []);

  useEffect(() => {
    if (!activePendingCode && !generating) {
      void generateCode();
    }
  }, [activePendingCode, generateCode, generating]);

  async function copyLink() {
    if (!referralLink) return;
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Failed to copy");
    }
  }

  const progressCurrent = totalReferrals % 5;
  const progressPct = Math.min(100, Math.round((progressCurrent / 5) * 100));

  const [inviteDescription, setInviteDescription] = useState(
    `I've been using Launch CV to manage my job search. I've found it really helpful so far and think you might too! Get started for free here: ${referralLink}`,
  );

  useEffect(() => {
    setInviteDescription(
      `I've been using Launch CV to manage my job search. I've found it really helpful so far and think you might too! Get started for free here: ${referralLink}`,
    );
  }, [referralLink]);

  const stats = [
    { label: "Total Invited", value: totalReferrals, icon: Users, color: "bg-violet-50 text-[#7C5CFC]" },
    { label: "Credited", value: creditedCount, icon: Check, color: "bg-emerald-50 text-emerald-600" },
    { label: "Credits Earned", value: `$${creditsEarned}`, icon: Zap, color: "bg-amber-50 text-amber-600" },
  ];

  const steps = [
    { step: 1, icon: Link2, title: "Share your link", desc: "Send your unique referral link to friends" },
    { step: 2, icon: UserPlus, title: "Friends sign up", desc: "They create a free Launch CV account" },
    { step: 3, icon: Gift, title: "Earn credits", desc: "Get $9 for every 5 successful referrals" },
  ];

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <h1 className="text-[28px] font-semibold tracking-[-0.02em] text-gray-900">
        Referrals
      </h1>

      {/* Invite Friends Card */}
      <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
        <div className="mx-auto max-w-xl text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50">
            <Gift className="h-7 w-7 text-[#7C5CFC]" />
          </div>
          <h2 className="text-[15px] font-bold text-gray-900">Invite Friends to Launch CV</h2>
          <p className="mt-1.5 text-[13px] leading-relaxed text-gray-500">
            Get $9 in credit for every 5 people you refer. Share your unique link below.
          </p>

          <div className="mt-6 flex items-center gap-2">
            <div className="relative flex-1">
              <input
                readOnly
                value={referralLink}
                placeholder="Generating your invite link..."
                className="soha-input h-11 w-full rounded-xl border-gray-200 bg-gray-50 pl-4 pr-4 text-[13px] text-gray-700"
              />
            </div>
            <button
              type="button"
              onClick={() => void copyLink()}
              disabled={!referralLink}
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#7C5CFC] px-5 text-[13px] font-semibold text-white transition hover:bg-[#6B4CE0] disabled:opacity-60"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy Link
                </>
              )}
            </button>
          </div>
          {error && <p className="mt-3 text-[13px] text-red-500">{error}</p>}
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-gray-100 bg-white px-5 py-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
          >
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${s.color}`}>
                <s.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[13px] text-gray-500">{s.label}</p>
                <p className="text-[22px] font-bold tracking-[-0.02em] text-gray-900">{s.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* How It Works */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
        <h2 className="text-[15px] font-bold text-gray-900">How it works</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {steps.map((s) => (
            <div
              key={s.step}
              className="flex items-start gap-3 rounded-xl border border-gray-100 p-4 transition hover:border-[#7C5CFC]/20 hover:bg-violet-50/30"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#7C5CFC] text-[13px] font-bold text-white">
                {s.step}
              </div>
              <div>
                <p className="text-[13px] font-semibold text-gray-900">{s.title}</p>
                <p className="mt-0.5 text-[13px] leading-relaxed text-gray-500">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
        <div className="flex items-center justify-between">
          <h2 className="text-[15px] font-bold text-gray-900">Progress to next reward</h2>
          <span className="text-[13px] font-semibold text-[#7C5CFC]">{progressCurrent}/5 referrals</span>
        </div>
        <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-violet-100">
          <div
            className="h-full rounded-full bg-[#7C5CFC] transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <p className="mt-2 text-[13px] text-gray-500">
          {5 - progressCurrent} more referral{5 - progressCurrent !== 1 ? "s" : ""} to earn your next $9 credit
        </p>
      </div>

      {/* Share Section */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
        <h2 className="text-[15px] font-bold text-gray-900">Share with your network</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralLink)}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-gray-200 px-5 text-[13px] font-semibold text-gray-700 transition hover:border-[#0A66C2] hover:bg-blue-50 hover:text-[#0A66C2]"
          >
            <Link2 className="h-4 w-4" />
            LinkedIn
          </a>
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out Launch CV – the best tool to manage your job search! ${referralLink}`)}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-gray-200 px-5 text-[13px] font-semibold text-gray-700 transition hover:border-[#1DA1F2] hover:bg-sky-50 hover:text-[#1DA1F2]"
          >
            <Send className="h-4 w-4" />
            Twitter
          </a>
          <button
            type="button"
            onClick={() => setShowEmailInvites(true)}
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-gray-200 px-5 text-[13px] font-semibold text-gray-700 transition hover:border-[#7C5CFC] hover:bg-violet-50 hover:text-[#7C5CFC]"
          >
            <Mail className="h-4 w-4" />
            Email
          </button>
          <button
            type="button"
            onClick={() => setShowInviteMsg(true)}
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-gray-200 px-5 text-[13px] font-semibold text-gray-700 transition hover:border-[#7C5CFC] hover:bg-violet-50 hover:text-[#7C5CFC]"
          >
            <Mail className="h-4 w-4" />
            Custom Message
          </button>
        </div>
      </div>

      {/* ── Invite Message Modal ── */}
      {showInviteMsg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-gray-100 bg-white p-7 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-[15px] font-bold text-gray-900">Invite Message</h3>
              <button
                type="button"
                onClick={() => setShowInviteMsg(false)}
                className="rounded-lg p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <label className="text-[13px] font-semibold text-gray-700">Message</label>
            <textarea
              className="soha-textarea mt-1.5 min-h-[120px] rounded-xl text-[13px]"
              value={inviteDescription}
              onChange={(e) => setInviteDescription(e.target.value)}
            />

            <div className="mt-5 grid grid-cols-3 gap-3">
              {[
                { label: "LinkedIn", icon: Share2, color: "#0A66C2", bg: "bg-blue-50" },
                { label: "Twitter", icon: MessageSquare, color: "#1DA1F2", bg: "bg-sky-50" },
                { label: "Email", icon: Mail, color: "#7C5CFC", bg: "bg-violet-50" },
              ].map((s) => (
                <button
                  key={s.label}
                  type="button"
                  className="flex flex-col items-center gap-1.5 rounded-xl border border-gray-200 py-3 transition hover:border-[#7C5CFC]/30 hover:bg-violet-50/30"
                >
                  <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${s.bg}`}>
                    <s.icon className="h-4 w-4" style={{ color: s.color }} />
                  </div>
                  <span className="text-[13px] font-medium text-gray-700">{s.label}</span>
                </button>
              ))}
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  void navigator.clipboard.writeText(inviteDescription);
                  setShowInviteMsg(false);
                }}
                className="h-10 rounded-xl bg-[#7C5CFC] px-6 text-[13px] font-semibold text-white transition hover:bg-[#6B4CE0]"
              >
                Copy Message
              </button>
              <button
                type="button"
                onClick={() => setShowInviteMsg(false)}
                className="h-10 rounded-xl border border-gray-200 px-6 text-[13px] font-semibold text-gray-600 transition hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Email Invites Modal ── */}
      {showEmailInvites && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-gray-100 bg-white p-7 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-[15px] font-bold text-gray-900">Email Invites</h3>
              <button
                type="button"
                onClick={() => setShowEmailInvites(false)}
                className="rounded-lg p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-[13px] text-gray-500">
              Add one or more emails, separated by commas.
            </p>
            <input
              type="text"
              placeholder="name@email.com, name2@email.com"
              className="soha-input mt-3 h-11 w-full rounded-xl text-[13px]"
              value={emailInviteVal}
              onChange={(e) => setEmailInviteVal(e.target.value)}
            />

            <label className="mt-4 inline-flex items-center gap-2 text-[13px] text-gray-600">
              <input
                type="checkbox"
                defaultChecked
                className="h-4 w-4 rounded border-gray-300 text-[#7C5CFC] accent-[#7C5CFC]"
              />
              Your credentials are encrypted &amp; can be revoked at any time
            </label>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setShowEmailInvites(false)}
                className="h-10 rounded-xl bg-[#7C5CFC] px-6 text-[13px] font-semibold text-white transition hover:bg-[#6B4CE0]"
              >
                Send Invites
              </button>
              <button
                type="button"
                onClick={() => setShowEmailInvites(false)}
                className="h-10 rounded-xl border border-gray-200 px-6 text-[13px] font-semibold text-gray-600 transition hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
