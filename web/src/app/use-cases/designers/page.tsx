import type { Metadata } from "next";
import Link from "next/link";
import { LandingNav } from "@/components/landing-nav";
import { LandingFooter } from "@/components/landing-footer";
import { ArrowRight, Palette, AlertTriangle, Sparkles, Target, FileText, BarChart3 } from "lucide-react";

export const metadata: Metadata = {
  title: "Resume Builder for UX Designers | Launch CV",
  description: "Create ATS-optimized resumes for UX, UI, and product design roles. Showcase your design process, impact, and portfolio effectively.",
};

const painPoints = [
  {
    icon: AlertTriangle,
    problem: "Beautiful portfolio but weak resume",
    solution: "Launch CV complements your portfolio with a structured resume that clearly communicates your design process and business impact.",
  },
  {
    icon: AlertTriangle,
    problem: "Hard to describe design impact in words",
    solution: "Our AI helps you frame design outcomes as measurable results — conversion lifts, usability improvements, and user satisfaction scores.",
  },
  {
    icon: AlertTriangle,
    problem: "ATS can't evaluate visual design skills",
    solution: "We ensure your resume includes the right keywords and structure so ATS systems recognize your qualifications before your portfolio is ever seen.",
  },
  {
    icon: AlertTriangle,
    problem: "Different companies want different design skills",
    solution: "JD Alignment tailors your resume to each role — whether it's UX research, UI design, interaction design, or design systems.",
  },
];

const keywords = [
  "User Experience (UX)", "User Interface (UI)", "Design Systems", "Figma",
  "Sketch", "Adobe XD", "Prototyping", "Wireframing",
  "User Research", "Usability Testing", "A/B Testing", "Information Architecture",
  "Interaction Design", "Responsive Design", "Accessibility (WCAG)", "Design Thinking",
  "Visual Design", "Typography", "Color Theory", "Component Libraries",
];

export default function DesignersPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <LandingNav />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-b from-[#F0F7FF] to-white py-20 sm:py-28">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(4,156,255,0.08),transparent_50%)]" />
          <div className="relative mx-auto max-w-4xl px-4 text-center">
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-[#7C5CFC]/20 bg-white px-4 py-1.5 text-xs font-semibold text-[#7C5CFC] shadow-sm">
              <Palette className="h-3.5 w-3.5" />
              For UX Designers
            </div>
            <h1 className="mt-8 text-[44px] font-bold leading-[1.1] tracking-tight text-gray-900 sm:text-[52px]">
              Land your dream{" "}
              <span className="bg-gradient-to-r from-[#7C5CFC] to-[#7C3AED] bg-clip-text text-transparent">
                design role
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-500">
              Your portfolio shows what you can design — but your resume gets you through the door. Launch CV helps designers create resumes that articulate process, quantify impact, and pass ATS filters at top design companies.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link href="/register" className="inline-flex items-center gap-2 rounded-full bg-[#7C5CFC] px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:bg-[#6B4CE0]">
                Build your design resume <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/features" className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-8 py-3.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50">
                See all features
              </Link>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="mx-auto max-w-5xl px-4">
            <h2 className="text-center text-2xl font-bold text-gray-900">Pain Points We Solve</h2>
            <p className="mx-auto mt-3 max-w-lg text-center text-sm text-gray-500">
              Design resumes need to communicate both creative ability and business thinking.
            </p>
            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              {painPoints.map((pp) => (
                <div key={pp.problem} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-400">
                      <pp.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{pp.problem}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-500">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm leading-relaxed text-gray-500">{pp.solution}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#FAFBFD] py-20">
          <div className="mx-auto max-w-5xl px-4">
            <h2 className="text-center text-2xl font-bold text-gray-900">How Launch CV Helps Designers</h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-3">
              <div className="rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F5F3FF] text-[#7C5CFC]">
                  <Target className="h-7 w-7" />
                </div>
                <h3 className="mt-4 text-base font-bold text-gray-900">JD Alignment</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">
                  Tailor your resume to each design role — from UX research positions to senior product design roles at top companies.
                </p>
              </div>
              <div className="rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F5F3FF] text-[#7C5CFC]">
                  <FileText className="h-7 w-7" />
                </div>
                <h3 className="mt-4 text-base font-bold text-gray-900">Design Templates</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">
                  Clean, minimal templates with sections for design tools, methodologies, portfolio highlights, and case study summaries.
                </p>
              </div>
              <div className="rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F5F3FF] text-[#7C5CFC]">
                  <BarChart3 className="h-7 w-7" />
                </div>
                <h3 className="mt-4 text-base font-bold text-gray-900">Impact Metrics</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">
                  AI helps you articulate design outcomes: conversion improvements, task completion rates, NPS lifts, and accessibility scores.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="mx-auto max-w-4xl px-4">
            <h2 className="text-center text-2xl font-bold text-gray-900">Top Design Keywords</h2>
            <p className="mx-auto mt-3 max-w-lg text-center text-sm text-gray-500">
              Launch CV naturally integrates these high-value keywords into your resume based on your actual experience.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-2">
              {keywords.map((kw) => (
                <span key={kw} className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm">
                  {kw}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-r from-[#7C5CFC] to-[#7C3AED] py-16">
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-4 text-center">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">Ready to land your next design role?</h2>
            <p className="text-base text-white/80">Join designers at top companies who use Launch CV to get past ATS and into interviews.</p>
            <Link
              href="/register"
              className="mt-2 inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-[#7C5CFC] shadow-lg transition hover:shadow-xl"
            >
              Build your design resume <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>
      <LandingFooter />
    </div>
  );
}
