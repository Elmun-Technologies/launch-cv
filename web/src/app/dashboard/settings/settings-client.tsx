"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  ChevronRight, Loader2, X, Eye, EyeOff,
  User, Lock, Link2, Briefcase, Sparkles,
} from "lucide-react";
import { subscriptionRowGrantsPro } from "@/lib/entitlements";
import { PUBLIC_PRICING } from "@/lib/monetization";

type Sub = { status: string; currentPeriodEnd: string | null } | null;

const settingsNav = [
  { href: "/dashboard/settings", label: "Edit Profile", exact: true },
  { href: "/dashboard/settings/overview", label: "Overview" },
  { href: "/dashboard/settings/subscription", label: "Pro Subscription" },
  { href: "/dashboard/referrals", label: "Referrals" },
  { href: "/dashboard/settings/notifications", label: "Notification" },
];

export function SettingsClient({
  subscription,
  userName,
  userEmail,
}: {
  emailVerified?: boolean;
  subscription: Sub;
  userName?: string | null;
  userEmail?: string | null;
}) {
  const pathname = usePathname();
  const isPro = subscriptionRowGrantsPro(
    subscription
      ? {
          status: subscription.status,
          currentPeriodEnd: subscription.currentPeriodEnd ? new Date(subscription.currentPeriodEnd) : null,
        }
      : null,
  );

  const [firstName, setFirstName] = useState(userName?.split(" ")[0] ?? "");
  const [lastName, setLastName] = useState(userName?.split(" ").slice(1).join(" ") ?? "");
  const [email, setEmail] = useState(userEmail ?? "");
  const [phone, setPhone] = useState("");
  const [username, setUsername] = useState("");
  const [wantEmails, setWantEmails] = useState(true);
  const [jobTitle, setJobTitle] = useState("");
  const [profileUrl, setProfileUrl] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [saving, setSaving] = useState(false);
  const [billingMsg, setBillingMsg] = useState<string | null>(null);

  async function saveProfile() {
    setSaving(true);
    setBillingMsg(null);
    const body: Record<string, string> = {};
    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
    if (fullName) body.name = fullName;
    if (newPassword && newPassword === confirmPassword) body.newPassword = newPassword;
    if (newPassword && newPassword !== confirmPassword) {
      setBillingMsg("Passwords do not match");
      setSaving(false);
      return;
    }
    const res = await fetch("/api/account", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setSaving(false);
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setBillingMsg(j.error ?? "Could not save");
      return;
    }
    setBillingMsg("Profile saved successfully!");
    setNewPassword("");
    setConfirmPassword("");
  }

  const isSuccess = billingMsg === "Profile saved successfully!";

  return (
    <div className="flex gap-8">
      {/* ── Left Nav ── */}
      <div className="hidden w-56 shrink-0 lg:block">
        <h2 className="text-[17px] font-bold text-gray-900">Settings</h2>
        <nav className="mt-5 space-y-1">
          {settingsNav.map((item) => {
            const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-[13px] transition-all ${
                  active
                    ? "bg-[#7C5CFC] font-semibold text-white shadow-[0_2px_8px_rgba(124,92,252,0.25)]"
                    : "text-gray-500 hover:bg-violet-50 hover:text-gray-900"
                }`}
              >
                <span>{item.label}</span>
                <ChevronRight className={`h-4 w-4 ${active ? "text-white/70" : "text-gray-300"}`} />
              </Link>
            );
          })}
        </nav>
      </div>

      {/* ── Right Content ── */}
      <div className="min-w-0 flex-1">
        {!isPro ? (
          <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-[#7C5CFC]/20 bg-gradient-to-r from-violet-50 to-white p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#7C5CFC] text-white">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[14px] font-bold text-gray-900">
                  Pro — {PUBLIC_PRICING.priceDisplay} / year
                </p>
                <p className="mt-1 text-[12px] leading-relaxed text-gray-600">{PUBLIC_PRICING.upsellHook}</p>
              </div>
            </div>
            <Link
              href="/dashboard/settings/subscription"
              className="inline-flex shrink-0 items-center justify-center rounded-xl bg-[#7C5CFC] px-5 py-2.5 text-[13px] font-bold text-white transition hover:bg-[#6B4CE0]"
            >
              Upgrade
            </Link>
          </div>
        ) : null}
        <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-100">
                <User className="h-4 w-4 text-[#7C5CFC]" />
              </div>
              <div>
                <h2 className="text-[28px] font-bold leading-tight text-gray-900">Profile Information</h2>
                <p className="mt-0.5 text-[13px] text-gray-400">Manage your personal details and preferences</p>
              </div>
            </div>
            <button type="button" className="flex h-9 w-9 items-center justify-center rounded-xl text-gray-400 transition hover:bg-gray-50 hover:text-gray-600">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-8 space-y-0">
            {/* ── Section: Personal Details ── */}
            <div className="pb-7">
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-50">
                  <User className="h-3.5 w-3.5 text-[#7C5CFC]" />
                </div>
                <h3 className="text-[15px] font-bold text-gray-900">Personal Details</h3>
              </div>

              <div className="mt-5 space-y-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-[12px] font-semibold text-gray-700">First Name*</label>
                    <input className="soha-input mt-1.5" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Naimur" />
                  </div>
                  <div>
                    <label className="text-[12px] font-semibold text-gray-700">Last Name*</label>
                    <input className="soha-input mt-1.5" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Rahman" />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-[12px] font-semibold text-gray-700">Email*</label>
                    <input className="soha-input mt-1.5" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="naimurrohman@gmail.com" />
                  </div>
                  <div>
                    <label className="text-[12px] font-semibold text-gray-700">Phone*</label>
                    <input className="soha-input mt-1.5" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+888+" />
                  </div>
                </div>

                <div>
                  <label className="text-[12px] font-semibold text-gray-700">Username*</label>
                  <div className="mt-1.5 flex">
                    <span className="flex items-center rounded-l-xl border border-r-0 border-gray-100 bg-[#FAFAFA] px-3 text-[13px] text-gray-400">HTTPS://</span>
                    <input className="soha-input rounded-l-none" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="www.linkedin.com" />
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <input type="checkbox" checked={wantEmails} onChange={(e) => setWantEmails(e.target.checked)} className="h-4 w-4 rounded border-gray-200 text-[#7C5CFC] accent-[#7C5CFC]" />
                  <span className="text-[13px] text-gray-500">Yes, I want to receive emails</span>
                </div>

                <div>
                  <label className="text-[12px] font-semibold text-gray-700">Photo*</label>
                  <div className="mt-2 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#7C5CFC] to-[#A78BFA] text-sm font-bold text-white shadow-[0_2px_8px_rgba(124,92,252,0.3)]">
                      {firstName?.[0]?.toUpperCase() ?? "U"}
                    </div>
                    <button type="button" className="rounded-xl bg-[#7C5CFC] px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-[#6B4CE0] hover:shadow-[0_4px_12px_rgba(124,92,252,0.25)]">Upload</button>
                    <button type="button" className="rounded-xl border border-[#7C5CFC]/20 px-4 py-2 text-[13px] font-semibold text-[#7C5CFC] transition hover:bg-violet-50">Reset</button>
                  </div>
                </div>

                <div>
                  <label className="text-[12px] font-semibold text-gray-700">
                    <span className="flex items-center gap-1.5">
                      <Briefcase className="h-3 w-3 text-gray-400" />
                      Job Title
                    </span>
                  </label>
                  <textarea className="soha-textarea mt-1.5 min-h-[80px]" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} placeholder="Senior Product Designer" />
                  <p className="mt-1 text-[11px] text-gray-400">Brief description for your profile. URLs are hyperlinked</p>
                </div>
              </div>
            </div>

            {/* ── Section: Social Links ── */}
            <div className="border-t border-gray-100 pb-7 pt-7">
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-50">
                  <Link2 className="h-3.5 w-3.5 text-[#7C5CFC]" />
                </div>
                <h3 className="text-[15px] font-bold text-gray-900">Social Links</h3>
              </div>

              <div className="mt-5">
                <label className="text-[12px] font-semibold text-gray-700">URL</label>
                <div className="mt-1.5 flex">
                  <span className="flex items-center rounded-l-xl border border-r-0 border-gray-100 bg-[#FAFAFA] px-3 text-[13px] text-gray-400">HTTPS://</span>
                  <input className="soha-input rounded-l-none" value={profileUrl} onChange={(e) => setProfileUrl(e.target.value)} placeholder="www.linkedin.com" />
                </div>
              </div>
            </div>

            {/* ── Section: Security ── */}
            <div className="border-t border-gray-100 pb-7 pt-7">
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-50">
                  <Lock className="h-3.5 w-3.5 text-[#7C5CFC]" />
                </div>
                <div>
                  <h3 className="text-[15px] font-bold text-gray-900">Change Password</h3>
                  <p className="mt-0.5 text-[12px] text-gray-400">Update your password to keep your account secure</p>
                </div>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-[12px] font-semibold text-gray-700">New Password</label>
                  <div className="relative mt-1.5">
                    <input type={showNewPw ? "text" : "password"} className="soha-input pr-10" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="••••••••••" />
                    <button type="button" tabIndex={-1} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-600" onClick={() => setShowNewPw((s) => !s)}>
                      {showNewPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-[12px] font-semibold text-gray-700">Confirm Password</label>
                  <div className="relative mt-1.5">
                    <input type={showConfirmPw ? "text" : "password"} className="soha-input pr-10" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••••" />
                    <button type="button" tabIndex={-1} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-600" onClick={() => setShowConfirmPw((s) => !s)}>
                      {showConfirmPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Footer: Terms + Actions ── */}
            <div className="border-t border-gray-100 pt-6">
              <div className="flex items-center gap-2.5">
                <input type="checkbox" checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} className="h-4 w-4 rounded border-gray-200 text-[#7C5CFC] accent-[#7C5CFC]" />
                <span className="text-[13px] text-gray-500">I agree to the Terms, Privacy and Fees</span>
              </div>

              {billingMsg && (
                <div className={`mt-4 rounded-xl px-4 py-3 text-[13px] font-medium ${
                  isSuccess
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-red-50 text-red-600"
                }`}>
                  {billingMsg}
                </div>
              )}

              <div className="mt-5 flex gap-3">
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => void saveProfile()}
                  className="rounded-xl bg-[#7C5CFC] px-6 py-2.5 text-[13px] font-semibold text-white transition-all hover:bg-[#6B4CE0] hover:shadow-[0_4px_12px_rgba(124,92,252,0.25)] disabled:opacity-60"
                >
                  {saving ? <Loader2 className="mr-1.5 inline h-4 w-4 animate-spin" /> : null}
                  Save Changes
                </button>
                <button type="button" className="rounded-xl border border-[#7C5CFC]/20 px-6 py-2.5 text-[13px] font-semibold text-[#7C5CFC] transition hover:bg-violet-50">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
