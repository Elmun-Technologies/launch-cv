"use client";

import { useMemo } from "react";
import { CheckCircle2, XCircle, MinusCircle } from "lucide-react";

export type SeoChecklistInput = {
  focusKeyword: string;
  title: string;
  metaDescription: string;
  slug: string;
  bodyMd: string;
};

type CheckState = "pass" | "fail" | "neutral";

type Check = {
  label: string;
  state: CheckState;
  detail?: string;
};

/** First non-empty, non-heading paragraph of a Markdown body. */
function firstParagraph(md: string): string {
  const blocks = md.split(/\n\s*\n/);
  for (const block of blocks) {
    const trimmed = block.trim();
    if (!trimmed) continue;
    if (/^#{1,6}\s/.test(trimmed)) continue; // heading
    if (/^!\[/.test(trimmed)) continue; // image-only block
    return trimmed;
  }
  return "";
}

/** Count of level-2 headings (`## …`) in a Markdown body. */
function countH2(md: string): number {
  const matches = md.match(/^##\s+.+$/gm);
  return matches ? matches.length : 0;
}

function includesKeyword(haystack: string, keyword: string): boolean {
  return haystack.toLowerCase().includes(keyword.toLowerCase());
}

export function computeSeoChecks(input: SeoChecklistInput): Check[] {
  const keyword = input.focusKeyword.trim();
  const metaLen = input.metaDescription.trim().length;
  const h2Count = countH2(input.bodyMd);

  const keywordChecks: Check[] = keyword
    ? [
        {
          label: "Focus keyword in title",
          state: includesKeyword(input.title, keyword) ? "pass" : "fail",
        },
        {
          label: "Focus keyword in meta description",
          state: includesKeyword(input.metaDescription, keyword) ? "pass" : "fail",
        },
        {
          label: "Focus keyword in first paragraph",
          state: includesKeyword(firstParagraph(input.bodyMd), keyword) ? "pass" : "fail",
        },
        {
          label: "Focus keyword in slug",
          state: input.slug
            ? includesKeyword(input.slug, keyword.replace(/\s+/g, "-"))
              ? "pass"
              : "fail"
            : "neutral",
          detail: input.slug ? undefined : "slug auto-generated on save",
        },
      ]
    : [
        {
          label: "Set a focus keyword to unlock keyword checks",
          state: "neutral",
        },
      ];

  const metaCheck: Check = {
    label: "Meta description length (120–160)",
    state: metaLen === 0 ? "fail" : metaLen >= 120 && metaLen <= 160 ? "pass" : "fail",
    detail: `${metaLen} chars`,
  };

  const h2Check: Check = {
    label: "At least 2 H2 subheadings",
    state: h2Count >= 2 ? "pass" : "fail",
    detail: `${h2Count} found`,
  };

  return [...keywordChecks, metaCheck, h2Check];
}

const ICON: Record<CheckState, typeof CheckCircle2> = {
  pass: CheckCircle2,
  fail: XCircle,
  neutral: MinusCircle,
};

const TONE: Record<CheckState, string> = {
  pass: "text-[#0b7a4f]",
  fail: "text-[#a15c00]",
  neutral: "text-[#7c7a94]",
};

const STATE_LABEL: Record<CheckState, string> = {
  pass: "Passed",
  fail: "Needs work",
  neutral: "Not checked",
};

export function SeoChecklist(input: SeoChecklistInput) {
  const checks = useMemo(() => computeSeoChecks(input), [input]);
  const passed = checks.filter((c) => c.state === "pass").length;
  const scorable = checks.filter((c) => c.state !== "neutral").length;
  const allPassed = scorable > 0 && passed === scorable;

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <span className="text-[13px] font-bold text-[#121226]">SEO checklist</span>
        <span
          className={`rounded-full px-2.5 py-[5px] text-[12px] font-bold leading-none ${
            allPassed ? "bg-[#dcf5ea] text-[#0b4f35]" : "bg-[#fdf0d5] text-[#7a4600]"
          }`}
        >
          {passed}/{scorable} passed
        </span>
      </div>
      <ul className="mt-2.5 flex flex-col gap-2">
        {checks.map((check, i) => {
          const Icon = ICON[check.state];
          return (
            <li key={i} className="flex items-start gap-2 text-[13px] leading-[19px] text-[#4a4862]">
              <Icon className={`mt-px h-4 w-4 shrink-0 ${TONE[check.state]}`} aria-hidden="true" />
              <span>
                <span className="sr-only">{STATE_LABEL[check.state]}: </span>
                {check.label}
                {check.detail ? <span className="ml-1 text-[#66647c]">· {check.detail}</span> : null}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
