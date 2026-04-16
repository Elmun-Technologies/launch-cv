"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Edit3,
  Loader2,
  Menu,
  Plus,
  Search,
  Send,
  SlidersHorizontal,
  X,
} from "lucide-react";

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
  bookmarked: "bookmarked",
  draft: "bookmarked",
  applying: "applying",
  applied: "applying",
  interviewing: "interviewing",
  interview: "interviewing",
  negotiating: "negotiating",
  offer: "negotiating",
  accepted: "accepted",
};

const SKILLS_INITIAL = [
  { name: "Sketch", value: 70, price: "$2.00" },
  { name: "3D Modeling", value: 50, price: "$1.00" },
  { name: "Drawing", value: 85, price: "$3.00" },
  { name: "Eyes", value: 62, price: "$2.00" },
  { name: "New Products", value: 40, price: "$1.00" },
];

type NoteRow = { id: string; content: string; createdAt: string };
type ExpEntry = { id: string; title: string; location: string; period: string; bullets: string[] };
type EduEntry = { id: string; degree: string; school: string; year: string };

const DEFAULT_EXPERIENCES: ExpEntry[] = [
  { id: "e1", title: "Senior Product Designer, Nimur - UI/UX Design Agency", location: "Dhaka, Bangladesh", period: "02/08/2021 - present", bullets: ["Designed high-fidelity visual designs.", "Created design specifications and documentation for development teams.", "Mentored junior designers and conducted design reviews to maintain design quality."] },
  { id: "e2", title: "Product Designer - Lunchbox", location: "Dhaka, Bangladesh", period: "02/08/2021 - present", bullets: [] },
];
const DEFAULT_EDUCATION: EduEntry[] = [
  { id: "ed1", degree: "BFA Industrial Design - UX Design", school: "Rhode Island School", year: "2016" },
];
const DEFAULT_SKILLS = ["Adobe Photoshop", "Dashboard", "Interaction Design", "UI", "Date Visualization", "UX", "Graphic Design", "Information Architecture"];

export function JobTrackerProClient({
  initial,
  resumes,
}: {
  initial: JobRow[];
  resumes: { id: string; title: string }[];
}) {
  const [rows, setRows] = useState<JobRow[]>(initial);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [total, setTotal] = useState(initial.length);
  const [totalPages, setTotalPages] = useState(Math.max(1, Math.ceil(initial.length / 6)));
  const [loadingList, setLoadingList] = useState(false);
  const [selected, setSelected] = useState<JobRow | null>(null);
  const [groupBy, setGroupBy] = useState("none");
  const [showCreate, setShowCreate] = useState(false);
  const [savingCreate, setSavingCreate] = useState(false);
  const [createErr, setCreateErr] = useState<string | null>(null);
  const [createForm, setCreateForm] = useState({
    resumeId: resumes[0]?.id ?? "",
    title: "",
    company: "",
    jdText: "",
    status: "bookmarked",
  });

  const [notes, setNotes] = useState<NoteRow[]>([]);
  const [noteText, setNoteText] = useState("");
  const [sendingNote, setSendingNote] = useState(false);

  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    existing: "",
  });
  const [addingContact, setAddingContact] = useState(false);

  const [experiences, setExperiences] = useState<ExpEntry[]>(DEFAULT_EXPERIENCES);
  const [showExpForm, setShowExpForm] = useState(false);
  const [editingExp, setEditingExp] = useState<ExpEntry | null>(null);
  const [expForm, setExpForm] = useState({ title: "", location: "", period: "", bullets: "" });

  const [education, setEducation] = useState<EduEntry[]>(DEFAULT_EDUCATION);
  const [showEduForm, setShowEduForm] = useState(false);
  const [editingEdu, setEditingEdu] = useState<EduEntry | null>(null);
  const [eduForm, setEduForm] = useState({ degree: "", school: "", year: "" });

  const [skills, setSkills] = useState<string[]>(DEFAULT_SKILLS);
  const [showSkillInput, setShowSkillInput] = useState(false);
  const [newSkill, setNewSkill] = useState("");

  const selectedPipeline = selected ? STATUS_MAP[selected.status] ?? "bookmarked" : null;
  const selectedPipelineLabel = selectedPipeline
    ? PIPELINE.find((p) => p.key === selectedPipeline)?.label ?? "Bookmarked"
    : "Job Tracker";
  const notesTop = notes.slice(0, 3);
  const activeNote = notes[0]?.content ?? "Do you remember about tomorrow's meeting with new investor's? Here you have more information about the conference at https://conference.com/agenda/start";

  async function loadRows(opts?: { nextPage?: number; nextQuery?: string; nextPageSize?: number }) {
    const finalPage = opts?.nextPage ?? page;
    const finalQuery = opts?.nextQuery ?? query;
    const finalPageSize = opts?.nextPageSize ?? pageSize;
    setLoadingList(true);
    const params = new URLSearchParams({
      page: String(finalPage),
      pageSize: String(finalPageSize),
    });
    if (finalQuery.trim()) params.set("q", finalQuery.trim());
    const r = await fetch(`/api/applications?${params.toString()}`);
    const j = await r.json().catch(() => ({}));
    setLoadingList(false);
    if (r.ok && Array.isArray(j.applications)) {
      setRows(j.applications);
      setTotal(Number(j.pagination?.total ?? j.applications.length));
      setTotalPages(Number(j.pagination?.totalPages ?? 1));
      setPage(Number(j.pagination?.page ?? finalPage));
      setPageSize(Number(j.pagination?.pageSize ?? finalPageSize));
    }
  }

  useEffect(() => {
    void loadRows({ nextPage: 1, nextQuery: query });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  useEffect(() => {
    async function loadNotes() {
      if (!selected || selectedPipeline !== "applying") {
        setNotes([]);
        return;
      }
      const r = await fetch(`/api/notes?applicationId=${selected.id}`);
      const j = await r.json().catch(() => ({}));
      if (r.ok && Array.isArray(j.notes)) {
        setNotes(j.notes);
      }
    }
    void loadNotes();
  }, [selected, selectedPipeline]);

  async function moveStatus(newStatus: PipelineKey) {
    if (!selected) return;
    const r = await fetch(`/api/applications/${selected.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    if (!r.ok) return;
    setSelected((prev) => (prev ? { ...prev, status: newStatus } : prev));
    setRows((prev) => prev.map((x) => (x.id === selected.id ? { ...x, status: newStatus } : x)));
  }

  async function createJob() {
    setCreateErr(null);
    if (!createForm.resumeId) {
      setCreateErr("Select a resume");
      return;
    }
    if (createForm.jdText.trim().length < 40) {
      setCreateErr("JD text must be at least 40 characters");
      return;
    }
    setSavingCreate(true);
    const r = await fetch("/api/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        resumeId: createForm.resumeId,
        jdText: createForm.jdText.trim(),
        title: createForm.title.trim() || undefined,
        company: createForm.company.trim() || undefined,
      }),
    });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) {
      setSavingCreate(false);
      setCreateErr(j.error ?? "Error");
      return;
    }
    if (createForm.status !== "bookmarked" && j.application?.id) {
      await fetch(`/api/applications/${j.application.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: createForm.status }),
      });
    }
    setSavingCreate(false);
    setShowCreate(false);
    setCreateForm({
      resumeId: resumes[0]?.id ?? "",
      title: "",
      company: "",
      jdText: "",
      status: "bookmarked",
    });
    await loadRows({ nextPage: 1 });
  }

  async function sendNote() {
    if (!selected || !noteText.trim()) return;
    setSendingNote(true);
    const r = await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        applicationId: selected.id,
        content: noteText.trim(),
      }),
    });
    setSendingNote(false);
    const j = await r.json().catch(() => ({}));
    if (r.ok && j.note) {
      setNotes((prev) => [j.note as NoteRow, ...prev]);
      setNoteText("");
    }
  }

  async function addContact() {
    if (!contactForm.name.trim()) return;
    setAddingContact(true);
    await fetch("/api/contacts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: contactForm.name.trim(),
        email: contactForm.email.trim() || undefined,
        company: selected?.company || undefined,
        relationship: "Hiring Team",
        goal: "Interview",
      }),
    });
    setAddingContact(false);
    setContactForm({ name: "", email: "", existing: "" });
  }

  function renderRightPanel() {
    if (!selected) return null;

    if (selectedPipeline === "interviewing") {
      return (
        <div className="space-y-4">
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_1px_3px_rgba(16,24,40,0.04)]">
            <div className="flex items-center justify-between">
              <h3 className="text-[36px] font-semibold tracking-[-0.02em] text-gray-900">Contacts</h3>
              <X className="h-5 w-5 text-gray-400" />
            </div>
            <p className="mt-2 text-sm text-gray-400">
              Lorem ipsum dolor sit amet consectetur. Porta enemy a rostrum nec vehicular
            </p>
            <div className="mt-4 space-y-3">
              <div>
                <label className="text-sm font-semibold text-gray-900">Full Name *</label>
                <input
                  className="soha-input mt-1.5"
                  value={contactForm.name}
                  onChange={(e) => setContactForm((p) => ({ ...p, name: e.target.value }))}
                  placeholder="Nimur"
                />
              </div>
              <div>
                <input
                  className="soha-input"
                  value={contactForm.email}
                  onChange={(e) => setContactForm((p) => ({ ...p, email: e.target.value }))}
                  placeholder="Email"
                />
              </div>
              <div>
                <input
                  className="soha-input"
                  value={contactForm.existing}
                  onChange={(e) => setContactForm((p) => ({ ...p, existing: e.target.value }))}
                  placeholder="Find an existing contact"
                />
              </div>
              <button
                type="button"
                onClick={() => void addContact()}
                disabled={addingContact}
                className="w-full rounded-full bg-[#7C5CFC] py-2.5 text-sm font-semibold text-white transition hover:bg-[#6B4CE0] disabled:opacity-70"
              >
                {addingContact ? <Loader2 className="mr-1 inline h-4 w-4 animate-spin" /> : <Plus className="mr-1 inline h-4 w-4" />}
                Add a Contact
              </button>
              <div className="flex items-center justify-center gap-5 pt-2 text-gray-500">
                <span className="text-xs">Be</span>
                <span className="text-xs">Tw</span>
                <span className="text-xs">Fb</span>
                <span className="text-xs">Ig</span>
              </div>
            </div>
          </div>
          {renderHardSkills()}
        </div>
      );
    }

    if (selectedPipeline === "applying") {
      return (
        <div className="space-y-4">
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_1px_3px_rgba(16,24,40,0.04)]">
            <div className="flex items-center justify-between">
              <h3 className="text-[36px] font-semibold tracking-[-0.02em] text-gray-900">Notes</h3>
              <X className="h-5 w-5 text-gray-400" />
            </div>
            <div className="mt-3 space-y-3">
              {(notesTop.length ? notesTop : [{ id: "d1", content: "Hi I have a new update", createdAt: new Date().toISOString() }, { id: "d2", content: "Hi thanks for the info", createdAt: new Date().toISOString() }, { id: "d3", content: "Can we sync tomorrow?", createdAt: new Date().toISOString() }]).map((n, idx) => (
                <div key={n.id} className="flex items-center gap-2 text-sm">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-blue-200 to-indigo-300 text-[10px] font-semibold text-white">
                    {idx === 1 ? "Y" : "J"}
                  </div>
                  <p className="min-w-0 flex-1 truncate text-gray-700">
                    <span className="font-semibold text-gray-900">{idx === 1 ? "You" : "Jessica Keel"}</span>
                    <span className="mx-1 text-gray-300">-</span>
                    {n.content}
                  </p>
                  <span className="text-xs text-gray-400">{new Date(n.createdAt).toLocaleDateString("en-GB")}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 space-y-1 text-sm text-gray-700">
              <p className="font-semibold text-gray-900">Hey Joutoray,</p>
              <p className="leading-6">
                {activeNote}
              </p>
              <p className="font-semibold text-gray-900">Regards,</p>
              <p className="text-gray-500">Jessica</p>
            </div>
            <div className="mt-4">
              <textarea
                className="soha-textarea min-h-[90px]"
                placeholder="Write your message....."
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
              />
              <div className="mt-2 flex items-center justify-between text-xs text-gray-400">
                <div className="flex items-center gap-3">
                  <span>B</span>
                  <span>I</span>
                  <span>U</span>
                  <span>🙂</span>
                </div>
                <div className="flex items-center gap-3">
                  <span>🖇</span>
                  <span>🖼</span>
                  <span>🗑</span>
                </div>
              </div>
              <div className="mt-3 flex justify-end">
                <button
                  type="button"
                  onClick={() => void sendNote()}
                  disabled={sendingNote || !noteText.trim()}
                  className="rounded-full bg-[#7C5CFC] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#6B4CE0] disabled:opacity-70"
                >
                  {sendingNote ? <Loader2 className="mr-1 inline h-4 w-4 animate-spin" /> : null}
                  Send
                  <Send className="ml-1 inline h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
          {renderHardSkills()}
        </div>
      );
    }

    if (selectedPipeline === "bookmarked") {
      return (
        <div className="space-y-4">
          {renderSalesReport()}
          {renderHardSkills()}
        </div>
      );
    }

    if (selectedPipeline === "negotiating" || selectedPipeline === "accepted") {
      return (
        <div className="space-y-4">
          {renderEmailTemplates()}
          {renderHardSkills()}
        </div>
      );
    }

    return renderHardSkills();
  }

  function renderEmailTemplates() {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-[0_1px_3px_rgba(16,24,40,0.04)]">
        <div className="flex items-center justify-between">
          <h3 className="text-[20px] font-bold text-gray-900">Email Templates</h3>
          <X className="h-5 w-5 text-gray-400" />
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
            <label className="text-[14px] font-semibold text-gray-900">From Address *</label>
            <input className="soha-input mt-1 !h-11 !text-[14px] !text-[#ACB5C2]" value="nasin@musemind.agency" readOnly />
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
        <div className="mt-4 flex gap-2">
          <button type="button" onClick={() => void navigator.clipboard.writeText("Notion Hive + Musemind")} className="rounded-full bg-[#7C5CFC] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#6B4CE0]">Copy Subject</button>
          <button type="button" className="rounded-full border border-[#7C5CFC] px-4 py-2 text-xs font-semibold text-[#7C5CFC] transition hover:bg-violet-50">Copy Message</button>
        </div>
      </div>
    );
  }

  function renderSalesReport() {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-[0_1px_3px_rgba(16,24,40,0.04)]">
        <div className="flex items-center justify-between">
          <h3 className="text-[20px] font-bold text-gray-900">Sales Report</h3>
          <X className="h-5 w-5 text-gray-400" />
        </div>
        <div className="relative mx-auto mt-4 h-40 w-40">
          <div
            className="h-full w-full rounded-full"
            style={{
              background:
                "conic-gradient(from 210deg, #0A96FF 0deg 120deg, #F2F5FB 120deg 170deg, #8D56FF 170deg 315deg, #F2F5FB 315deg 360deg)",
            }}
          />
          <div className="absolute inset-[14px] flex items-center justify-center rounded-full bg-white text-center">
            <div className="w-full">
              <p className="text-[10px] text-gray-400">Summary</p>
              <p className="text-[35px] font-semibold leading-none text-gray-900">22,870</p>
            </div>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-400">Monthly</p>
            <p className="text-[32px] font-bold leading-none text-gray-900">$8,097</p>
            <p className="text-xs text-[#1BA4FF]">↑ 19.6% <span className="text-gray-400">44.214 Usd</span></p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Yearly</p>
            <p className="text-[32px] font-bold leading-none text-gray-900">$312,134</p>
            <p className="text-xs text-[#1BA4FF]">↑ 2.5% <span className="text-gray-400">301.02 Usd</span></p>
          </div>
        </div>
        <div className="mt-4 space-y-2 text-xs">
          <div className="flex items-center justify-between text-gray-400"><span>Los Angeles</span><span className="font-semibold text-gray-700">201,192</span></div>
          <div className="flex items-center justify-between text-gray-400"><span>New York</span><span className="font-semibold text-gray-700">192,054</span></div>
          <div className="flex items-center justify-between text-gray-400"><span>Canada</span><span className="font-semibold text-gray-700">166,401</span></div>
        </div>
      </div>
    );
  }

  function renderHardSkills() {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-[0_1px_3px_rgba(16,24,40,0.04)]">
        <div className="flex items-center justify-between">
          <h3 className="text-[20px] font-bold text-gray-900">Hard Skills</h3>
          <div className="relative h-5 w-10 rounded-full bg-[#00C17C]">
            <div className="absolute right-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow" />
          </div>
        </div>
        <div className="mt-4 space-y-4">
          {SKILLS_INITIAL.map((s) => (
            <div key={s.name}>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[16px] font-medium text-gray-900">{s.name}</span>
                <span className="text-[13px] text-[#ACB5C2]">{s.price}</span>
              </div>
              <div className="relative mt-2 h-1.5 w-full rounded-full bg-[#E9F4FF]">
                <div className="h-full rounded-full bg-[#7C5CFC]" style={{ width: `${s.value}%` }} />
                <div className="absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border-2 border-white bg-[#7C5CFC] shadow" style={{ left: `calc(${s.value}% - 8px)` }} />
              </div>
            </div>
          ))}
        </div>
        <button type="button" className="mt-3 text-sm font-medium text-[#7C5CFC] hover:underline">Show all 11</button>
      </div>
    );
  }

  function openAddExp() {
    setEditingExp(null);
    setExpForm({ title: "", location: "", period: "", bullets: "" });
    setShowExpForm(true);
  }
  function openEditExp(e: ExpEntry) {
    setEditingExp(e);
    setExpForm({ title: e.title, location: e.location, period: e.period, bullets: e.bullets.join("\n") });
    setShowExpForm(true);
  }
  function saveExp() {
    if (!expForm.title.trim()) return;
    const entry: ExpEntry = {
      id: editingExp?.id ?? `exp-${Date.now()}`,
      title: expForm.title.trim(),
      location: expForm.location.trim(),
      period: expForm.period.trim(),
      bullets: expForm.bullets.split("\n").map((b) => b.trim()).filter(Boolean),
    };
    if (editingExp) {
      setExperiences((prev) => prev.map((x) => (x.id === editingExp.id ? entry : x)));
    } else {
      setExperiences((prev) => [...prev, entry]);
    }
    setShowExpForm(false);
    setEditingExp(null);
  }

  function openAddEdu() {
    setEditingEdu(null);
    setEduForm({ degree: "", school: "", year: "" });
    setShowEduForm(true);
  }
  function openEditEdu(e: EduEntry) {
    setEditingEdu(e);
    setEduForm({ degree: e.degree, school: e.school, year: e.year });
    setShowEduForm(true);
  }
  function saveEdu() {
    if (!eduForm.degree.trim()) return;
    const entry: EduEntry = {
      id: editingEdu?.id ?? `edu-${Date.now()}`,
      degree: eduForm.degree.trim(),
      school: eduForm.school.trim(),
      year: eduForm.year.trim(),
    };
    if (editingEdu) {
      setEducation((prev) => prev.map((x) => (x.id === editingEdu.id ? entry : x)));
    } else {
      setEducation((prev) => [...prev, entry]);
    }
    setShowEduForm(false);
    setEditingEdu(null);
  }

  function addSkill() {
    const s = newSkill.trim();
    if (!s || skills.includes(s)) return;
    setSkills((prev) => [...prev, s]);
    setNewSkill("");
    setShowSkillInput(false);
  }

  function removeSkill(name: string) {
    setSkills((prev) => prev.filter((s) => s !== name));
  }

  function renderExperienceSection(variant: "card" | "inline") {
    const isCard = variant === "card";
    return (
      <div className={isCard ? "rounded-xl border border-gray-100 border-l-[3px] border-l-[#4CB1FF] p-3" : ""}>
        <div className="flex items-center justify-between">
          <h4 className={isCard ? "text-[22px] font-bold text-gray-900" : "text-[32px] font-semibold tracking-[-0.02em] text-gray-900"}>Experience</h4>
          <div className="flex items-center gap-2 text-gray-500">
            <button type="button" onClick={openAddExp} className="transition hover:text-[#7C5CFC]"><Plus className="h-5 w-5" /></button>
            {isCard && experiences[0] ? <button type="button" onClick={() => openEditExp(experiences[0])} className="transition hover:text-[#7C5CFC]"><Edit3 className="h-4 w-4" /></button> : null}
          </div>
        </div>
        {showExpForm ? (
          <div className="mt-3 space-y-2 rounded-lg border border-blue-100 bg-blue-50/30 p-3">
            <input className="soha-input" placeholder="Job Title, Company" value={expForm.title} onChange={(e) => setExpForm((p) => ({ ...p, title: e.target.value }))} />
            <div className="grid grid-cols-2 gap-2">
              <input className="soha-input" placeholder="Location" value={expForm.location} onChange={(e) => setExpForm((p) => ({ ...p, location: e.target.value }))} />
              <input className="soha-input" placeholder="Period" value={expForm.period} onChange={(e) => setExpForm((p) => ({ ...p, period: e.target.value }))} />
            </div>
            <textarea className="soha-textarea min-h-[60px]" placeholder="Bullet points (one per line)" value={expForm.bullets} onChange={(e) => setExpForm((p) => ({ ...p, bullets: e.target.value }))} />
            <div className="flex gap-2">
              <button type="button" onClick={saveExp} className="rounded-full bg-[#7C5CFC] px-4 py-1.5 text-xs font-semibold text-white">{editingExp ? "Update" : "Add"}</button>
              <button type="button" onClick={() => setShowExpForm(false)} className="rounded-full border border-gray-200 px-4 py-1.5 text-xs font-semibold text-gray-600">Cancel</button>
            </div>
          </div>
        ) : null}
        <div className="mt-2 space-y-2">
          {experiences.map((exp) => (
            <div key={exp.id} className="group cursor-pointer" onClick={() => openEditExp(exp)}>
              <p className={isCard ? "text-[17px] font-semibold text-gray-900" : "text-[24px] font-semibold text-[#0D9BFF]"}>{exp.title}</p>
              <p className="text-[12px] text-[#A2ACB8]">{exp.location} - ({exp.period})</p>
              {!isCard && exp.bullets.length > 0 ? (
                <ul className="mt-1 space-y-0.5 text-[14px] text-gray-800">
                  {exp.bullets.map((b, i) => <li key={i}>• {b}</li>)}
                </ul>
              ) : null}
            </div>
          ))}
        </div>
        {!isCard ? (
          <button type="button" onClick={openAddExp} className="mt-4 rounded-full bg-[#7C5CFC] px-5 py-2.5 text-[16px] font-semibold text-white">
            <Plus className="mr-1 inline h-5 w-5" />
            Add Experience
          </button>
        ) : null}
      </div>
    );
  }

  function renderEducationSection(variant: "card" | "inline") {
    const isCard = variant === "card";
    return (
      <div className={isCard ? "rounded-xl border border-gray-100 border-l-[3px] border-l-[#4CB1FF] p-3" : ""}>
        <div className="flex items-center justify-between">
          <h4 className={isCard ? "text-[22px] font-bold text-gray-900" : "text-[32px] font-semibold tracking-[-0.02em] text-gray-900"}>Education</h4>
          <div className="flex items-center gap-2 text-gray-500">
            <button type="button" onClick={openAddEdu} className="transition hover:text-[#7C5CFC]"><Plus className="h-5 w-5" /></button>
            {isCard && education[0] ? <button type="button" onClick={() => openEditEdu(education[0])} className="transition hover:text-[#7C5CFC]"><Edit3 className="h-4 w-4" /></button> : null}
          </div>
        </div>
        {showEduForm ? (
          <div className="mt-3 space-y-2 rounded-lg border border-blue-100 bg-blue-50/30 p-3">
            <input className="soha-input" placeholder="Degree - Field" value={eduForm.degree} onChange={(e) => setEduForm((p) => ({ ...p, degree: e.target.value }))} />
            <div className="grid grid-cols-2 gap-2">
              <input className="soha-input" placeholder="School" value={eduForm.school} onChange={(e) => setEduForm((p) => ({ ...p, school: e.target.value }))} />
              <input className="soha-input" placeholder="Year" value={eduForm.year} onChange={(e) => setEduForm((p) => ({ ...p, year: e.target.value }))} />
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={saveEdu} className="rounded-full bg-[#7C5CFC] px-4 py-1.5 text-xs font-semibold text-white">{editingEdu ? "Update" : "Add"}</button>
              <button type="button" onClick={() => setShowEduForm(false)} className="rounded-full border border-gray-200 px-4 py-1.5 text-xs font-semibold text-gray-600">Cancel</button>
            </div>
          </div>
        ) : null}
        <div className="mt-2 space-y-2">
          {education.map((ed) => (
            <div key={ed.id} className="group cursor-pointer" onClick={() => openEditEdu(ed)}>
              <p className={isCard ? "text-[17px] font-semibold text-gray-900" : "text-[24px] font-semibold text-[#0D9BFF]"}>{ed.degree}</p>
              <p className="text-[12px] text-[#A2ACB8]">{ed.school} - {ed.year}</p>
            </div>
          ))}
        </div>
        {!isCard ? (
          <button type="button" onClick={openAddEdu} className="mt-4 rounded-full bg-[#7C5CFC] px-5 py-2.5 text-[16px] font-semibold text-white">
            <Plus className="mr-1 inline h-5 w-5" />
            Add Education
          </button>
        ) : null}
      </div>
    );
  }

  function renderSkillsSection(variant: "card" | "inline") {
    const isCard = variant === "card";
    return (
      <div className={isCard ? "rounded-xl border border-gray-100 border-l-[3px] border-l-[#4CB1FF] p-3" : ""}>
        <div className="flex items-center justify-between">
          <h4 className={isCard ? "text-[22px] font-bold text-gray-900" : "text-[32px] font-semibold tracking-[-0.02em] text-gray-900"}>Skills</h4>
          <button type="button" onClick={() => setShowSkillInput(true)} className="text-gray-500 transition hover:text-[#7C5CFC]"><Plus className="h-5 w-5" /></button>
        </div>
        {showSkillInput ? (
          <div className="mt-2 flex gap-2">
            <input className="soha-input flex-1" placeholder="New skill" value={newSkill} onChange={(e) => setNewSkill(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") addSkill(); }} autoFocus />
            <button type="button" onClick={addSkill} className="rounded-full bg-[#7C5CFC] px-3 py-1.5 text-xs font-semibold text-white">Add</button>
            <button type="button" onClick={() => { setShowSkillInput(false); setNewSkill(""); }} className="rounded-full border border-gray-200 px-3 py-1.5 text-xs text-gray-600">Cancel</button>
          </div>
        ) : null}
        {isCard ? (
          <div className="mt-2 flex flex-wrap gap-2">
            {skills.map((s) => (
              <span key={s} className="inline-flex items-center gap-1 rounded-full border border-gray-200 px-3 py-1 text-[13px] text-gray-700">
                {s}
                <button type="button" onClick={() => removeSkill(s)} className="text-gray-400 transition hover:text-red-500"><X className="h-3 w-3" /></button>
              </span>
            ))}
          </div>
        ) : (
          <div className="mt-2">
            <p className="text-[20px] font-semibold text-[#0D9BFF]">Industry Knowledge:</p>
            <p className="text-[14px] leading-7 text-[#8D98A8]">{skills.join(", ")}</p>
          </div>
        )}
      </div>
    );
  }

  function renderLeftDetail() {
    if (!selected) return null;

    const useInlineVariant = selectedPipeline === "interviewing" || selectedPipeline === "negotiating" || selectedPipeline === "accepted";
    const variant = useInlineVariant ? "inline" : "card";

    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-3 shadow-[0_1px_3px_rgba(16,24,40,0.04)]">
        <div className="rounded-xl border border-[#E7F3FF]">
          <div className="flex items-center justify-between rounded-t-xl bg-[#F4FAFF] px-5 py-4">
            <h2 className="text-[20px] font-bold text-gray-900">Job Description</h2>
            <button type="button" onClick={() => setSelected(null)} className="text-gray-500 transition hover:text-gray-700">
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="space-y-4 px-5 py-4">
            <p className="text-[16px] font-medium text-[#9EA7B3]">{selected.title ?? "Senior Product Designer"}</p>
            <div className="flex flex-wrap gap-2 text-[12px] text-[#A7B0BC]">
              <span className="rounded-md bg-[#F8FAFD] px-3 py-1.5">nimur24@gmail.com</span>
              <span className="rounded-md bg-[#F8FAFD] px-3 py-1.5">+880 123 456 789</span>
              <span className="rounded-md bg-[#F8FAFD] px-3 py-1.5">Rampur, Dhaka, Bangladesh</span>
            </div>
            <h3 className="text-[32px] font-semibold tracking-[-0.02em] text-gray-900">About</h3>
            <p className="text-[14px] leading-6 text-[#8D98A8]">
              {selected.jdText?.slice(0, 420) ||
                "We are searching for a passionate product designer to join our team and develop various new products for customers. They will work alongside a team of engineers and other professionals to design products to specification and deliver them on time."}
            </p>
            {renderExperienceSection(variant)}
            {renderEducationSection(variant)}
            {renderSkillsSection(variant)}
          </div>
        </div>
      </div>
    );
  }

  if (selected) {
    return (
      <div className="space-y-4">
        <h1 className="text-[18px] font-semibold text-gray-900">{selectedPipelineLabel}</h1>
        <div className="flex flex-wrap gap-2">
          {PIPELINE.map((p) => {
            const active = p.key === selectedPipeline;
            const isFirst = p.key === PIPELINE[0].key;
            const isLast = p.key === PIPELINE[PIPELINE.length - 1].key;
            return (
              <button
                key={p.key}
                type="button"
                onClick={() => void moveStatus(p.key)}
                className={`h-10 px-5 text-[13px] font-semibold transition ${
                  active ? "border border-[#2FA5FF] bg-white text-[#2FA5FF]" : "bg-[#F1F6FA] text-[#9EA7B3]"
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

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
          {renderLeftDetail()}
          {renderRightPanel()}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-[0_1px_3px_rgba(16,24,40,0.04)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="relative w-80">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input className="soha-input h-10 pl-9" placeholder="Search" value={query} onChange={(e) => setQuery(e.target.value)} />
            </div>
            <button type="button" className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-sm text-gray-500">
              <SlidersHorizontal className="h-4 w-4" />
            </button>
            <button type="button" className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-sm text-gray-500">
              K
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <select className="soha-select !h-10 !w-40 !text-sm" value={groupBy} onChange={(e) => setGroupBy(e.target.value)}>
              <option value="none">Group by : None</option>
              <option value="status">Group by : Status</option>
              <option value="company">Group by : Company</option>
            </select>
            <button type="button" className="inline-flex h-10 items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 text-sm font-medium text-gray-500">
              <Menu className="h-4 w-4" />
              Menu
            </button>
            <button type="button" onClick={() => setShowCreate(true)} className="inline-flex h-10 items-center rounded-lg border border-[#7C5CFC] px-4 text-sm font-semibold text-[#7C5CFC] transition hover:bg-violet-50">
              <Plus className="mr-1 h-4 w-4" />
              Add a New Job
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-[0_1px_3px_rgba(16,24,40,0.04)]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left">
            <thead className="border-b border-gray-100 bg-gray-50/70 text-[12px] uppercase tracking-wider text-gray-400">
              <tr>
                <th className="px-5 py-3 font-semibold">Job Position</th>
                <th className="px-4 py-3 font-semibold">Company</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Follow Up</th>
                <th className="px-4 py-3 font-semibold">Date Applied</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {loadingList ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-sm text-gray-500">
                    <Loader2 className="mr-2 inline h-4 w-4 animate-spin" />
                    Loading jobs...
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-sm text-gray-500">
                    No applications found.
                    <Link href="/resume/new" className="ml-1 text-blue-500 underline">Create resume</Link>
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr key={row.id} className="text-sm">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-gray-800">{row.title ?? "Product Designer - Sample Job"}</p>
                      <p className="text-xs text-gray-400">Anywhere, USA</p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-semibold text-gray-700">{row.company ?? "Acme Corp"}</p>
                      <p className="text-xs text-gray-400">US$0.00</p>
                    </td>
                    <td className="px-4 py-4">
                      <span className="rounded-full bg-[#EAF8E8] px-3 py-1 text-xs font-semibold text-[#73B76A]">
                        {(STATUS_MAP[row.status] ?? "bookmarked").replace(/^./, (m) => m.toUpperCase())}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-gray-500">09/09/2023</td>
                    <td className="px-4 py-4 text-gray-500">{new Date(row.createdAt).toLocaleDateString("en-GB")}</td>
                    <td className="px-4 py-4 text-right">
                      <button type="button" onClick={() => setSelected(row)} className="rounded-lg border border-[#7C5CFC] px-4 py-1.5 text-sm font-semibold text-[#7C5CFC] transition hover:bg-violet-50">
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Result per page</span>
            <select
              className="rounded-md border border-gray-200 bg-white px-2 py-1 text-sm text-gray-700"
              value={pageSize}
              onChange={(e) => {
                const next = Number(e.target.value);
                void loadRows({ nextPage: 1, nextPageSize: next });
              }}
            >
              <option value={6}>6</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div>

          <div className="flex items-center gap-1 text-sm">
            <button type="button" onClick={() => void loadRows({ nextPage: Math.max(1, page - 1) })} disabled={page <= 1 || loadingList} className="rounded-md border border-gray-200 px-2 py-1 text-gray-500 disabled:opacity-50">
              <ChevronLeft className="h-4 w-4" />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }).map((_, idx) => {
              const p = idx + Math.max(1, Math.min(page - 2, totalPages - 4));
              if (p > totalPages) return null;
              return (
                <button key={p} type="button" onClick={() => void loadRows({ nextPage: p })} className={`h-8 min-w-8 rounded-md px-2 ${p === page ? "bg-violet-50 font-semibold text-[#7C5CFC]" : "text-gray-500"}`}>
                  {p}
                </button>
              );
            })}
            <button type="button" onClick={() => void loadRows({ nextPage: Math.min(totalPages, page + 1) })} disabled={page >= totalPages || loadingList} className="rounded-md border border-gray-200 px-2 py-1 text-gray-500 disabled:opacity-50">
              <ChevronRight className="h-4 w-4" />
            </button>
            <span className="ml-2 text-xs text-gray-400">Total: {total}</span>
          </div>
        </div>
      </div>

      {showCreate ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-gray-100 bg-white p-6 shadow-xl">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-[20px] font-bold text-gray-900">Add a New Job Post</h3>
              <button type="button" onClick={() => setShowCreate(false)} className="text-gray-400 hover:text-gray-600"><X className="h-5 w-5" /></button>
            </div>
            <p className="mb-5 text-sm text-[#7C5CFC]">Add jobs in one click with the Launch CV Extension</p>
            {resumes.length === 0 ? (
              <p className="text-sm text-gray-500">First, <Link href="/resume/new" className="text-blue-500 underline">create a resume</Link>.</p>
            ) : (
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div><label className="text-sm font-semibold text-gray-900">Job Title</label><input className="soha-input mt-1.5" value={createForm.title} onChange={(e) => setCreateForm((p) => ({ ...p, title: e.target.value }))} placeholder="Job Title" /></div>
                  <div><label className="text-sm font-semibold text-gray-900">Url for Original Posting</label><input className="soha-input mt-1.5" placeholder="Url for original posting" /></div>
                  <div><label className="text-sm font-semibold text-gray-900">Company Name</label><input className="soha-input mt-1.5" value={createForm.company} onChange={(e) => setCreateForm((p) => ({ ...p, company: e.target.value }))} placeholder="Company Name" /></div>
                  <div><label className="text-sm font-semibold text-gray-900">Location</label><input className="soha-input mt-1.5" placeholder="Location" /></div>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-900">Job Description</label>
                  <div className="mt-1.5 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-2 border-b border-gray-100 px-3 py-2 text-xs text-gray-400">
                      <span>Normal</span>
                      <span className="ml-auto font-bold">B</span><span className="italic">I</span><span>≡</span><span>🔗</span><span>=</span>
                    </div>
                    <textarea className="w-full border-0 p-3 text-sm focus:outline-none" rows={6} value={createForm.jdText} onChange={(e) => setCreateForm((p) => ({ ...p, jdText: e.target.value }))} placeholder="Job Description" />
                  </div>
                </div>
                {createErr ? <p className="text-sm text-red-600">{createErr}</p> : null}
                <div className="flex gap-3">
                  <button type="button" onClick={() => void createJob()} disabled={savingCreate} className="rounded-full bg-[#7C5CFC] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#6B4CE0] disabled:opacity-70">{savingCreate ? <Loader2 className="mr-1 inline h-4 w-4 animate-spin" /> : null}Save Job</button>
                  <button type="button" onClick={() => setShowCreate(false)} className="rounded-full border border-[#7C5CFC] px-6 py-2.5 text-sm font-semibold text-[#7C5CFC] transition hover:bg-violet-50">Cancel</button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

