import Link from "next/link";
import type { Metadata } from "next";
import { LandingNav } from "@/components/landing-nav";
import { LandingFooter } from "@/components/landing-footer";
import { ArrowRight, Check } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type FeaturePageProps = {
  icon: LucideIcon;
  title: string;
  tagline: string;
  description: string;
  steps: { title: string; description: string }[];
  benefits: string[];
  testimonial?: { text: string; name: string; role: string };
  relatedFeatures: { title: string; href: string }[];
};

export function FeaturePageLayout({ icon: Icon, title, tagline, description, steps, benefits, testimonial, relatedFeatures }: FeaturePageProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <LandingNav />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-b from-[#F0F7FF] to-white py-20">
          <div className="mx-auto max-w-4xl px-4 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F5F3FF] text-[#7C5CFC]">
              <Icon className="h-8 w-8" />
            </div>
            <h1 className="mt-6 text-[44px] font-bold leading-tight tracking-tight text-gray-900">{title}</h1>
            <p className="mt-3 text-lg text-[#7C5CFC] font-medium">{tagline}</p>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-gray-500">{description}</p>
            <div className="mt-8 flex justify-center gap-3">
              <Link href="/register" className="inline-flex items-center gap-2 rounded-full bg-[#7C5CFC] px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:bg-[#6B4CE0]">
                Try it free <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/features" className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-7 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50">
                All features
              </Link>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="mx-auto max-w-5xl px-4">
            <h2 className="text-center text-2xl font-bold text-gray-900">How it works</h2>
            <div className="mt-10 grid gap-8 sm:grid-cols-3">
              {steps.map((step, i) => (
                <div key={i} className="text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#7C5CFC] text-lg font-bold text-white">{i + 1}</div>
                  <h3 className="mt-4 text-base font-bold text-gray-900">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-500">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#FAFBFD] py-16">
          <div className="mx-auto max-w-3xl px-4">
            <h2 className="text-center text-2xl font-bold text-gray-900">Benefits</h2>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {benefits.map((b) => (
                <div key={b} className="flex items-start gap-3 rounded-xl bg-white p-4 shadow-sm">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-[#7C5CFC]" />
                  <p className="text-sm text-gray-700">{b}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {testimonial ? (
          <section className="py-16">
            <div className="mx-auto max-w-2xl px-4 text-center">
              <p className="text-lg italic leading-relaxed text-gray-600">&ldquo;{testimonial.text}&rdquo;</p>
              <p className="mt-4 text-sm font-semibold text-gray-900">{testimonial.name}</p>
              <p className="text-xs text-gray-500">{testimonial.role}</p>
            </div>
          </section>
        ) : null}

        <section className="border-t border-gray-100 bg-white py-12">
          <div className="mx-auto max-w-4xl px-4">
            <h3 className="text-center text-lg font-bold text-gray-900">Related Features</h3>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {relatedFeatures.map((rf) => (
                <Link key={rf.href} href={rf.href} className="rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-[#7C5CFC] hover:text-[#7C5CFC]">
                  {rf.title}
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-r from-[#7C5CFC] to-[#7C3AED] py-16">
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-4 text-center">
            <h2 className="text-2xl font-bold text-white">Ready to get started?</h2>
            <Link href="/register" className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3 text-sm font-semibold text-[#7C5CFC] shadow-lg transition hover:shadow-xl">
              Create your free account <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>
      <LandingFooter />
    </div>
  );
}
