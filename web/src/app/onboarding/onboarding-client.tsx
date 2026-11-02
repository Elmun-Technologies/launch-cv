"use client";

import { useId, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Loader2, Search } from "lucide-react";
import { SiteMark } from "@/components/site/brand";
import { appBtnPrimary, focusPill, focusRing } from "@/components/app/shell/ui";
import { siteFontVars } from "@/lib/site-fonts";
import { EXPERIENCE_LEVELS, type ExperienceLevel } from "@/lib/target-role";

type Role = { slug: string; role: string };

const MAX_OPTIONS = 8;

export function OnboardingClient({
  roles,
  chips,
  next,
  initialRole,
  initialLevel,
}: {
  roles: Role[];
  chips: string[];
  next: string;
  initialRole: string | null;
  initialLevel: ExperienceLevel | null;
}) {
  const uid = useId();
  const listId = `${uid}-roles`;
  const inputRef = useRef<HTMLInputElement>(null);
  const bySlug = useMemo(() => new Map(roles.map((r) => [r.slug, r])), [roles]);

  const [role, setRole] = useState<string | null>(initialRole);
  const [query, setQuery] = useState(initialRole ? (bySlug.get(initialRole)?.role ?? "") : "");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [level, setLevel] = useState<ExperienceLevel | null>(initialLevel);
  const [busy, setBusy] = useState<"save" | "skip" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return roles.slice(0, MAX_OPTIONS);
    const starts = roles.filter((r) => r.role.toLowerCase().startsWith(q));
    const contains = roles.filter((r) => !r.role.toLowerCase().startsWith(q) && r.role.toLowerCase().includes(q));
    return [...starts, ...contains].slice(0, MAX_OPTIONS);
  }, [query, roles]);

  // The picked role is always shown as a chip, first when it isn't one of the defaults.
  const chipSlugs = role && !chips.includes(role) ? [role, ...chips.slice(0, -1)] : chips;
  const showList = open && matches.length > 0 && !(role && bySlug.get(role)?.role === query);

  function pick(slug: string) {
    setRole(slug);
    setQuery(bySlug.get(slug)?.role ?? "");
    setOpen(false);
    setError(null);
  }

  async function submit(action: "save" | "skip") {
    if (action === "save" && !role) {
      setError("Pick a role from the list, or select Skip.");
      inputRef.current?.focus();
      return;
    }
    setBusy(action);
    setError(null);
    const r = await fetch("/api/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(action === "skip" ? { action } : { action, targetRole: role, experienceLevel: level }),
    }).catch(() => null);
    if (r?.ok) {
      window.location.href = next;
      return;
    }
    const j = r ? await r.json().catch(() => ({})) : {};
    setBusy(null);
    setError(typeof j.error === "string" ? j.error : "Couldn't save that. Please try again.");
  }

  return (
    <div className={`lc-site ${siteFontVars} flex min-h-screen flex-col`}>
      <header className="px-4 py-3 sm:px-6 lg:px-10">
        <Link href="/dashboard" aria-label="LaunchCV dashboard" className={`${focusRing} focus-visible:rounded-xl! inline-flex min-h-11 items-center gap-2.5 rounded-xl text-[#121226]`}>
          <SiteMark size={32} />
          <span className="text-[20px] font-extrabold tracking-[-0.02em]">
            launch<span className="text-[#5440e8]">cv</span>
          </span>
        </Link>
      </header>

      <main className="mx-auto w-full max-w-[840px] flex-1 px-4 pb-14 pt-8 text-center sm:px-10 sm:pt-14">
        <div className="flex justify-center gap-1.5" aria-hidden="true">
          <span className="h-1.5 w-3 rounded-full bg-[#5440e8]" />
          <span className="h-1.5 w-10 rounded-full bg-[#5440e8]" />
          <span className="h-1.5 w-3 rounded-full bg-[#d9d4f2]" />
        </div>
        <p className="mt-7 text-[18px] font-semibold tracking-[-0.01em] text-[#5440e8] sm:text-[20px]">Step 2 of 3</p>
        <h1 className="mt-3 text-[34px] font-extrabold leading-[1.1] tracking-[-0.04em] sm:text-[46px] sm:leading-[50px]">What role are you going for?</h1>
        <p className="mt-2.5 text-[16px] text-[#4a4862] sm:text-[17px]">We use it to pick the keywords and examples that matter for you.</p>

        <form
          className="mt-7"
          onSubmit={(e) => {
            e.preventDefault();
            void submit("save");
          }}
        >
          <div className="relative mx-auto max-w-[520px] text-left">
            <label htmlFor={`${uid}-search`} className="sr-only">
              Search roles
            </label>
            <div className="flex h-14 items-center gap-2.5 rounded-full border-2 border-[#5440e8] bg-white px-5 transition-shadow focus-within:ring-4 focus-within:ring-[#5440e8]/15">
              <Search className="h-[18px] w-[18px] shrink-0 text-[#121226]" strokeWidth={1.8} aria-hidden="true" />
              <input
                ref={inputRef}
                id={`${uid}-search`}
                type="text"
                role="combobox"
                aria-expanded={showList}
                aria-controls={listId}
                aria-autocomplete="list"
                aria-activedescendant={showList ? `${uid}-opt-${active}` : undefined}
                aria-describedby={error ? `${uid}-err` : undefined}
                aria-invalid={error ? true : undefined}
                autoComplete="off"
                placeholder="Search roles, e.g. Product Manager"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setOpen(true);
                  setActive(0);
                  if (role && bySlug.get(role)?.role !== e.target.value) setRole(null);
                }}
                onFocus={() => setOpen(true)}
                onBlur={() => setOpen(false)}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setOpen(true);
                    setActive((i) => (matches.length ? (i + 1) % matches.length : 0));
                  } else if (e.key === "ArrowUp") {
                    e.preventDefault();
                    setOpen(true);
                    setActive((i) => (matches.length ? (i - 1 + matches.length) % matches.length : 0));
                  } else if (e.key === "Enter" && showList) {
                    e.preventDefault();
                    const m = matches[active];
                    if (m) pick(m.slug);
                  } else if (e.key === "Escape") {
                    setOpen(false);
                  }
                }}
                className="h-full min-w-0 flex-1 bg-transparent text-[17px] text-[#121226] outline-none placeholder:text-[#706e88] focus-visible:outline-none!"
              />
            </div>
            <ul
              id={listId}
              role="listbox"
              aria-label="Roles"
              hidden={!showList}
              className="absolute inset-x-0 top-[calc(100%+6px)] z-20 max-h-[320px] overflow-y-auto rounded-[22px] bg-white p-1.5 shadow-[0_24px_48px_-20px_rgba(36,24,120,0.45)]"
            >
              {matches.map((m, i) => (
                <li
                  key={m.slug}
                  id={`${uid}-opt-${i}`}
                  role="option"
                  aria-selected={i === active}
                  // mousedown, not click: the input's blur would close the list first.
                  onMouseDown={(e) => {
                    e.preventDefault();
                    pick(m.slug);
                  }}
                  onMouseEnter={() => setActive(i)}
                  className={`flex min-h-11 cursor-pointer items-center rounded-2xl px-4 text-[15px] font-semibold ${i === active ? "bg-[#f1eff8] text-[#121226]" : "text-[#24223a]"}`}
                >
                  {m.role}
                </li>
              ))}
            </ul>
          </div>

          <div role="group" aria-label="Popular roles" className="mx-auto mt-4 flex max-w-[680px] flex-wrap justify-center gap-2">
            {chipSlugs.map((slug) => {
              const r = bySlug.get(slug);
              if (!r) return null;
              const on = slug === role;
              return (
                <button
                  key={slug}
                  type="button"
                  aria-pressed={on}
                  onClick={() => pick(slug)}
                  className={`${focusPill} min-h-11 rounded-full px-4 text-[14px] font-semibold transition-colors ${
                    on ? "bg-[#111118] text-white" : "bg-white text-[#121226] hover:bg-[#e4dfff]"
                  }`}
                >
                  {r.role}
                </button>
              );
            })}
          </div>

          <fieldset className="mt-7">
            <legend className="mx-auto text-[14px] font-bold text-[#4a4862]">Experience level</legend>
            <div className="mt-2.5 inline-flex max-w-full flex-wrap justify-center gap-1 rounded-[28px] bg-white p-1 sm:rounded-full">
              {EXPERIENCE_LEVELS.map((l) => (
                <label key={l.key} className="relative">
                  <input
                    type="radio"
                    name="level"
                    value={l.key}
                    checked={level === l.key}
                    onChange={() => setLevel(l.key)}
                    className="peer sr-only"
                  />
                  <span
                    className={`inline-flex min-h-11 cursor-pointer items-center rounded-full px-[18px] text-[14px] font-bold transition-colors peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#5440e8] ${
                      level === l.key ? "bg-[#5440e8] text-white" : "text-[#4a4862] hover:bg-[#f1eff8] hover:text-[#121226]"
                    }`}
                  >
                    {l.label}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <p id={`${uid}-err`} role="alert" className={error ? "mx-auto mt-6 max-w-[520px] rounded-2xl bg-[#fbe2e3] px-4 py-3 text-[14px] font-medium text-[#8f1d22]" : "sr-only"}>
            {error ?? ""}
          </p>

          <div className="mt-9 flex justify-center gap-2.5">
            <button
              type="button"
              onClick={() => void submit("skip")}
              disabled={busy !== null}
              className={`${focusPill} inline-flex min-h-11 items-center gap-2 rounded-full px-5 text-[15px] font-semibold text-[#4a4862] transition-colors hover:bg-white hover:text-[#121226] disabled:opacity-60`}
            >
              {busy === "skip" ? <Loader2 className="h-4 w-4 motion-safe:animate-spin" aria-hidden="true" /> : null}
              Skip
            </button>
            <button type="submit" disabled={busy !== null} className={`${appBtnPrimary} min-h-[52px] px-5`}>
              {busy === "save" ? <Loader2 className="h-4 w-4 motion-safe:animate-spin" aria-hidden="true" /> : null}
              Continue
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
