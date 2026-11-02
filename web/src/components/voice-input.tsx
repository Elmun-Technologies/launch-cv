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

  const softBtn =
    "inline-flex min-h-11 items-center gap-1.5 rounded-full bg-[#f1eff8] px-4 text-[13px] font-semibold text-[#121226] transition-colors hover:bg-[#e4dfff] sm:min-h-10";

  if (mode === "idle") {
    return (
      <button
        type="button"
        onClick={startRecording}
        className={`group inline-flex min-h-11 items-center gap-2 rounded-full bg-[#f1eff8] py-1 pl-1 pr-4 text-[14px] font-semibold text-[#121226] transition-colors hover:bg-[#e4dfff] sm:min-h-10 ${className}`}
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#5440e8] transition-colors group-hover:bg-[#5440e8] group-hover:text-white">
          <Mic className="h-4 w-4" aria-hidden="true" />
        </span>
        {placeholder}
        <span className="sr-only"> — start speaking, then confirm when done</span>
      </button>
    );
  }

  if (mode === "recording") {
    return (
      <div className={`w-full rounded-[20px] border-[1.5px] border-[#f3c4c6] bg-[#fdf3f3] p-4 sm:p-5 ${className}`}>
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#c42b30] motion-safe:animate-pulse">
              <Mic className="h-5 w-5 text-white" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p role="status" className="text-[14px] font-bold text-[#a3222a]">Recording... {formatTime(duration)}</p>
              <p className="text-[13px] text-[#4a4862]">Speak your experience freely. Click stop when finished.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={stopRecording}
            aria-label="Stop recording"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#c42b30] text-white transition-colors hover:bg-[#a3222a] focus-visible:rounded-full!"
          >
            <MicOff className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {(rawText || interim) ? (
          <div className="mt-4 rounded-2xl bg-white p-4">
            <p className="text-[12px] font-bold uppercase tracking-[0.06em] text-[#66647c]">Live transcript</p>
            <p className="mt-2 text-[14px] leading-[21px] text-[#121226]">
              {rawText}
              {interim ? <span className="italic text-[#66647c]"> {interim}</span> : null}
            </p>
          </div>
        ) : (
          <div className="mt-4 rounded-2xl bg-white/70 p-4 text-center">
            <p className="text-[14px] text-[#66647c]">Start speaking... your words will appear here</p>
          </div>
        )}
      </div>
    );
  }

  if (mode === "enhancing") {
    return (
      <div role="status" className={`w-full rounded-[20px] bg-[#f1eff8] p-5 text-center ${className}`}>
        <Loader2 className="mx-auto h-8 w-8 text-[#5440e8] motion-safe:animate-spin" aria-hidden="true" />
        <p className="mt-3 text-[15px] font-bold text-[#121226]">AI is enhancing your text...</p>
        <p className="mt-1 text-[13px] text-[#66647c]">Making it impact-driven with quantifiable results</p>
      </div>
    );
  }

  // Review mode
  return (
    <div className={`w-full rounded-[20px] border-[1.5px] border-[#e2e0ea] bg-white p-4 sm:p-5 ${className}`}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-[15px] font-bold text-[#121226]">Review your input</p>
        <button type="button" onClick={reset} className="inline-flex min-h-10 items-center gap-1 rounded-full px-2 text-[13px] font-semibold text-[#66647c] transition-colors hover:text-[#121226]">
          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />Start over
        </button>
      </div>

      <div className="mt-3 rounded-2xl bg-[#f7f6fb] p-4">
        <p className="text-[12px] font-bold uppercase tracking-[0.06em] text-[#66647c]">What you said</p>
        <p className="mt-2 text-[14px] leading-[21px] text-[#121226]">{rawText}</p>
      </div>

      {enhanced ? (
        <div className="mt-3 rounded-2xl bg-[#5440e8] p-4 text-white">
          <p className="inline-flex items-center gap-1.5 text-[12px] font-extrabold uppercase tracking-[0.06em] text-[#e4dfff]">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" /> AI-enhanced version
          </p>
          <p className="mt-2 text-[15px] font-semibold leading-[22px]">{enhanced}</p>
        </div>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => confirmAndAdd(enhanced ?? rawText)}
          className="inline-flex min-h-11 items-center gap-1.5 rounded-full bg-[#5440e8] px-4 text-[13px] font-semibold text-white transition-colors hover:bg-[#4430d6] sm:min-h-10"
        >
          <Check className="h-4 w-4" aria-hidden="true" />
          {enhanced ? "Use enhanced version" : "Add to resume"}
        </button>

        {!enhanced ? (
          <button type="button" onClick={() => void enhanceWithAI()} className={softBtn}>
            <Sparkles className="h-4 w-4 text-[#5440e8]" aria-hidden="true" />
            Enhance with AI
          </button>
        ) : (
          <button type="button" onClick={() => confirmAndAdd(rawText)} className={softBtn}>
            Use original instead
          </button>
        )}

        <button type="button" onClick={startRecording} className={softBtn}>
          <Mic className="h-3.5 w-3.5" aria-hidden="true" />
          Record again
        </button>

        <button
          type="button"
          onClick={reset}
          className="inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 text-[13px] font-semibold text-[#66647c] transition-colors hover:text-[#121226] sm:min-h-10"
        >
          <X className="h-3.5 w-3.5" aria-hidden="true" />
          Cancel
        </button>
      </div>
    </div>
  );
}
