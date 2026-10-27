"use client";

import Link from "next/link";
import { useState, useMemo, useCallback } from "react";
import {
  Search, ChevronDown, Sparkles, ExternalLink, RotateCcw,
  Check, X, AlertTriangle, Plus, Building2,
} from "lucide-react";
import { CopyButton } from "@/components/copy-button";
import { COMPANIES, searchCompanies, type CompanyRequirement } from "@/lib/company-requirements";

type Resume = { id: string; title: string; updatedAt: string };

type KeywordGap = {
  keyword: string;
  status: "found" | "missing" | "partial";
  suggestion: string;
};

type CultureFit = { aspect: string; score: number };

type BulletRewrite = {
  original: string;
  improved: string;
};

type MatchResult = {
  score: number;
  keywordGaps: KeywordGap[];
  cultureFit: CultureFit[];
  formatRecommendations: { label: string; done: boolean }[];
  bulletRewrites: BulletRewrite[];
  advice: string[];
};

type ApiResult = {
  matchScore?: number;
  keywordGaps?: KeywordGap[];
  cultureFit?: CultureFit[];
  formatRecommendations?: string[];
  bulletRewrites?: { original: string; improved: string }[];
  overallAdvice?: string[];
};

/** The API returns `{ result }` in its own shape; map it onto what this view renders. */
function toMatchResult(r: ApiResult): MatchResult {
  return {
    score: Math.max(0, Math.min(100, Math.round(r.matchScore ?? 0))),
    keywordGaps: r.keywordGaps ?? [],
    cultureFit: r.cultureFit ?? [],
    formatRecommendations: (r.formatRecommendations ?? []).map((label) => ({ label, done: false })),
    bulletRewrites: (r.bulletRewrites ?? []).map((b) => ({ original: b.original, improved: b.improved })),
    advice: r.overallAdvice ?? [],
  };
}

async function requestMatch(body: unknown): Promise<{ data: MatchResult } | { error: string; upgrade: boolean }> {
  const res = await fetch("/api/ai/company-match", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }).catch(() => null);
  const j = res ? await res.json().catch(() => ({})) : {};
  if (res?.ok && j.result) return { data: toMatchResult(j.result as ApiResult) };
  return {
    error: typeof j.error === "string" ? j.error : "Couldn't run the analysis. Please try again.",
    upgrade: res?.status === 402 || res?.status === 403,
  };
}

const TIERS = [
  { key: "all", label: "All" },
  { key: "faang", label: "FAANG+" },
  { key: "tech", label: "Tech" },
  { key: "finance", label: "Finance" },
  { key: "consulting", label: "Consulting" },
  { key: "startup", label: "Startup" },
] as const;

const TIER_COLORS: Record<string, string> = {
  faang: "bg-[#F5F5F3] text-[#3F3F3F]",
  tech: "bg-[#F5F5F3] text-[#3F3F3F]",
  finance: "bg-[#F5F5F3] text-[#3F3F3F]",
  consulting: "bg-[#F5F5F3] text-[#3F3F3F]",
  startup: "bg-[#F5F5F3] text-[#3F3F3F]",
};

function ScoreGauge({ score }: { score: number }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color =
    score >= 80 ? "#10B981" : score >= 60 ? "#F59E0B" : "#EF4444";

  return (
    <div className="relative flex h-36 w-36 items-center justify-center">
      <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
        <circle
          cx="60" cy="60" r={radius}
          fill="none" stroke="#F3F4F6" strokeWidth="10"
        />
        <circle
          cx="60" cy="60" r={radius}
          fill="none" stroke={color} strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-[stroke-dashoffset] duration-1000 ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-[32px] font-semibold tracking-tight" style={{ color }}>
          {score}
        </span>
        <span className="text-[11px] font-medium text-[#6E6E6A]">/ 100</span>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: "found" | "missing" | "partial" }) {
  const map = {
    found: "bg-emerald-50 text-emerald-600",
    missing: "bg-red-50 text-red-500",
    partial: "bg-amber-50 text-amber-600",
  };
  const icons = {
    found: <Check className="mr-1 h-3 w-3" />,
    missing: <X className="mr-1 h-3 w-3" />,
    partial: <AlertTriangle className="mr-1 h-3 w-3" />,
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize ${map[status]}`}>
      {icons[status]}{status}
    </span>
  );
}

function SkeletonBlock() {
  return (
    <div className="animate-pulse space-y-6 rounded-2xl border border-[#EEEEEB] bg-white p-6">
      <div className="flex items-center gap-6">
        <div className="h-36 w-36 rounded-full bg-[#F5F5F3]" />
        <div className="flex-1 space-y-3">
          <div className="h-5 w-48 rounded bg-[#F5F5F3]" />
          <div className="h-4 w-72 rounded bg-[#F5F5F3]" />
          <div className="h-4 w-56 rounded bg-[#F5F5F3]" />
        </div>
      </div>
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-10 rounded-xl bg-[#FAFAF9]" />
        ))}
      </div>
    </div>
  );
}

export function MatcherClient({ resumes }: { resumes: Resume[] }) {
  const [selectedResumeId, setSelectedResumeId] = useState(resumes[0]?.id ?? "");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTier, setActiveTier] = useState("all");
  const [selectedCompany, setSelectedCompany] = useState<CompanyRequirement | null>(null);
  const [result, setResult] = useState<MatchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [showCustom, setShowCustom] = useState(false);
  const [customName, setCustomName] = useState("");
  const [customIndustry, setCustomIndustry] = useState("");
  const [customJD, setCustomJD] = useState("");
  const [bulletRewrites, setBulletRewrites] = useState<BulletRewrite[]>([]);
  const [error, setError] = useState<{ error: string; upgrade: boolean } | null>(null);

  const filtered = useMemo(() => {
    let list: CompanyRequirement[] = COMPANIES;
    if (activeTier !== "all") list = list.filter((c) => c.tier === activeTier);
    if (searchQuery.trim()) list = searchCompanies(searchQuery).filter((c) => activeTier === "all" || c.tier === activeTier);
    return list;
  }, [searchQuery, activeTier]);

  const analyzeCompany = useCallback(
    async (company: CompanyRequirement) => {
      if (!selectedResumeId) return;
      setSelectedCompany(company);
      setResult(null);
      setError(null);
      setLoading(true);
      const out = await requestMatch({ resumeId: selectedResumeId, companyId: company.id });
      setLoading(false);
      if ("data" in out) {
        setResult(out.data);
        setBulletRewrites(out.data.bulletRewrites);
      } else setError(out);
    },
    [selectedResumeId],
  );

  const analyzeCustom = useCallback(async () => {
    if (!selectedResumeId || !customName.trim()) return;
    setSelectedCompany({ id: "custom", name: customName, logo: customName[0]?.toUpperCase() ?? "?", industry: customIndustry, tier: "startup", keywords: [], culture: [], formatTips: [], mustHave: [], avoid: [], exampleBullet: "" });
    setResult(null);
    setError(null);
    setLoading(true);
    const out = await requestMatch({ resumeId: selectedResumeId, customCompany: { name: customName, industry: customIndustry, jobDescription: customJD } });
    setLoading(false);
    if ("data" in out) {
      setResult(out.data);
      setBulletRewrites(out.data.bulletRewrites);
    } else setError(out);
  }, [selectedResumeId, customName, customIndustry, customJD]);


  const resetAnalysis = () => {
    setError(null);
    setSelectedCompany(null);
    setResult(null);
    setLoading(false);
    setBulletRewrites([]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-[28px] font-semibold tracking-[-0.02em] text-[#111111]">
          Company matcher <span className="text-[#8A8A86]">— tailor your resume to one employer.</span>
        </h1>
        <p className="mt-1 text-[15px] text-[#6B6B6B]">
          Pick a company to see which keywords and values your resume already covers, and what to add.
        </p>
      </div>

      {/* Resume Selector */}
      <div className="rounded-2xl border border-[#EEEEEB] bg-white p-5">
        <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6E6E6A]">
          Select Resume
        </label>
        <div className="relative w-full max-w-sm">
          <select
            value={selectedResumeId}
            onChange={(e) => setSelectedResumeId(e.target.value)}
            className="h-11 w-full appearance-none rounded-xl border border-[#E5E5E2] bg-white pl-4 pr-10 text-[13px] font-medium text-[#111111] transition focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#DCE6FF]"
          >
            {resumes.length === 0 && <option value="">No resumes available</option>}
            {resumes.map((r) => (
              <option key={r.id} value={r.id}>{r.title}</option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6E6E6A]" />
        </div>
      </div>

      {error ? (
        <p role="alert" className="rounded-xl border border-[#F6D3CD] bg-[#FDF2F0] px-4 py-3 text-[14px] text-[#B42318]">
          {error.error}{" "}
          {error.upgrade ? (
            <Link href="/dashboard/settings/subscription" className="font-medium underline">
              See plans
            </Link>
          ) : null}
        </p>
      ) : null}

      {/* Analysis Results Panel */}
      {(loading || result) && selectedCompany && (
        <div className="space-y-6">
          {loading ? (
            <SkeletonBlock />
          ) : result ? (
            <>
              {/* Match Score */}
              <div className="rounded-2xl border border-[#EEEEEB] bg-white p-6">
                <div className="flex flex-col items-center gap-6 sm:flex-row">
                  <ScoreGauge score={result.score} />
                  <div className="flex-1">
                    <h2 className="text-[20px] font-semibold text-[#111111]">
                      {selectedCompany.name} Match
                    </h2>
                    <p className="mt-1 text-[13px] text-[#6B6B6B]">
                      {result.score >= 80
                        ? "Excellent match! Your resume aligns strongly with this company."
                        : result.score >= 60
                          ? "Good foundation, but there are areas to improve for a stronger match."
                          : "Significant gaps found. Focus on the recommendations below."}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className={`rounded-full px-3 py-1 text-[11px] font-semibold ${TIER_COLORS[selectedCompany.tier]}`}>
                        {selectedCompany.tier.toUpperCase()}
                      </span>
                      <span className="rounded-full bg-[#FAFAF9] px-3 py-1 text-[11px] font-semibold text-[#6B6B6B]">
                        {selectedCompany.industry}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Keyword Gaps */}
              <div className="rounded-2xl border border-[#EEEEEB] bg-white p-6">
                <h3 className="mb-4 text-[15px] font-semibold text-[#111111]">Keyword Analysis</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-[#EEEEEB] text-[11px] uppercase tracking-wider text-[#6E6E6A]">
                        <th className="pb-3 pr-4 font-semibold">Keyword</th>
                        <th className="pb-3 pr-4 font-semibold">Status</th>
                        <th className="pb-3 font-semibold">Suggestion</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EEEEEB]">
                      {result.keywordGaps.map((gap, i) => (
                        <tr key={i} className="text-[13px]">
                          <td className="py-3 pr-4 font-medium text-[#111111]">{gap.keyword}</td>
                          <td className="py-3 pr-4"><StatusBadge status={gap.status} /></td>
                          <td className="py-3 text-[#6B6B6B]">{gap.suggestion}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Culture Fit */}
              <div className="rounded-2xl border border-[#EEEEEB] bg-white p-6">
                <h3 className="mb-4 text-[15px] font-semibold text-[#111111]">Culture Fit</h3>
                <div className="space-y-4">
                  {result.cultureFit.map((item, i) => (
                    <div key={i}>
                      <div className="mb-1.5 flex items-center justify-between text-[13px]">
                        <span className="font-medium text-[#3F3F3F]">{item.aspect}</span>
                        <span className="font-semibold text-[#111111]">{item.score}/10</span>
                      </div>
                      <div className="h-2.5 overflow-hidden rounded-full bg-[#F5F5F3]">
                        <div
                          className="h-full rounded-full transition-all duration-700 ease-out"
                          style={{
                            width: `${item.score * 10}%`,
                            background: `linear-gradient(90deg, #2563EB ${Math.max(0, 100 - item.score * 12)}%, ${item.score >= 7 ? "#10B981" : item.score >= 5 ? "#F59E0B" : "#EF4444"})`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Format Recommendations */}
              <div className="rounded-2xl border border-[#EEEEEB] bg-white p-6">
                <h3 className="mb-4 text-[15px] font-semibold text-[#111111]">Format Recommendations</h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {result.formatRecommendations.map((rec, i) => (
                    <div
                      key={i}
                      className={`flex items-center gap-3 rounded-xl border p-4 text-[13px] ${
                        rec.done
                          ? "border-emerald-100 bg-emerald-50/50"
                          : "border-[#EEEEEB] bg-[#FAFAF9]/50"
                      }`}
                    >
                      <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${rec.done ? "bg-emerald-500 text-white" : "bg-[#EEEEEB] text-[#6E6E6A]"}`}>
                        {rec.done ? <Check className="h-3.5 w-3.5" /> : <span className="text-[10px] font-semibold">{i + 1}</span>}
                      </div>
                      <span className={rec.done ? "text-emerald-700" : "text-[#3F3F3F]"}>{rec.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bullet Rewrites */}
              {bulletRewrites.length > 0 && (
                <div className="rounded-2xl border border-[#EEEEEB] bg-white p-6">
                  <h3 className="mb-4 text-[15px] font-semibold text-[#111111]">Bullet Rewrites</h3>
                  <div className="space-y-4">
                    {bulletRewrites.map((bullet, i) => (
                      <div key={i} className="rounded-xl border border-[#EEEEEB] bg-[#FAFAF9]/50 p-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div>
                            <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-[#6E6E6A]">Original</span>
                            <p className="text-[13px] leading-relaxed text-[#6E6E6A] line-through decoration-red-300">
                              {bullet.original}
                            </p>
                          </div>
                          <div>
                            <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-emerald-500">Improved</span>
                            <p className="text-[13px] font-medium leading-relaxed text-[#111111]">
                              {bullet.improved}
                            </p>
                          </div>
                        </div>
                        <div className="mt-3 flex justify-end">
<CopyButton text={bullet.improved} label="Copy rewrite" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Overall Advice */}
              {result.advice.length > 0 && (
                <div className="rounded-2xl border border-[#EEEEEB] bg-white p-6">
                  <h3 className="mb-4 text-[15px] font-semibold text-[#111111]">Overall Advice</h3>
                  <div className="space-y-3">
                    {result.advice.map((tip, i) => (
                      <div key={i} className="flex gap-3 rounded-xl border border-[#EEEEEB] bg-[#FAFAF9]/50 p-4">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#2563EB] text-[12px] font-semibold text-white">
                          {i + 1}
                        </div>
                        <p className="text-[13px] leading-relaxed text-[#3F3F3F]">{tip}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <a
                  href={`/resume/${selectedResumeId}/edit`}
                  className="inline-flex items-center gap-2 rounded-full bg-[#2563EB] px-6 py-3 text-[13px] font-semibold text-white transition hover:bg-[#1D4ED8]"
                >
                  <ExternalLink className="h-4 w-4" /> Open in Editor
                </a>
                <button
                  type="button"
                  onClick={resetAnalysis}
                  className="inline-flex items-center gap-2 rounded-xl border border-[#E5E5E2] bg-white px-6 py-3 text-[13px] font-semibold text-[#3F3F3F] transition hover:border-[#D9D9D5] hover:bg-[#FAFAF9]"
                >
                  <RotateCcw className="h-4 w-4" /> Try Another Company
                </button>
              </div>
            </>
          ) : null}
        </div>
      )}

      {/* Company Grid (hidden when results showing) */}
      {!selectedCompany && (
        <>
          {/* Search + Filters */}
          <div className="rounded-2xl border border-[#EEEEEB] bg-white p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative w-full max-w-sm">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6E6E6A]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search companies, industries, or keywords..."
                  className="h-11 w-full rounded-xl border border-[#E5E5E2] bg-white pl-10 pr-4 text-[13px] text-[#111111] placeholder-gray-400 transition focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#DCE6FF]"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {TIERS.map((tier) => (
                  <button
                    key={tier.key}
                    type="button"
                    onClick={() => setActiveTier(tier.key)}
                    className={`rounded-full px-4 py-2 text-[12px] font-semibold transition ${
                      activeTier === tier.key
                        ? "bg-[#111111] text-white"
                        : "bg-[#FAFAF9] text-[#6B6B6B] hover:bg-[#F5F5F3] hover:text-[#3F3F3F]"
                    }`}
                  >
                    {tier.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((company) => (
              <div
                key={company.id}
                className="group rounded-2xl border border-[#EEEEEB] bg-white p-5 transition hover:border-[#D9D9D5]"
              >
                <div className="flex items-start gap-3">
                  <div
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F5F5F3] text-[14px] font-semibold text-[#111111]"
                  >
                    {company.logo}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-[14px] font-semibold text-[#111111]">
                      {company.name}
                    </h3>
                    <p className="text-[12px] text-[#6E6E6A]">{company.industry}</p>
                  </div>
                  <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase ${TIER_COLORS[company.tier]}`}>
                    {company.tier}
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {company.keywords.slice(0, 4).map((kw) => (
                    <span
                      key={kw}
                      className="rounded-md bg-[#FAFAF9] px-2 py-0.5 text-[11px] font-medium text-[#6B6B6B]"
                    >
                      {kw}
                    </span>
                  ))}
                  {company.keywords.length > 4 && (
                    <span className="rounded-md bg-[#FAFAF9] px-2 py-0.5 text-[11px] font-medium text-[#6E6E6A]">
                      +{company.keywords.length - 4}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => analyzeCompany(company)}
                  disabled={!selectedResumeId}
                  className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-full border border-[#D9D9D5] text-[13px] font-medium text-[#111111] transition hover:border-[#111111] disabled:opacity-40"
                >
                  <Sparkles className="h-3.5 w-3.5" /> Analyze Match
                </button>
              </div>
            ))}

            {/* Custom Company Card */}
            <div className="rounded-2xl border border-dashed border-[#E5E5E2] bg-white p-5">
              {!showCustom ? (
                <button
                  type="button"
                  onClick={() => setShowCustom(true)}
                  className="flex h-full w-full flex-col items-center justify-center gap-3 py-8 text-[#6E6E6A] transition hover:text-[#2563EB]"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-dashed border-current">
                    <Plus className="h-5 w-5" />
                  </div>
                  <span className="text-[13px] font-semibold">Custom Company</span>
                  <span className="text-[12px]">Paste a job description</span>
                </button>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-[#2563EB]" />
                    <span className="text-[13px] font-semibold text-[#111111]">Custom Company</span>
                  </div>
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="Company name"
                    className="h-10 w-full rounded-xl border border-[#E5E5E2] bg-white px-3 text-[13px] text-[#111111] placeholder-gray-400 transition focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#DCE6FF]"
                  />
                  <input
                    type="text"
                    value={customIndustry}
                    onChange={(e) => setCustomIndustry(e.target.value)}
                    placeholder="Industry"
                    className="h-10 w-full rounded-xl border border-[#E5E5E2] bg-white px-3 text-[13px] text-[#111111] placeholder-gray-400 transition focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#DCE6FF]"
                  />
                  <textarea
                    value={customJD}
                    onChange={(e) => setCustomJD(e.target.value)}
                    placeholder="Paste job description here..."
                    rows={4}
                    className="w-full resize-none rounded-xl border border-[#E5E5E2] bg-white px-3 py-2.5 text-[13px] text-[#111111] placeholder-gray-400 transition focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#DCE6FF]"
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={analyzeCustom}
                      disabled={!selectedResumeId || !customName.trim()}
                      className="flex-1 rounded-full bg-[#2563EB] py-2.5 text-[12px] font-semibold text-white transition hover:bg-[#1D4ED8] disabled:opacity-40"
                    >
                      <span className="inline-flex items-center gap-1.5">
                        <Sparkles className="h-3.5 w-3.5" /> Analyze
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => { setShowCustom(false); setCustomName(""); setCustomIndustry(""); setCustomJD(""); }}
                      className="rounded-xl border border-[#E5E5E2] px-4 py-2.5 text-[12px] font-semibold text-[#6B6B6B] transition hover:bg-[#FAFAF9]"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {filtered.length === 0 && (
            <div className="rounded-2xl border border-[#EEEEEB] bg-white py-16 text-center">
              <Search className="mx-auto h-8 w-8 text-[#8A8A86]" />
              <p className="mt-3 text-[14px] font-medium text-[#6B6B6B]">No companies found</p>
              <p className="mt-1 text-[13px] text-[#6E6E6A]">Try adjusting your search or filters</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
