"use client";

import { useEffect, useRef, useState } from "react";
import { Mic, MicOff, Loader2, Check, X, Sparkles, RotateCcw } from "lucide-react";

type SpeechRecognitionEvent = Event & {
  results: { [index: number]: { [index: number]: { transcript: string } }; length: number };
  resultIndex: number;
};

type SpeechRecognitionInstance = EventTarget & {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((e: SpeechRecognitionEvent) => void) | null;
  onerror: ((e: Event & { error: string }) => void) | null;
  onend: (() => void) | null;
};

function getSpeechRecognition(): (new () => SpeechRecognitionInstance) | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as Record<string, unknown>;
  return (w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null) as (new () => SpeechRecognitionInstance) | null;
}

export function VoiceInput({
  onTranscript,
  placeholder = "Click microphone and start speaking...",
  className = "",
}: {
  onTranscript: (text: string) => void;
  placeholder?: string;
  className?: string;
}) {
  const [supported, setSupported] = useState(false);
  const [mode, setMode] = useState<"idle" | "recording" | "review" | "enhancing">("idle");
  const [rawText, setRawText] = useState("");
  const [interim, setInterim] = useState("");
  const [enhanced, setEnhanced] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    queueMicrotask(() => setSupported(!!getSpeechRecognition()));
  }, []);

  function startRecording() {
    const SR = getSpeechRecognition();
    if (!SR) return;

    setRawText("");
    setInterim("");
    setEnhanced(null);
    setDuration(0);

    const recognition = new SR();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    let accumulated = "";

    recognition.onresult = (e: SpeechRecognitionEvent) => {
      let interimText = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const transcript = e.results[i][0].transcript;
        if ((e.results[i] as unknown as { isFinal: boolean }).isFinal) {
          accumulated += transcript + " ";
          setRawText(accumulated.trim());
        } else {
          interimText = transcript;
        }
      }
      setInterim(interimText);
    };

    recognition.onerror = () => {
      stopRecording();
    };

    recognition.onend = () => {
      if (mode === "recording") {
        setMode(accumulated.trim() ? "review" : "idle");
      }
      recognitionRef.current = null;
    };

    recognition.start();
    recognitionRef.current = recognition;
    setMode("recording");

    timerRef.current = setInterval(() => {
      setDuration((d) => d + 1);
    }, 1000);
  }

  function stopRecording() {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setInterim("");
    setMode(rawText.trim() ? "review" : "idle");
  }

  async function enhanceWithAI() {
    if (!rawText.trim()) return;
    setMode("enhancing");
    try {
      const r = await fetch("/api/ai/impact-rewrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawText: rawText.trim() }),
      }).catch(() => null);

      if (r && r.ok) {
        const j = await r.json().catch(() => ({}));
        if (j.result?.rewrites?.[0]?.improved) {
          setEnhanced(j.result.rewrites[0].improved);
          setMode("review");
          return;
        }
      }
    } catch {
      // AI enhancement is optional
    }
    setMode("review");
  }

  function confirmAndAdd(text: string) {
    onTranscript(text);
    reset();
  }

  function reset() {
    setMode("idle");
    setRawText("");
    setInterim("");
    setEnhanced(null);
    setDuration(0);
  }

  function formatTime(s: number) {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  }

  if (!supported) return null;

  if (mode === "idle") {
    return (
      <button
        type="button"
        onClick={startRecording}
        className={`group flex items-center gap-2.5 rounded-xl border border-dashed border-gray-200 px-4 py-3 transition hover:border-[#7C5CFC]/30 hover:bg-violet-50/30 ${className}`}
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 transition group-hover:bg-[#7C5CFC] group-hover:text-white">
          <Mic className="h-4 w-4" />
        </div>
        <div className="text-left">
          <p className="text-[13px] font-medium text-gray-700">{placeholder}</p>
          <p className="text-[11px] text-gray-400">Click to start — speak freely, confirm when done</p>
        </div>
      </button>
    );
  }

  if (mode === "recording") {
    return (
      <div className={`rounded-2xl border-2 border-red-200 bg-red-50/30 p-5 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 animate-pulse items-center justify-center rounded-full bg-red-500 shadow-lg shadow-red-500/30">
              <Mic className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-[14px] font-bold text-red-600">Recording... {formatTime(duration)}</p>
              <p className="text-[12px] text-gray-500">Speak your experience freely. Click stop when finished.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={stopRecording}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500 text-white transition hover:bg-red-600"
          >
            <MicOff className="h-5 w-5" />
          </button>
        </div>

        {(rawText || interim) ? (
          <div className="mt-4 rounded-xl bg-white p-4">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">Live transcript</p>
            <p className="mt-2 text-[13px] leading-relaxed text-gray-700">
              {rawText}
              {interim ? <span className="text-gray-400 italic"> {interim}</span> : null}
            </p>
          </div>
        ) : (
          <div className="mt-4 rounded-xl bg-white/50 p-4 text-center">
            <p className="text-[13px] text-gray-400">Start speaking... your words will appear here</p>
          </div>
        )}
      </div>
    );
  }

  if (mode === "enhancing") {
    return (
      <div className={`rounded-2xl border border-[#7C5CFC]/20 bg-violet-50/30 p-5 text-center ${className}`}>
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#7C5CFC]" />
        <p className="mt-3 text-[14px] font-semibold text-gray-900">AI is enhancing your text...</p>
        <p className="mt-1 text-[12px] text-gray-500">Making it impact-driven with quantifiable results</p>
      </div>
    );
  }

  // Review mode
  return (
    <div className={`rounded-2xl border border-gray-200 bg-white p-5 ${className}`}>
      <div className="flex items-center justify-between">
        <p className="text-[14px] font-bold text-gray-900">Review your input</p>
        <button type="button" onClick={reset} className="text-[12px] font-medium text-gray-400 transition hover:text-gray-600">
          <RotateCcw className="mr-1 inline h-3 w-3" />Start over
        </button>
      </div>

      <div className="mt-4 rounded-xl bg-gray-50 p-4">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">What you said</p>
        <p className="mt-2 text-[13px] leading-relaxed text-gray-700">{rawText}</p>
      </div>

      {enhanced ? (
        <div className="mt-3 rounded-xl border border-[#7C5CFC]/20 bg-violet-50/30 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[#7C5CFC]">AI-Enhanced version</p>
          <p className="mt-2 text-[13px] font-medium leading-relaxed text-gray-900">{enhanced}</p>
        </div>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => confirmAndAdd(enhanced ?? rawText)}
          className="inline-flex items-center gap-1.5 rounded-xl bg-[#7C5CFC] px-4 py-2.5 text-[13px] font-semibold text-white transition hover:bg-[#6B4CE0]"
        >
          <Check className="h-4 w-4" />
          {enhanced ? "Use Enhanced Version" : "Add to Resume"}
        </button>

        {!enhanced ? (
          <button
            type="button"
            onClick={() => void enhanceWithAI()}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#7C5CFC]/20 px-4 py-2.5 text-[13px] font-semibold text-[#7C5CFC] transition hover:bg-violet-50"
          >
            <Sparkles className="h-4 w-4" />
            Enhance with AI
          </button>
        ) : (
          <button
            type="button"
            onClick={() => confirmAndAdd(rawText)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 px-4 py-2.5 text-[13px] font-medium text-gray-600 transition hover:bg-gray-50"
          >
            Use Original Instead
          </button>
        )}

        <button
          type="button"
          onClick={startRecording}
          className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 px-4 py-2.5 text-[13px] font-medium text-gray-600 transition hover:bg-gray-50"
        >
          <Mic className="h-3.5 w-3.5" />
          Record Again
        </button>

        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-1.5 px-3 py-2.5 text-[13px] text-gray-400 transition hover:text-gray-600"
        >
          <X className="h-3.5 w-3.5" />
          Cancel
        </button>
      </div>
    </div>
  );
}
