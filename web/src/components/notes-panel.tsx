"use client";

import { useEffect, useState } from "react";
import { Loader2, Send, MessageSquare } from "lucide-react";

type NoteItem = { id: string; content: string; createdAt: string };

export function NotesPanel({ contactId, companyId, applicationId }: { contactId?: string; companyId?: string; applicationId?: string }) {
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  const query = contactId ? `contactId=${contactId}` : companyId ? `companyId=${companyId}` : applicationId ? `applicationId=${applicationId}` : "";

  useEffect(() => {
    if (!query) return;
    let cancelled = false;
    (async () => {
      const r = await fetch(`/api/notes?${query}`);
      const j = await r.json().catch(() => ({}));
      if (!cancelled && r.ok && Array.isArray(j.notes)) setNotes(j.notes);
    })();
    return () => { cancelled = true; };
  }, [query]);

  async function send() {
    if (!text.trim()) return;
    setSending(true);
    const body: Record<string, string> = { content: text };
    if (contactId) body.contactId = contactId;
    if (companyId) body.companyId = companyId;
    if (applicationId) body.applicationId = applicationId;
    const r = await fetch("/api/notes", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    setSending(false);
    if (r.ok) {
      setText("");
      const res = await fetch(`/api/notes?${query}`);
      const j = await res.json().catch(() => ({}));
      if (res.ok && Array.isArray(j.notes)) setNotes(j.notes);
    }
  }

  return (
    <div className="soha-card space-y-3">
      <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900"><MessageSquare className="h-4 w-4 text-blue-500" /> Notes</h3>
      <div className="max-h-60 space-y-2 overflow-y-auto">
        {notes.length === 0 ? <p className="text-xs text-gray-400">No notes yet.</p> : null}
        {notes.map((n) => (
          <div key={n.id} className="rounded-md bg-gray-50 px-3 py-2">
            <p className="text-sm text-gray-700">{n.content}</p>
            <p className="mt-1 text-[10px] text-gray-400">{new Date(n.createdAt).toLocaleString()}</p>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input className="soha-input flex-1" placeholder="Write your message..." value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") void send(); }} />
        <button type="button" disabled={sending || !text.trim()} onClick={() => void send()} className="soha-btn-primary !px-3">
          {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}
