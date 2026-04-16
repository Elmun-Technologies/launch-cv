"use client";

import { useState, useMemo, useCallback } from "react";
import {
  Search, ChevronDown, Sparkles, ExternalLink, RotateCcw,
  Check, X, AlertTriangle, Plus, Building2, Loader2,
} from "lucide-react";
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
  applied?: boolean;
};

type MatchResult = {
  score: number;
  keywordGaps: KeywordGap[];
  cultureFit: CultureFit[];
  formatRecommendations: { label: string; done: boolean }[];
  bulletRewrites: BulletRewrite[];
  advice: string[];
};

const TIERS = [
  { key: "all", label: "All" },
  { key: "faang", label: "FAANG+" },
  { key: "tech", label: "Tech" },
  { key: "finance", label: "Finance" },
  { key: "consulting", label: "Consulting" },
  { key: "startup", label: "Startup" },
] as const;

const TIER_COLORS: Record<string, string> = {
  faang: "bg-violet-50 text-[#7C5CFC]",
  tech: "bg-blue-50 text-blue-600",
  finance: "bg-emerald-50 text-emerald-600",
  consulting: "bg-amber-50 text-amber-600",
  startup: "bg-rose-50 text-rose-600",
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
        <span className="text-[32px] font-bold tracking-tight" style={{ color }}>
          {score}
        </span>
        <span className="text-[11px] font-medium text-gray-400">/ 100</span>
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
    <div className="animate-pulse space-y-6 rounded-2xl border border-gray-100 bg-white p-6">
      <div className="flex items-center gap-6">
        <div className="h-36 w-36 rounded-full bg-gray-100" />
        <div className="flex-1 space-y-3">
          <div className="h-5 w-48 rounded bg-gray-100" />
          <div className="h-4 w-72 rounded bg-gray-100" />
          <div className="h-4 w-56 rounded bg-gray-100" />
        </div>
      </div>
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-10 rounded-xl bg-gray-50" />
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
      setLoading(true);
      try {
        const res = await fetch("/api/ai/company-match", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ resumeId: selectedResumeId, companyId: company.id }),
        });
        if (!res.ok) throw new Error("Analysis failed");
        const data: MatchResult = await res.json();
        setResult(data);
        setBulletRewrites(data.bulletRewrites);
      } catch {
        setResult(null);
      } finally {
        setLoading(false);
      }
    },
    [selectedResumeId],
  );

  const analyzeCustom = useCallback(async () => {
    if (!selectedResumeId || !customName.trim()) return;
    setSelectedCompany({ id: "custom", name: customName, logo: customName[0]?.toUpperCase() ?? "?", industry: customIndustry, tier: "startup", keywords: [], culture: [], formatTips: [], mustHave: [], avoid: [], exampleBullet: "" });
    setResult(null);
    setLoading(true);
    try {
      const res = await fetch("/api/ai/company-match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeId: selectedResumeId, customCompany: { name: customName, industry: customIndustry, jobDescription: customJD } }),
      });
      if (!res.ok) throw new Error("Analysis failed");
      const data: MatchResult = await res.json();
      setResult(data);
      setBulletRewrites(data.bulletRewrites);
    } catch {
      setResult(null);
    } finally {
      setLoading(false);
    }
  }, [selectedResumeId, customName, customIndustry, customJD]);

  const handleApplyRewrite = (idx: number) => {
    setBulletRewrites((prev) =>
      prev.map((b, i) => (i === idx ? { ...b, applied: true } : b)),
    );
  };

  const resetAnalysis = () => {
    setSelectedCompany(null);
    setResult(null);
    setLoading(false);
    setBulletRewrites([]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-[28px] font-semibold tracking-[-0.02em] text-gray-900">
          Company Matcher
        </h1>
        <p className="mt-1 text-[13px] text-gray-500">
          Analyze how well your resume matches specific company requirements
        </p>
      </div>

      {/* Resume Selector */}
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
        <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.08em] text-gray-400">
          Select Resume
        </label>
        <div className="relative w-full max-w-sm">
          <select
            value={selectedResumeId}
            onChange={(e) => setSelectedResumeId(e.target.value)}
            className="h-11 w-full appearance-none rounded-xl border border-gray-200 bg-white pl-4 pr-10 text-[13px] font-medium text-gray-900 transition focus:border-[#7C5CFC] focus:outline-none focus:ring-2 focus:ring-violet-100"
          >
            {resumes.length === 0 && <option value="">No resumes available</option>}
            {resumes.map((r) => (
              <option key={r.id} value={r.id}>{r.title}</option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* Analysis Results Panel */}
      {(loading || result) && selectedCompany && (
        <div className="space-y-6">
          {loading ? (
            <SkeletonBlock />
          ) : result ? (
            <>
              {/* Match Score */}
              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                <div className="flex flex-col items-center gap-6 sm:flex-row">
                  <ScoreGauge score={result.score} />
                  <div className="flex-1">
                    <h2 className="text-[20px] font-semibold text-gray-900">
                      {selectedCompany.name} Match
                    </h2>
                    <p className="mt-1 text-[13px] text-gray-500">
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
                      <span className="rounded-full bg-gray-50 px-3 py-1 text-[11px] font-semibold text-gray-500">
                        {selectedCompany.industry}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Keyword Gaps */}
              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                <h3 className="mb-4 text-[15px] font-semibold text-gray-900">Keyword Analysis</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-gray-100 text-[11px] uppercase tracking-wider text-gray-400">
                        <th className="pb-3 pr-4 font-semibold">Keyword</th>
                        <th className="pb-3 pr-4 font-semibold">Status</th>
                        <th className="pb-3 font-semibold">Suggestion</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {result.keywordGaps.map((gap, i) => (
                        <tr key={i} className="text-[13px]">
                          <td className="py-3 pr-4 font-medium text-gray-900">{gap.keyword}</td>
                          <td className="py-3 pr-4"><StatusBadge status={gap.status} /></td>
                          <td className="py-3 text-gray-500">{gap.suggestion}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Culture Fit */}
              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                <h3 className="mb-4 text-[15px] font-semibold text-gray-900">Culture Fit</h3>
                <div className="space-y-4">
                  {result.cultureFit.map((item, i) => (
                    <div key={i}>
                      <div className="mb-1.5 flex items-center justify-between text-[13px]">
                        <span className="font-medium text-gray-700">{item.aspect}</span>
                        <span className="font-semibold text-gray-900">{item.score}/10</span>
                      </div>
                      <div className="h-2.5 overflow-hidden rounded-full bg-gray-100">
                        <div
                          className="h-full rounded-full transition-all duration-700 ease-out"
                          style={{
                            width: `${item.score * 10}%`,
                            background: `linear-gradient(90deg, #7C5CFC ${Math.max(0, 100 - item.score * 12)}%, ${item.score >= 7 ? "#10B981" : item.score >= 5 ? "#F59E0B" : "#EF4444"})`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Format Recommendations */}
              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                <h3 className="mb-4 text-[15px] font-semibold text-gray-900">Format Recommendations</h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {result.formatRecommendations.map((rec, i) => (
                    <div
                      key={i}
                      className={`flex items-center gap-3 rounded-xl border p-4 text-[13px] ${
                        rec.done
                          ? "border-emerald-100 bg-emerald-50/50"
                          : "border-gray-100 bg-gray-50/50"
                      }`}
                    >
                      <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${rec.done ? "bg-emerald-500 text-white" : "bg-gray-200 text-gray-400"}`}>
                        {rec.done ? <Check className="h-3.5 w-3.5" /> : <span className="text-[10px] font-bold">{i + 1}</span>}
                      </div>
                      <span className={rec.done ? "text-emerald-700" : "text-gray-700"}>{rec.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bullet Rewrites */}
              {bulletRewrites.length > 0 && (
                <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                  <h3 className="mb-4 text-[15px] font-semibold text-gray-900">Bullet Rewrites</h3>
                  <div className="space-y-4">
                    {bulletRewrites.map((bullet, i) => (
                      <div key={i} className="rounded-xl border border-gray-100 bg-gray-50/50 p-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div>
                            <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-gray-400">Original</span>
                            <p className="text-[13px] leading-relaxed text-gray-400 line-through decoration-red-300">
                              {bullet.original}
                            </p>
                          </div>
                          <div>
                            <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-emerald-500">Improved</span>
                            <p className="text-[13px] font-medium leading-relaxed text-gray-900">
                              {bullet.improved}
                            </p>
                          </div>
                        </div>
                        <div className="mt-3 flex justify-end">
                          <button
                            type="button"
                            onClick={() => handleApplyRewrite(i)}
                            disabled={bullet.applied}
                            className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-[12px] font-semibold transition ${
                              bullet.applied
                                ? "bg-emerald-50 text-emerald-600"
                                : "bg-[#7C5CFC] text-white hover:bg-[#6B4CE0]"
                            }`}
                          >
                            {bullet.applied ? (
                              <><Check className="h-3.5 w-3.5" /> Applied</>
                            ) : (
                              <><Sparkles className="h-3.5 w-3.5" /> Apply</>
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Overall Advice */}
              {result.advice.length > 0 && (
                <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                  <h3 className="mb-4 text-[15px] font-semibold text-gray-900">Overall Advice</h3>
                  <div className="space-y-3">
                    {result.advice.map((tip, i) => (
                      <div key={i} className="flex gap-3 rounded-xl border border-gray-100 bg-gray-50/50 p-4">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#7C5CFC] text-[12px] font-bold text-white">
                          {i + 1}
                        </div>
                        <p className="text-[13px] leading-relaxed text-gray-700">{tip}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <a
                  href={`/resume/${selectedResumeId}/edit`}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#7C5CFC] px-6 py-3 text-[13px] font-semibold text-white transition hover:bg-[#6B4CE0] hover:shadow-[0_4px_12px_rgba(124,92,252,0.25)]"
                >
                  <ExternalLink className="h-4 w-4" /> Open in Editor
                </a>
                <button
                  type="button"
                  onClick={resetAnalysis}
                  className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 text-[13px] font-semibold text-gray-700 transition hover:border-gray-300 hover:bg-gray-50"
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
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative w-full max-w-sm">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search companies, industries, or keywords..."
                  className="h-11 w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 text-[13px] text-gray-900 placeholder-gray-400 transition focus:border-[#7C5CFC] focus:outline-none focus:ring-2 focus:ring-violet-100"
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
                        ? "bg-[#7C5CFC] text-white shadow-sm shadow-violet-500/20"
                        : "bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
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
                className="group rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition hover:border-[#7C5CFC]/30 hover:shadow-lg"
              >
                <div className="flex items-start gap-3">
                  <div
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-[14px] font-bold text-white"
                    style={{
                      backgroundColor:
                        company.tier === "faang" ? "#7C5CFC"
                          : company.tier === "tech" ? "#3B82F6"
                            : company.tier === "finance" ? "#10B981"
                              : company.tier === "consulting" ? "#F59E0B"
                                : "#F43F5E",
                    }}
                  >
                    {company.logo}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-[14px] font-semibold text-gray-900">
                      {company.name}
                    </h3>
                    <p className="text-[12px] text-gray-400">{company.industry}</p>
                  </div>
                  <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${TIER_COLORS[company.tier]}`}>
                    {company.tier}
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {company.keywords.slice(0, 4).map((kw) => (
                    <span
                      key={kw}
                      className="rounded-md bg-gray-50 px-2 py-0.5 text-[11px] font-medium text-gray-500"
                    >
                      {kw}
                    </span>
                  ))}
                  {company.keywords.length > 4 && (
                    <span className="rounded-md bg-gray-50 px-2 py-0.5 text-[11px] font-medium text-gray-400">
                      +{company.keywords.length - 4}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => analyzeCompany(company)}
                  disabled={!selectedResumeId}
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#7C5CFC] py-2.5 text-[12px] font-semibold text-white transition hover:bg-[#6B4CE0] hover:shadow-[0_4px_12px_rgba(124,92,252,0.25)] disabled:opacity-40"
                >
                  <Sparkles className="h-3.5 w-3.5" /> Analyze Match
                </button>
              </div>
            ))}

            {/* Custom Company Card */}
            <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
              {!showCustom ? (
                <button
                  type="button"
                  onClick={() => setShowCustom(true)}
                  className="flex h-full w-full flex-col items-center justify-center gap-3 py-8 text-gray-400 transition hover:text-[#7C5CFC]"
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
                    <Building2 className="h-4 w-4 text-[#7C5CFC]" />
                    <span className="text-[13px] font-semibold text-gray-900">Custom Company</span>
                  </div>
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="Company name"
                    className="h-10 w-full rounded-xl border border-gray-200 bg-white px-3 text-[13px] text-gray-900 placeholder-gray-400 transition focus:border-[#7C5CFC] focus:outline-none focus:ring-2 focus:ring-violet-100"
                  />
                  <input
                    type="text"
                    value={customIndustry}
                    onChange={(e) => setCustomIndustry(e.target.value)}
                    placeholder="Industry"
                    className="h-10 w-full rounded-xl border border-gray-200 bg-white px-3 text-[13px] text-gray-900 placeholder-gray-400 transition focus:border-[#7C5CFC] focus:outline-none focus:ring-2 focus:ring-violet-100"
                  />
                  <textarea
                    value={customJD}
                    onChange={(e) => setCustomJD(e.target.value)}
                    placeholder="Paste job description here..."
                    rows={4}
                    className="w-full resize-none rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-[13px] text-gray-900 placeholder-gray-400 transition focus:border-[#7C5CFC] focus:outline-none focus:ring-2 focus:ring-violet-100"
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={analyzeCustom}
                      disabled={!selectedResumeId || !customName.trim()}
                      className="flex-1 rounded-xl bg-[#7C5CFC] py-2.5 text-[12px] font-semibold text-white transition hover:bg-[#6B4CE0] disabled:opacity-40"
                    >
                      <span className="inline-flex items-center gap-1.5">
                        <Sparkles className="h-3.5 w-3.5" /> Analyze
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => { setShowCustom(false); setCustomName(""); setCustomIndustry(""); setCustomJD(""); }}
                      className="rounded-xl border border-gray-200 px-4 py-2.5 text-[12px] font-semibold text-gray-500 transition hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {filtered.length === 0 && (
            <div className="rounded-2xl border border-gray-100 bg-white py-16 text-center shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
              <Search className="mx-auto h-8 w-8 text-gray-300" />
              <p className="mt-3 text-[14px] font-medium text-gray-500">No companies found</p>
              <p className="mt-1 text-[13px] text-gray-400">Try adjusting your search or filters</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
