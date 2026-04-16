"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  CheckCircle2,
  Circle,
  X,
  ChevronDown,
  ChevronUp,
  CreditCard,
  FileText,
  Target,
  Briefcase,
  Users,
  Sparkles,
  Trophy,
} from "lucide-react";

const DISMISSED_KEY = "lc_onboarding_dismissed_v1";

export type OnboardingStepId =
  | "activate_plan"
  | "create_resume"
  | "analyze_jd"
  | "track_application"
  | "add_contact";

type Step = {
  id: OnboardingStepId;
  title: string;
  description: string;
  cta: string;
  href: string;
  icon: typeof FileText;
  accentBg: string;
  accentText: string;
};

const STEPS: Step[] = [
  {
    id: "activate_plan",
    title: "Activate your plan",
    description: "Choose Starter, Professional, Elite, or Lifetime to unlock AI features.",
    cta: "Choose a plan",
    href: "/dashboard/settings/subscription",
    icon: CreditCard,
    accentBg: "bg-violet-50",
    accentText: "text-violet-600",
  },
  {
    id: "create_resume",
    title: "Create your first resume",
    description: "Pick a template and let AI help you write compelling bullet points.",
    cta: "Build resume",
    href: "/resume/new",
    icon: FileText,
    accentBg: "bg-blue-50",
    accentText: "text-blue-600",
  },
  {
    id: "analyze_jd",
    title: "Analyze a job description",
    description: "Paste a job posting — AI shows your match score and missing keywords.",
    cta: "Open Resume Builder",
    href: "/dashboard/resumes",
    icon: Target,
    accentBg: "bg-emerald-50",
    accentText: "text-emerald-600",
  },
  {
    id: "track_application",
    title: "Track your first application",
    description: "Add a job to your pipeline and stay organized across every stage.",
    cta: "Open Job Tracker",
    href: "/dashboard/job-tracker",
    icon: Briefcase,
    accentBg: "bg-amber-50",
    accentText: "text-amber-600",
  },
  {
    id: "add_contact",
    title: "Add a contact or company",
    description: "Build your professional network and track who you know at each company.",
    cta: "Add contact",
    href: "/dashboard/contacts",
    icon: Users,
    accentBg: "bg-rose-50",
    accentText: "text-rose-600",
  },
];

export type OnboardingChecklistProps = {
  /** Which steps are already completed based on server data */
  completedSteps: OnboardingStepId[];
};

export function OnboardingChecklist({ completedSteps }: OnboardingChecklistProps) {
  const [dismissed, setDismissed] = useState<boolean | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [activeStep, setActiveStep] = useState<OnboardingStepId | null>(null);

  useEffect(() => {
    const v = localStorage.getItem(DISMISSED_KEY);
    setDismissed(v === "1");
  }, []);

  function dismiss() {
    localStorage.setItem(DISMISSED_KEY, "1");
    setDismissed(true);
  }

  if (dismissed === null) return null; // avoid flicker
  if (dismissed) return null;

  const doneCount = STEPS.filter((s) => completedSteps.includes(s.id)).length;
  const totalCount = STEPS.length;
  const allDone = doneCount === totalCount;
  const progressPct = Math.round((doneCount / totalCount) * 100);

  // First incomplete step is highlighted by default
  const firstIncomplete = STEPS.find((s) => !completedSteps.includes(s.id));
  const highlighted = activeStep ?? firstIncomplete?.id ?? null;

  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.05)]">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#7C5CFC] text-white shadow-sm shadow-violet-500/20">
          {allDone ? <Trophy className="h-5 w-5" /> : <Sparkles className="h-5 w-5" />}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="text-[15px] font-bold text-gray-900">
              {allDone ? "You're all set! 🎉" : "Get started with Launch CV"}
            </p>
            <span className="rounded-full bg-violet-50 px-2.5 py-0.5 text-[12px] font-bold text-violet-700">
              {doneCount}/{totalCount}
            </span>
          </div>
          <p className="mt-0.5 text-[12px] text-gray-500">
            {allDone
              ? "All setup steps complete. You're ready to land interviews."
              : `Complete ${totalCount - doneCount} more step${totalCount - doneCount === 1 ? "" : "s"} to get the most out of Launch CV.`}
          </p>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() => setCollapsed((v) => !v)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-50 hover:text-gray-600"
            aria-label={collapsed ? "Expand onboarding" : "Collapse onboarding"}
          >
            {collapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
          </button>
          <button
            type="button"
            onClick={dismiss}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-50 hover:text-gray-600"
            aria-label="Dismiss onboarding"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Progress bar */}
      {!collapsed && (
        <div className="px-5 pb-1">
          <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#7C5CFC] to-[#7C3AED] transition-all duration-700"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      )}

      {/* Steps list */}
      {!collapsed && (
        <div className="divide-y divide-gray-50 px-3 pb-3 pt-2">
          {STEPS.map((step) => {
            const done = completedSteps.includes(step.id);
            const isActive = highlighted === step.id && !done;
            return (
              <button
                key={step.id}
                type="button"
                onClick={() => !done && setActiveStep(step.id)}
                className={`w-full rounded-xl px-3 py-3 text-left transition-colors ${
                  isActive ? "bg-violet-50/60" : "hover:bg-gray-50/70"
                } ${done ? "cursor-default" : "cursor-pointer"}`}
              >
                <div className="flex items-start gap-3">
                  {/* Status icon */}
                  <div className="mt-0.5 shrink-0">
                    {done ? (
                      <CheckCircle2 className="h-5 w-5 text-[#7C5CFC]" />
                    ) : (
                      <Circle className={`h-5 w-5 ${isActive ? "text-[#7C5CFC]" : "text-gray-300"}`} />
                    )}
                  </div>

                  {/* Feature icon */}
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${done ? "bg-gray-50" : step.accentBg}`}>
                    <step.icon className={`h-4 w-4 ${done ? "text-gray-300" : step.accentText}`} />
                  </div>

                  {/* Text */}
                  <div className="min-w-0 flex-1">
                    <p className={`text-[14px] font-semibold ${done ? "text-gray-400 line-through" : "text-gray-900"}`}>
                      {step.title}
                    </p>
                    {(!done && isActive) && (
                      <>
                        <p className="mt-0.5 text-[12px] leading-relaxed text-gray-500">{step.description}</p>
                        <Link
                          href={step.href}
                          className="mt-2 inline-flex items-center gap-1 rounded-lg bg-[#7C5CFC] px-3 py-1.5 text-[12px] font-bold text-white transition hover:bg-[#6B4CE0]"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {step.cta} →
                        </Link>
                      </>
                    )}
                    {done && (
                      <p className="text-[12px] text-gray-400">Completed</p>
                    )}
                    {(!done && !isActive) && (
                      <p className="text-[12px] text-gray-400">{step.description}</p>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* All done footer */}
      {allDone && !collapsed && (
        <div className="border-t border-gray-50 px-5 py-3">
          <p className="text-center text-[12px] text-gray-400">
            Platform fully set up. Dismiss this panel whenever you like.
          </p>
        </div>
      )}
    </div>
  );
}
