"use client";

import { useState } from "react";
import { Mail, Bell, CheckCircle2 } from "lucide-react";

interface NotificationPref {
  id: string;
  label: string;
  description: string;
  defaultOn: boolean;
}

const EMAIL_PREFS: NotificationPref[] = [
  { id: "email_updates", label: "Product updates", description: "New features, improvements, and announcements", defaultOn: true },
  { id: "email_weekly", label: "Weekly summary", description: "A weekly digest of your activity and job market insights", defaultOn: true },
  { id: "email_tips", label: "Career advice", description: "Resume tips, interview prep, and career growth content", defaultOn: false },
  { id: "email_referral", label: "Referral rewards", description: "Notifications when your referrals sign up or earn rewards", defaultOn: true },
  { id: "email_marketing", label: "Promotions", description: "Special offers, discounts, and promotional content", defaultOn: false },
];

const PUSH_PREFS: NotificationPref[] = [
  { id: "push_applications", label: "Application updates", description: "Status changes on your job applications", defaultOn: true },
  { id: "push_reminders", label: "Follow-up reminders", description: "Reminders to follow up on pending applications", defaultOn: true },
  { id: "push_system", label: "System alerts", description: "Security alerts, maintenance windows, and account notices", defaultOn: true },
];

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors ${
        checked ? "bg-[#7C5CFC]" : "bg-gray-200"
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-[22px]" : "translate-x-0.5"
        } mt-0.5`}
      />
    </button>
  );
}

export default function NotificationsPage() {
  const [prefs, setPrefs] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(
      [...EMAIL_PREFS, ...PUSH_PREFS].map((p) => [p.id, p.defaultOn]),
    ),
  );
  const [saved, setSaved] = useState(false);

  function toggle(id: string) {
    setPrefs((prev) => ({ ...prev, [id]: !prev[id] }));
    setSaved(false);
  }

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8 p-6">
      {/* Header */}
      <div>
        <h1 className="text-[28px] font-bold text-gray-900">Notifications</h1>
        <p className="mt-1 text-[15px] text-gray-500">
          Choose how you want to be notified
        </p>
      </div>

      {/* Email Notifications */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
            <Mail className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-[15px] font-bold text-gray-900">
              Email Notifications
            </h2>
            <p className="text-[12px] text-gray-400">
              Manage what emails you receive
            </p>
          </div>
        </div>
        <div className="mt-6 divide-y divide-gray-50">
          {EMAIL_PREFS.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between py-4 first:pt-0 last:pb-0"
            >
              <div className="pr-4">
                <p className="text-[13px] font-medium text-gray-900">
                  {p.label}
                </p>
                <p className="mt-0.5 text-[12px] text-gray-400">
                  {p.description}
                </p>
              </div>
              <Toggle checked={!!prefs[p.id]} onChange={() => toggle(p.id)} />
            </div>
          ))}
        </div>
      </div>

      {/* Push Notifications */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Bell className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-[15px] font-bold text-gray-900">
              Push Notifications
            </h2>
            <p className="text-[12px] text-gray-400">
              Alerts delivered to your browser
            </p>
          </div>
        </div>
        <div className="mt-6 divide-y divide-gray-50">
          {PUSH_PREFS.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between py-4 first:pt-0 last:pb-0"
            >
              <div className="pr-4">
                <p className="text-[13px] font-medium text-gray-900">
                  {p.label}
                </p>
                <p className="mt-0.5 text-[12px] text-gray-400">
                  {p.description}
                </p>
              </div>
              <Toggle checked={!!prefs[p.id]} onChange={() => toggle(p.id)} />
            </div>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={handleSave}
          className="rounded-xl bg-[#7C5CFC] px-8 py-3 text-[13px] font-semibold text-white transition hover:bg-[#6B4CE0]"
        >
          Save Preferences
        </button>
        {saved && (
          <span className="flex items-center gap-1.5 text-[13px] font-medium text-emerald-600">
            <CheckCircle2 className="h-4 w-4" />
            Saved!
          </span>
        )}
      </div>
    </div>
  );
}
