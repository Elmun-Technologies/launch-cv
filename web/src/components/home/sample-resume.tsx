/**
 * Static sample resumes rendered as real text — the homepage uses these as
 * its imagery instead of stock photos or drawn mockups. Each page is laid out
 * at a fixed 600px width and scaled down by the caller.
 */

type Job = { title: string; dates: string; bullets: string[] };

export type SampleResume = {
  variant: "classic" | "executive" | "sidebar" | "accent";
  name: string;
  role: string;
  contact: string;
  summary?: string;
  jobs: Job[];
  skills: string;
  education?: string;
};

export const SAMPLE_RESUMES: Record<string, SampleResume> = {
  engineer: {
    variant: "classic",
    name: "James Carter",
    role: "Software Engineer",
    contact: "Seattle, WA · james.carter@email.com",
    jobs: [
      {
        title: "Senior Engineer, Cascade Cloud",
        dates: "2021–Now",
        bullets: [
          "Scaled the billing service to 3M daily requests at 99.99% uptime",
          "Cut infrastructure costs by $420K a year by rightsizing clusters",
          "Mentored 5 engineers; 2 promoted to senior",
        ],
      },
      {
        title: "Engineer, Parcelly",
        dates: "2018–2021",
        bullets: [
          "Built a route optimizer that saved drivers 11 minutes per shift",
          "Migrated a monolith to 12 services on Kubernetes",
        ],
      },
    ],
    skills: "Go, Python, PostgreSQL, AWS, Kubernetes, Terraform",
    education: "B.S. Computer Science, University of Washington",
  },
  pm: {
    variant: "classic",
    name: "Maria Lopez",
    role: "Product Manager",
    contact: "Austin, TX · maria.lopez@email.com",
    summary:
      "Product manager with 6 years in B2B SaaS and healthcare. I turn customer research into shipped features that move retention and revenue.",
    jobs: [
      {
        title: "Product Manager, Brightpath Health",
        dates: "2022–Now",
        bullets: [
          "Launched patient self-scheduling, cutting no-shows by 23% across 41 clinics",
          "Led 9 engineers and 2 designers through 3 major releases",
          "Ran 30+ customer interviews that shaped the 2024 roadmap",
        ],
      },
      {
        title: "Associate PM, Fieldnote",
        dates: "2019–2022",
        bullets: ["Raised week-1 activation from 38% to 57%", "Introduced A/B testing used by 4 product teams"],
      },
    ],
    skills: "Product strategy · Stakeholder management · SQL · Amplitude · A/B testing",
  },
  marketing: {
    variant: "accent",
    name: "Priya Nair",
    role: "Marketing Manager",
    contact: "London, UK · priya.nair@email.com",
    jobs: [
      {
        title: "Marketing Manager, Loop & Co",
        dates: "2021–Now",
        bullets: [
          "Grew organic traffic 3.4x in 18 months",
          "Managed a £1.2M annual paid media budget",
          "Launched 3 products across 5 EU markets",
        ],
      },
      {
        title: "Growth Marketer, Brightside",
        dates: "2018–2021",
        bullets: ["Cut cost per lead by 38% with lifecycle email"],
      },
    ],
    skills: "SEO, HubSpot, GA4, Paid social, Copywriting, Budgeting",
    education: "MSc Marketing, King's College London",
  },
  finance: {
    variant: "executive",
    name: "Sarah O'Connell",
    role: "Chief Financial Officer",
    contact: "Boston, MA · s.oconnell@email.com",
    summary:
      "Finance leader with 15 years guiding growth-stage companies through funding rounds, audits and two exits.",
    jobs: [
      {
        title: "CFO, Harborline Logistics",
        dates: "2019–Present",
        bullets: ["Led an $85M Series C and prepared the company for IPO readiness", "Improved gross margin from 31% to 42% in three years"],
      },
      {
        title: "VP Finance, Meridian Retail",
        dates: "2014–2019",
        bullets: ["Built an FP&A team of 12 across 3 countries"],
      },
    ],
    skills: "FP&A · Fundraising · M&A · Audit · Board reporting",
  },
  designer: {
    variant: "sidebar",
    name: "Daniel Reyes",
    role: "Senior Product Designer",
    contact: "San Francisco, CA · daniel.reyes@email.com",
    summary: "Designer with 7 years shipping consumer fintech products.",
    jobs: [
      {
        title: "Lead Designer, Pocketwise",
        dates: "2021–Now",
        bullets: ["Redesigned onboarding; sign-up completion up 31%", "Built a design system adopted by 6 teams"],
      },
      {
        title: "Product Designer, Lumen Bank",
        dates: "2017–2021",
        bullets: ["Shipped card controls used weekly by 1.2M customers"],
      },
    ],
    skills: "Figma, Design systems, Prototyping, User research, HTML/CSS",
  },
};

function Heading({ children, ruled = true }: { children: string; ruled?: boolean }) {
  return (
    <h5
      className={`mt-[18px] text-[11.5px] font-bold tracking-[0.09em] text-[#1c1c1c] ${
        ruled ? "border-b-[1.5px] border-[#1c1c1c] pb-1" : ""
      }`}
    >
      {children}
    </h5>
  );
}

function Jobs({ jobs }: { jobs: Job[] }) {
  return (
    <>
      {jobs.map((j) => (
        <div key={j.title}>
          <div className="mt-[9px] flex justify-between font-semibold">
            <span>{j.title}</span>
            <span>{j.dates}</span>
          </div>
          <ul className="mt-1 list-disc pl-[18px]">
            {j.bullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        </div>
      ))}
    </>
  );
}

/** One resume page at its natural 600px width. */
export function ResumePage({ resume, className = "" }: { resume: SampleResume; className?: string }) {
  const r = resume;
  const base = `w-[600px] bg-white text-[13px] leading-[1.5] text-[#1c1c1c] ${className}`;

  if (r.variant === "sidebar") {
    return (
      <div className={`${base} flex min-h-[800px]`}>
        <div className="w-[190px] shrink-0 bg-[#22262E] px-[22px] py-9 text-[12px] text-[#E5E7EB]">
          <div className="flex h-[96px] w-[96px] items-center justify-center rounded-full bg-[#3A404B] text-[30px] font-semibold text-white">
            {r.name.split(" ").map((p) => p[0]).join("")}
          </div>
          <p className="mt-6 text-[11px] font-bold tracking-[0.08em] text-[#9DB7FF]">CONTACT</p>
          <p className="mt-1.5 whitespace-pre-line">{r.contact.split(" · ").join("\n")}</p>
          <p className="mt-5 text-[11px] font-bold tracking-[0.08em] text-[#9DB7FF]">SKILLS</p>
          <p className="mt-1.5 whitespace-pre-line">{r.skills.split(", ").join("\n")}</p>
        </div>
        <div className="flex-1 px-[26px] py-9">
          <p className="text-[28px] font-bold">{r.name}</p>
          <p className="font-semibold text-[#2563EB]">{r.role}</p>
          {r.summary ? <p className="mt-3 text-[#444]">{r.summary}</p> : null}
          <Heading ruled={false}>EXPERIENCE</Heading>
          <Jobs jobs={r.jobs} />
        </div>
      </div>
    );
  }

  if (r.variant === "executive") {
    return (
      <div className={`${base} px-[46px] py-11 font-serif`}>
        <p className="text-center text-[30px] tracking-[0.06em]">{r.name.toUpperCase()}</p>
        <p className="mt-1 text-center text-[12px] text-[#555]">
          {r.role} · {r.contact}
        </p>
        <div className="mt-4 h-px bg-[#1c1c1c]" />
        <div className="mt-[3px] h-px bg-[#1c1c1c]" />
        {r.summary ? (
          <>
            <p className="mt-4 text-center tracking-[0.12em]">SUMMARY</p>
            <p className="mt-1.5">{r.summary}</p>
          </>
        ) : null}
        <p className="mt-4 text-center tracking-[0.12em]">EXPERIENCE</p>
        <Jobs jobs={r.jobs} />
        <p className="mt-4 text-center tracking-[0.12em]">SKILLS</p>
        <p className="mt-1.5 text-center">{r.skills}</p>
      </div>
    );
  }

  if (r.variant === "accent") {
    return (
      <div className={`${base} px-[46px] py-11`}>
        <div className="flex items-end justify-between border-b-4 border-[#12A15E] pb-3">
          <div>
            <p className="text-[28px] font-bold">{r.name}</p>
            <p className="font-semibold text-[#0E7A48]">{r.role}</p>
          </div>
          <p className="whitespace-pre-line text-right text-[12px] text-[#555]">{r.contact.split(" · ").join("\n")}</p>
        </div>
        <Heading ruled={false}>EXPERIENCE</Heading>
        <Jobs jobs={r.jobs} />
        <Heading ruled={false}>SKILLS</Heading>
        <p className="mt-1.5">{r.skills}</p>
        {r.education ? (
          <>
            <Heading ruled={false}>EDUCATION</Heading>
            <p className="mt-1.5">{r.education}</p>
          </>
        ) : null}
      </div>
    );
  }

  return (
    <div className={`${base} px-[44px] py-10`}>
      <p className="text-[28px] font-bold">{r.name}</p>
      <p className="text-[#555]">
        {r.role} · {r.contact}
      </p>
      {r.summary ? (
        <>
          <Heading>SUMMARY</Heading>
          <p className="mt-1.5">{r.summary}</p>
        </>
      ) : null}
      <Heading>EXPERIENCE</Heading>
      <Jobs jobs={r.jobs} />
      <Heading>SKILLS</Heading>
      <p className="mt-1.5">{r.skills}</p>
      {r.education ? (
        <>
          <Heading>EDUCATION</Heading>
          <p className="mt-1.5">{r.education}</p>
        </>
      ) : null}
    </div>
  );
}

/** A resume page scaled into a fixed-size thumbnail box. */
export function ResumeThumb({
  resume,
  scale,
  height,
  className = "",
}: {
  resume: SampleResume;
  scale: number;
  height: number;
  className?: string;
}) {
  return (
    <div
      className={`overflow-hidden rounded-md border border-[#E5E5E2] bg-white ${className}`}
      style={{ width: 600 * scale, height }}
      aria-hidden="true"
    >
      <div style={{ transform: `scale(${scale})`, transformOrigin: "top left" }}>
        <ResumePage resume={resume} />
      </div>
    </div>
  );
}
