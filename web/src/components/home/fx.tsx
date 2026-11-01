"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Soft light that follows the pointer across a section. */
export function Spotlight({ className = "", children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  return (
    <div
      ref={ref}
      className={`relative ${className}`}
      onPointerMove={(e) => {
        if (reduce || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        ref.current.style.setProperty("--sx", `${e.clientX - r.left}px`);
        ref.current.style.setProperty("--sy", `${e.clientY - r.top}px`);
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-100 transition-opacity duration-500"
        style={{
          background:
            "radial-gradient(520px circle at var(--sx, 50%) var(--sy, 30%), rgba(255,226,122,0.28), transparent 60%)",
        }}
        aria-hidden="true"
      />
      {children}
    </div>
  );
}

/** Headline that rises in word by word. Words stay real text for screen readers and SEO. */
export function WordReveal({ text, className = "", delay = 0 }: { text: string; className?: string; delay?: number }) {
  const reduce = useReducedMotion();
  const words = text.split(" ");
  return (
    <span className={className}>
      {words.map((w, i) => (
        <span key={`${w}-${i}`}>
          <motion.span
            className="inline-block"
            initial={reduce ? false : { opacity: 0, y: "0.45em", filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.7, ease: EASE, delay: delay + i * 0.06 }}
          >
            {w}
          </motion.span>
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </span>
  );
}

/** Highlighter stroke that draws itself in when it scrolls into view. */
export function Marker({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduce = useReducedMotion();
  const on = inView || reduce;
  return (
    <span
      ref={ref}
      className="bg-[linear-gradient(#FFE27A,#FFE27A)] bg-no-repeat [box-decoration-break:clone] [-webkit-box-decoration-break:clone]"
      style={{
        backgroundSize: on ? "100% 34%" : "0% 34%",
        backgroundPosition: "0 88%",
        transition: `background-size 900ms cubic-bezier(.22,1,.36,1) ${delay}ms`,
      }}
    >
      {children}
    </span>
  );
}

/** Number that counts up the first time it is seen. Non-numeric prefixes/suffixes are kept. */
export function CountUp({ value, className = "" }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();
  const m = value.match(/^(\D*)(\d+)(.*)$/);
  const target = m ? Number(m[2]) : 0;
  const numeric = !!m;
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!numeric || !inView || reduce) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / 1100);
      setN(Math.round(target * (1 - Math.pow(1 - t, 3))));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduce, target, numeric]);
  if (!m) return <span className={className}>{value}</span>;
  return (
    <span ref={ref} className={className}>
      {m[1]}
      {reduce ? target : n}
      {m[3]}
    </span>
  );
}

/** Card that tilts toward the pointer. */
export function Tilt({ children, className = "", max = 7 }: { children: ReactNode; className?: string; max?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [t, setT] = useState({ x: 0, y: 0, on: false });
  return (
    <div
      ref={ref}
      className={className}
      style={{ perspective: 900 }}
      onPointerMove={(e) => {
        if (reduce || e.pointerType !== "mouse" || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        setT({ x: ((e.clientY - r.top) / r.height - 0.5) * -2 * max, y: ((e.clientX - r.left) / r.width - 0.5) * 2 * max, on: true });
      }}
      onPointerLeave={() => setT({ x: 0, y: 0, on: false })}
    >
      <div
        style={{
          transform: `rotateX(${t.x}deg) rotateY(${t.y}deg) translateY(${t.on ? -6 : 0}px)`,
          transition: t.on ? "transform 80ms linear" : "transform 500ms cubic-bezier(.22,1,.36,1)",
          transformStyle: "preserve-3d",
        }}
      >
        {children}
      </div>
    </div>
  );
}

/** Wrapper that pulls its child slightly toward the pointer. */
export function Magnetic({ children, strength = 0.25 }: { children: ReactNode; strength?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  const [p, setP] = useState({ x: 0, y: 0 });
  return (
    <span
      ref={ref}
      className="inline-block"
      onPointerMove={(e) => {
        if (reduce || e.pointerType !== "mouse" || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        setP({ x: (e.clientX - r.left - r.width / 2) * strength, y: (e.clientY - r.top - r.height / 2) * strength });
      }}
      onPointerLeave={() => setP({ x: 0, y: 0 })}
      style={{ transform: `translate(${p.x}px, ${p.y}px)`, transition: "transform 300ms cubic-bezier(.22,1,.36,1)" }}
    >
      {children}
    </span>
  );
}

/** Fade-and-rise on scroll, with optional stagger for direct children via `index`. */
export function Reveal({ children, className = "", delay = 0, y = 24 }: { children: ReactNode; className?: string; delay?: number; y?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.7, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

/** Small cards that float around the hero tool, like fields the parser just pulled out. */
export function FloatingChips() {
  const reduce = useReducedMotion();
  const chips = [
    { t: "email: not found", tone: "bad", cls: "left-[-4%] top-[18%]", d: 0 },
    { t: "Experience ✓", tone: "good", cls: "right-[-3%] top-[10%]", d: 1.2 },
    { t: "dates: mixed formats", tone: "bad", cls: "right-[-6%] bottom-[22%]", d: 0.6 },
    { t: "Score 91 · Ready to send", tone: "good", cls: "left-[-7%] bottom-[12%]", d: 1.8 },
  ];
  return (
    <div className="pointer-events-none absolute inset-0 hidden xl:block" aria-hidden="true">
      {chips.map((c) => (
        <motion.span
          key={c.t}
          className={`absolute ${c.cls} rounded-full border px-3 py-1.5 font-mono text-[12px] shadow-[0_12px_30px_-14px_rgba(0,0,0,0.35)] ${
            c.tone === "bad" ? "border-[#F0D9A0] bg-[#FFF7DA] text-[#6B4E00]" : "border-[#CFE9DA] bg-[#EEFAF3] text-[#0E6B40]"
          }`}
          initial={reduce ? false : { opacity: 0, scale: 0.9 }}
          animate={reduce ? { opacity: 1 } : { opacity: 1, scale: 1, y: [0, -8, 0] }}
          transition={
            reduce
              ? undefined
              : { opacity: { duration: 0.6, delay: 0.8 + c.d * 0.3 }, scale: { duration: 0.6, delay: 0.8 + c.d * 0.3 }, y: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: c.d } }
          }
        >
          {c.t}
        </motion.span>
      ))}
    </div>
  );
}

/** Scrolling strip of text, paused on hover. */
export function Marquee({ items }: { items: string[] }) {
  const row = [...items, ...items];
  return (
    <div className="group relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
      <div className="flex w-max animate-[lcv-marquee_38s_linear_infinite] gap-10 group-hover:[animation-play-state:paused] motion-reduce:animate-none">
        {row.map((t, i) => (
          <span key={i} className="whitespace-nowrap text-[15px] font-medium text-[#6B6B6B]" aria-hidden={i >= items.length}>
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

/** A short burst of paper confetti; renders nothing with reduced motion. */
export function Confetti({ fire }: { fire: number }) {
  const reduce = useReducedMotion();
  if (!fire || reduce) return null;
  const colors = ["#FFE27A", "#2563EB", "#12A15E", "#111111", "#C2700A"];
  return (
    <div key={fire} className="pointer-events-none absolute inset-0 overflow-visible" aria-hidden="true">
      {Array.from({ length: 26 }).map((_, i) => {
        const angle = (i / 26) * Math.PI * 2;
        const dist = 70 + ((i * 37) % 60);
        return (
          <motion.span
            key={i}
            className="absolute left-[66px] top-[66px] h-2 w-1.5 rounded-[1px]"
            style={{ background: colors[i % colors.length] }}
            initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
            animate={{ x: Math.cos(angle) * dist, y: Math.sin(angle) * dist + 40, opacity: 0, rotate: 240 + i * 20 }}
            transition={{ duration: 1.1, ease: "easeOut" }}
          />
        );
      })}
    </div>
  );
}
