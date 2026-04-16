"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { X, Plus, ChevronDown, Copy, Check } from "lucide-react";

export type JobRow = {
  id: string;
  resumeId: string;
  title: string | null;
  company: string | null;
  status: string;
  checklist: unknown;
  jdText?: string;
  createdAt: string;
  resume: { id: string; title: string };
};

const PIPELINE = [
  { key: "bookmarked", label: "Bookmarked" },
  { key: "applying", label: "Applying" },
  { key: "interviewing", label: "Interviewing" },
  { key: "negotiating", label: "Negotiating" },
  { key: "accepted", label: "Accepted" },
] as const;

type PipelineKey = (typeof PIPELINE)[number]["key"];

const STATUS_MAP: Record<string, PipelineKey> = {
  bookmarked: "bookmarked", draft: "bookmarked",
  applying: "applying", applied: "applying",
  interviewing: "interviewing", interview: "interviewing",
  negotiating: "negotiating", offer: "negotiating",
  accepted: "accepted",
};

function CopyBtn({ text, label }: { text: string; label: string }) {
  const [ok, setOk] = useState(false);
  return (
    <button type="button" onClick={() => { void navigator.clipboard.writeText(text); setOk(true); setTimeout(() => setOk(false), 1500); }}
      className="rounded-full bg-[#7C5CFC] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#6B4CE0]">
      {ok ? <><Check className="mr-1 inline h-3 w-3" />Copied</> : <><Copy className="mr-1 inline h-3 w-3" />{label}</>}
    </button>
  );
}

const SKILLS_DEMO = [
  { name: "Sketch", value: 70, price: "$2.00" },
  { name: "3D Modeling", value: 50, price: "$1.00" },
  { name: "Drawing", value: 85, price: "$3.00" },
  { name: "Eyes", value: 60, price: "$2.00" },
  { name: "New Products", value: 40, price: "$1.00" },
];

export function JobTrackerClient({ initial, resumes }: { initial: JobRow[]; resumes: { id: string; title: string }[] }) {
  const [apps, setApps] = useState(initial);
  const [tab, setTab] = useState<PipelineKey>("bookmarked");
  const [selected, setSelected] = useState<JobRow | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState({ resumeId: resumes[0]?.id ?? "", title: "", company: "", jdText: "", status: "bookmarked" });
  const [addErr, setAddErr] = useState<string | null>(null);
  const [addBusy, setAddBusy] = useState(false);

  const grouped = useMemo(() => {
    const map: Record<PipelineKey, JobRow[]> = { bookmarked: [], applying: [], interviewing: [], negotiating: [], accepted: [] };
    for (const app of apps) { map[STATUS_MAP[app.status] ?? "bookmarked"].push(app); }
    return map;
  }, [apps]);

  const filtered = grouped[tab];

  async function moveStatus(appId: string, newStatus: string) {
    const res = await fetch(`/api/applications/${appId}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: newStatus }) });
    if (res.ok) setApps((prev) => prev.map((a) => (a.id === appId ? { ...a, status: newStatus } : a)));
  }

  async function refresh() {
    const res = await fetch("/api/applications");
    const j = await res.json().catch(() => ({}));
    if (res.ok && Array.isArray(j.applications)) {
      setApps(j.applications.map((a: JobRow & { createdAt: Date }) => ({
        ...a, createdAt: typeof a.createdAt === "string" ? a.createdAt : new Date(a.createdAt).toISOString(),
      })));
    }
  }

  async function addApplication() {
    setAddErr(null);
    if (!addForm.resumeId) { setAddErr("Select a resume"); return; }
    if (addForm.jdText.length < 40) { setAddErr("JD text must be at least 40 characters"); return; }
    setAddBusy(true);
    const res = await fetch("/api/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        resumeId: addForm.resumeId,
        jdText: addForm.jdText,
        title: addForm.title.trim() || undefined,
        company: addForm.company.trim() || undefined,
      }),
    });
    setAddBusy(false);
    if (!res.ok) { const j = await res.json().catch(() => ({})); setAddErr(j.error ?? "Error"); return; }
    if (addForm.status !== "bookmarked") {
      const j = await res.json().catch(() => ({}));
      if (j.application?.id) {
        await fetch(`/api/applications/${j.application.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: addForm.status }) });
      }
    }
    await refresh();
    setShowAdd(false);
    setAddForm({ resumeId: resumes[0]?.id ?? "", title: "", company: "", jdText: "", status: "bookmarked" });
  }

  if (selected) {
    const selectedPipeline = STATUS_MAP[selected.status] ?? "bookmarked";

    return (
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {PIPELINE.map((p) => {
            const active = p.key === selectedPipeline;
            const isFirst = p.key === PIPELINE[0].key;
            const isLast = p.key === PIPELINE[PIPELINE.length - 1].key;
            return (
              <button
                key={p.key}
                type="button"
                onClick={() =>
                  void moveStatus(selected.id, p.key).then(() => {
                    setSelected({ ...selected, status: p.key });
                    setTab(p.key);
                  })
                }
                className={`h-12 px-6 text-sm font-semibold transition ${
                  active
                    ? "border border-[#7C5CFC] bg-white text-[#7C5CFC]"
                    : "bg-[#F1F6FA] text-[#9EA7B3] hover:text-[#7f8995]"
                }`}
                style={{
                  clipPath: isFirst
                    ? "polygon(0 0,calc(100% - 14px) 0,100% 50%,calc(100% - 14px) 100%,0 100%,0 50%)"
                    : isLast
                      ? "polygon(14px 0,100% 0,100% 100%,14px 100%,0 50%)"
                      : "polygon(14px 0,calc(100% - 14px) 0,100% 50%,calc(100% - 14px) 100%,14px 100%,0 50%)",
                }}
              >
                {p.label}
              </button>
            );
          })}
        </div>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-[0_1px_3px_rgba(16,24,40,0.04)]">
            <div className="rounded-xl border border-[#E7F3FF]">
              <div className="flex items-center justify-between rounded-t-xl bg-[#F4FAFF] px-5 py-4">
                <h2 className="text-[34px] font-semibold tracking-[-0.02em] text-gray-900">Job Description</h2>
                <button type="button" onClick={() => setSelected(null)} className="text-gray-500 transition hover:text-gray-700">
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="space-y-7 px-5 py-4">
                <div>
                  <p className="text-[20px] font-medium text-[#9EA7B3]">{selected.title ?? "Senior Product Designer"}</p>
                  <div className="mt-4 flex flex-wrap gap-2 text-[13px] text-[#A7B0BC]">
                    <span className="rounded-md bg-[#F8FAFD] px-3 py-1.5">nimur24@gmail.com</span>
                    <span className="rounded-md bg-[#F8FAFD] px-3 py-1.5">+880 123 456 789</span>
                    <span className="rounded-md bg-[#F8FAFD] px-3 py-1.5">Rampur, Dhaka, Bangladesh</span>
                  </div>
                  <p className="mt-5 text-[14px] leading-7 text-[#8D98A8]">
                    We are searching for a passionate product designer to join our team and develop various new products for
                    customers. They will work alongside a team of engineers and other professionals to design products to
                    specification and deliver them on time. The Product Designer&apos;s responsibilities include doing thorough
                    market research to determine customer needs and preferences.
                  </p>
                </div>

                <div>
                  <h3 className="text-[32px] font-semibold tracking-[-0.02em] text-gray-900">Experience</h3>
                  <div className="mt-4 space-y-5">
                    <div>
                      <p className="text-[24px] font-semibold text-[#7C5CFC]">
                        Senior Product Designer, Nimur - UI/UX Design Agency
                      </p>
                      <p className="mt-1 text-[14px] text-[#A2ACB8]">Dhaka, Bangladesh - (02/08/2021 - present)</p>
                      <ul className="mt-3 space-y-1.5 text-[14px] leading-7 text-gray-800">
                        <li>- Designed high-fidely visual designs.</li>
                        <li>- Created design specifications and documentation for development teams.</li>
                        <li>- Mentored junior designers and conducted design reviews to maintain design quality and consistency.</li>
                      </ul>
                    </div>
                    <div>
                      <p className="text-[21px] font-semibold text-[#7C5CFC]">Product Designer, Lunchbox</p>
                      <p className="mt-1 text-[14px] text-[#A2ACB8]">Ukraine, Kiev - (02/08/2021 - present)</p>
                      <ul className="mt-3 space-y-1.5 text-[14px] text-[#A5AFBC]">
                        <li>- Your impressive achievements here</li>
                      </ul>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="mt-5 rounded-full bg-[#7C5CFC] px-5 py-2.5 text-[16px] font-semibold text-white transition hover:bg-[#6B4CE0]"
                  >
                    <Plus className="mr-1 inline h-5 w-5" />
                    Add Experience
                  </button>
                </div>

                <div>
                  <h3 className="text-[32px] font-semibold tracking-[-0.02em] text-gray-900">Education</h3>
                  <div className="mt-3">
                    <p className="text-[24px] font-semibold text-[#7C5CFC]">BFA Industrial Design</p>
                    <p className="text-[14px] text-[#A2ACB8]">Rhode Island School - 2013</p>
                  </div>
                  <button
                    type="button"
                    className="mt-5 rounded-full bg-[#7C5CFC] px-5 py-2.5 text-[16px] font-semibold text-white transition hover:bg-[#6B4CE0]"
                  >
                    <Plus className="mr-1 inline h-5 w-5" />
                    Add Education
                  </button>
                </div>

                <div>
                  <h3 className="text-[32px] font-semibold tracking-[-0.02em] text-gray-900">Skills</h3>
                  <div className="mt-3 space-y-4">
                    <div>
                      <p className="text-[20px] font-semibold text-[#7C5CFC]">Industry Knowledge:</p>
                      <p className="text-[14px] leading-7 text-[#8D98A8]">
                        Product design, User Interface, User Experience, Interaction Design, Wireframing, Rapid Prototyping,
                        Design Research
                      </p>
                    </div>
                    <div>
                      <p className="text-[20px] font-semibold text-[#7C5CFC]">Tools & Technologies:</p>
                      <p className="text-[14px] leading-7 text-[#8D98A8]">
                        Figma, Sketch, Protopie, Framer, Envision, Abstract, Zeplin, Google Analytics Amplitude.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_1px_3px_rgba(16,24,40,0.04)]">
              <div className="flex items-center justify-between">
                <h3 className="text-[32px] font-semibold tracking-[-0.02em] text-gray-900">Email Templates</h3>
                <button type="button" className="text-gray-400 transition hover:text-gray-600">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <select className="soha-select mt-3 !h-11 !text-[15px] !text-[#B0B9C5]">
                <option>Say Thank You</option>
                <option>Follow Up</option>
                <option>Introduction</option>
              </select>
              <div className="mt-4 space-y-3">
                <div>
                  <label className="text-[14px] font-semibold text-gray-900">From Name *</label>
                  <input className="soha-input mt-1 !h-11 !text-[14px] !text-[#ACB5C2]" value="Mastermind Design Agency" readOnly />
                </div>
                <div>
                  <label className="text-[14px] font-semibold text-gray-900">From Adress *</label>
                  <div className="relative mt-1">
                    <input className="soha-input !h-11 !pr-8 !text-[14px] !text-[#ACB5C2]" value="nasin@musemind.agency" readOnly />
                    <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  </div>
                </div>
                <div>
                  <label className="text-[14px] font-semibold text-gray-900">Subject Line *</label>
                  <input className="soha-input mt-1 !h-11 !text-[14px] !text-[#ACB5C2]" value="Notion Hive + Musemind" readOnly />
                </div>
                <div>
                  <label className="text-[14px] font-semibold text-gray-900">Internal Email Name *</label>
                  <input className="soha-input mt-1 !h-11 !text-[14px] !text-[#ACB5C2]" value="Mastermind" readOnly />
                </div>
              </div>
              <div className="mt-5 flex gap-2">
                <CopyBtn text="Notion Hive + Musemind" label="Copy Subject" />
                <button
                  type="button"
                  className="rounded-full border border-[#7C5CFC] px-4 py-2 text-xs font-semibold text-[#7C5CFC] transition hover:bg-violet-50"
                >
                  Copy Message
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_1px_3px_rgba(16,24,40,0.04)]">
              <div className="flex items-center justify-between">
                <h3 className="text-[32px] font-semibold tracking-[-0.02em] text-gray-900">Hard Skills</h3>
                <div className="relative h-5 w-10 cursor-pointer rounded-full bg-[#00C17C]">
                  <div className="absolute right-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow" />
                </div>
              </div>
              <div className="mt-4 space-y-4">
                {SKILLS_DEMO.map((s) => (
                  <div key={s.name}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[17px] font-medium text-gray-900">{s.name}</span>
                      <span className="text-[14px] text-[#ACB5C2]">{s.price}</span>
                    </div>
                    <div className="relative mt-2 h-1.5 w-full rounded-full bg-[#E9F4FF]">
                      <div className="h-full rounded-full bg-[#7C5CFC]" style={{ width: `${s.value}%` }} />
                      <div
                        className="absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border-2 border-white bg-[#7C5CFC] shadow"
                        style={{ left: `calc(${s.value}% - 8px)` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <button type="button" className="mt-3 text-sm font-medium text-[#7C5CFC] hover:underline">
                Show all 11
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header with Add button */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Job Tracker</h1>
          <p className="mt-1 text-sm text-gray-500">Track your applications through the hiring pipeline.</p>
        </div>
        <button type="button" onClick={() => setShowAdd((s) => !s)} className="rounded-lg bg-[#7C5CFC] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#6B4CE0]">
          {showAdd ? <X className="mr-1 inline h-4 w-4" /> : <Plus className="mr-1 inline h-4 w-4" />}
          {showAdd ? "Close" : "+ Add Application"}
        </button>
      </div>

      {/* Add Application Form */}
      {showAdd ? (
        <div className="animate-fadeIn rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-bold text-gray-900">New Application</h2>
          {resumes.length === 0 ? (
            <p className="mt-3 text-sm text-gray-500">First, <Link href="/resume/new" className="text-[#7C5CFC] underline">create a resume</Link>.</p>
          ) : (
            <div className="mt-4 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-semibold text-gray-900">Resume *</label>
                  <select className="soha-select mt-1" value={addForm.resumeId} onChange={(e) => setAddForm({ ...addForm, resumeId: e.target.value })}>
                    {resumes.map((r) => <option key={r.id} value={r.id}>{r.title}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-900">Status</label>
                  <select className="soha-select mt-1" value={addForm.status} onChange={(e) => setAddForm({ ...addForm, status: e.target.value })}>
                    {PIPELINE.map((p) => <option key={p.key} value={p.key}>{p.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-900">Job Title</label>
                  <input className="soha-input mt-1" value={addForm.title} onChange={(e) => setAddForm({ ...addForm, title: e.target.value })} placeholder="Senior Product Designer" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-900">Company</label>
                  <input className="soha-input mt-1" value={addForm.company} onChange={(e) => setAddForm({ ...addForm, company: e.target.value })} placeholder="Acme Corp" />
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-900">Job Description *</label>
                <textarea className="soha-textarea mt-1 min-h-[120px]" value={addForm.jdText} onChange={(e) => setAddForm({ ...addForm, jdText: e.target.value })} placeholder="Paste the job description (min 40 characters)..." />
              </div>
              {addErr ? <p className="text-sm text-red-600">{addErr}</p> : null}
              <div className="flex gap-3">
                <button type="button" disabled={addBusy} onClick={() => void addApplication()} className="rounded-full bg-[#7C5CFC] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#6B4CE0]">
                  {addBusy ? <span className="mr-1 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> : null}
                  Create Job
                </button>
                <button type="button" onClick={() => setShowAdd(false)} className="rounded-full border border-[#7C5CFC] px-6 py-2.5 text-sm font-semibold text-[#7C5CFC] transition hover:bg-violet-50">Cancel</button>
              </div>
            </div>
          )}
        </div>
      ) : null}

      {/* Pipeline tabs */}
      <div className="flex border-b border-gray-200">
        {PIPELINE.map((p) => {
          const active = tab === p.key;
          const count = grouped[p.key].length;
          return (
            <button key={p.key} type="button" onClick={() => setTab(p.key)}
              className={`px-5 py-3 text-sm font-medium transition ${active ? "border-b-2 border-[#7C5CFC] text-[#7C5CFC]" : "border-b-2 border-transparent text-gray-500 hover:text-gray-700"}`}>
              {p.label}
              {count > 0 ? <span className={`ml-1.5 rounded-full px-1.5 py-0.5 text-xs ${active ? "bg-blue-100 text-[#7C5CFC]" : "bg-gray-100 text-gray-500"}`}>{count}</span> : null}
            </button>
          );
        })}
      </div>

      {/* Applications list */}
      {filtered.length === 0 ? (
        <div className="soha-empty">
          <h3 className="text-sm font-semibold text-gray-700">No applications in &ldquo;{PIPELINE.find((p) => p.key === tab)?.label}&rdquo;</h3>
          <p className="mt-1 text-sm text-gray-500">Move applications here by changing their status, or add via JD analysis.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((app) => (
            <div key={app.id} onClick={() => setSelected(app)} className="soha-card flex cursor-pointer items-center justify-between transition hover:shadow-md">
              <div>
                <h3 className="text-sm font-semibold text-gray-900">{app.title || "Untitled"}</h3>
                {app.company ? <p className="text-sm text-gray-500">{app.company}</p> : null}
                <p className="mt-0.5 text-xs text-gray-400">{app.resume.title} · {new Date(app.createdAt).toLocaleDateString()}</p>
              </div>
              <span className="soha-badge-blue">{STATUS_MAP[app.status] ?? app.status}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
