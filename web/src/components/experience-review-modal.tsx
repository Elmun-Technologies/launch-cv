"use client";

import { useEffect, useState } from "react";
import { Star, X, Loader2 } from "lucide-react";
import {
  markSatisfactionSurveyPromptedToday,
  markSatisfactionSurveySkipped,
  markSatisfactionSurveySubmitted,
} from "@/lib/satisfaction-survey";

type Step = 0 | 1 | 2 | 3;

const QUESTIONS: { title: string; subtitle?: string; type: "stars" | "nps" }[] = [
  { title: "How would you rate your overall experience?", type: "stars" },
  { title: "How likely are you to recommend our site to others?", type: "stars" },
  {
    title: "How likely are you to recommend Launch CV to your friends, family, and colleagues?",
    subtitle: "0 = not at all likely · 10 = extremely likely",
    type: "nps",
  },
];

type Props = {
  open: boolean;
  onClose: () => void;
  context?: string;
};

export function ExperienceReviewModal({ open, onClose, context = "general" }: Props) {
  const [step, setStep] = useState<Step>(0);
  const [overall, setOverall] = useState(0);
  const [recommend, setRecommend] = useState(0);
  const [nps, setNps] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) markSatisfactionSurveyPromptedToday();
  }, [open]);

  function reset() {
    setStep(0);
    setOverall(0);
    setRecommend(0);
    setNps(null);
    setSubmitting(false);
    setError(null);
  }

  function handleClose(skip = true) {
    if (skip && step < 3) markSatisfactionSurveySkipped();
    reset();
    onClose();
  }

  async function submit() {
    if (overall < 1 || recommend < 1 || nps === null) return;
    setSubmitting(true);
    setError(null);
    try {
      const r = await fetch("/api/feedback/survey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          context,
          overallStars: overall,
          recommendStars: recommend,
          nps,
        }),
      });
      if (!r.ok) {
        const j = (await r.json().catch(() => ({}))) as { error?: string };
        throw new Error(j.error || "Could not save feedback");
      }
      markSatisfactionSurveySubmitted();
      setStep(3);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  if (!open) return null;

  const q = QUESTIONS[step];
  const isStars = q?.type === "stars";
  const canNext =
    step === 0 ? overall > 0 : step === 1 ? recommend > 0 : step === 2 ? nps !== null : false;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm">
      <div
        className="relative w-full max-w-[440px] rounded-2xl border border-gray-100 bg-white shadow-2xl shadow-violet-200/30"
        role="dialog"
        aria-modal="true"
        aria-labelledby="exp-review-title"
      >
        <button
          type="button"
          onClick={() => handleClose(true)}
          className="absolute right-3 top-3 rounded-lg p-2 text-gray-400 transition hover:bg-gray-50 hover:text-gray-600"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {step < 3 ? (
          <div className="p-8 pt-10">
            <p className="text-center text-[13px] leading-relaxed text-gray-500">
              We&apos;re glad you&apos;re using Launch CV. Please take a moment to help us improve.
            </p>
            <h2 id="exp-review-title" className="mt-5 text-center text-[17px] font-bold text-gray-900">
              {q.title}
            </h2>
            {q.subtitle ? (
              <p className="mt-2 text-center text-[12px] text-gray-400">{q.subtitle}</p>
            ) : null}

            <div className="mt-8 flex min-h-[52px] flex-col items-center justify-center gap-3">
              {isStars && step === 0 ? (
                <StarRow value={overall} onChange={setOverall} />
              ) : null}
              {isStars && step === 1 ? (
                <StarRow value={recommend} onChange={setRecommend} />
              ) : null}
              {step === 2 ? (
                <div className="flex w-full flex-wrap justify-center gap-1.5">
                  {Array.from({ length: 11 }, (_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setNps(i)}
                      className={`flex h-10 w-10 items-center justify-center rounded-full text-[13px] font-semibold transition ${
                        nps === i
                          ? "bg-[#7C5CFC] text-white shadow-md shadow-violet-200"
                          : "border border-gray-200 bg-white text-gray-600 hover:border-[#7C5CFC]/40 hover:bg-violet-50"
                      }`}
                    >
                      {i}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            {error ? <p className="mt-4 text-center text-[13px] font-medium text-red-600">{error}</p> : null}

            <div className="mt-10 flex items-center justify-between border-t border-gray-100 pt-5">
              <span className="text-[11px] text-gray-400">Your feedback stays private</span>
              {step < 2 ? (
                <button
                  type="button"
                  disabled={!canNext}
                  onClick={() => setStep((s) => (s + 1) as Step)}
                  className="rounded-xl bg-[#7C5CFC] px-6 py-2.5 text-[14px] font-semibold text-white transition hover:bg-[#6B4CE0] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              ) : (
                <button
                  type="button"
                  disabled={!canNext || submitting}
                  onClick={() => void submit()}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#7C5CFC] px-6 py-2.5 text-[14px] font-semibold text-white transition hover:bg-[#6B4CE0] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  Submit
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="p-10 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50">
              <Star className="h-7 w-7 fill-emerald-500 text-emerald-500" />
            </div>
            <h2 className="mt-5 text-[18px] font-bold text-gray-900">Thank you!</h2>
            <p className="mt-2 text-[14px] text-gray-500">Your ratings help us build a better product.</p>
            <button
              type="button"
              onClick={() => handleClose(false)}
              className="mt-8 rounded-xl bg-[#7C5CFC] px-8 py-3 text-[14px] font-semibold text-white transition hover:bg-[#6B4CE0]"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function StarRow({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return (
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          className="rounded-lg p-1 transition hover:scale-110"
          aria-label={`${n} stars`}
        >
          <Star
            className={`h-10 w-10 ${n <= value ? "fill-amber-400 text-amber-400" : "fill-gray-100 text-gray-200"}`}
          />
        </button>
      ))}
    </div>
  );
}
