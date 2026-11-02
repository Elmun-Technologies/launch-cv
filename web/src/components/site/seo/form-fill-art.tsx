import type { ResumeExample } from "@/lib/resume-examples";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "Mar 2022 – Present" → "03/2022" (what a form's From field shows). */
function fromField(dates: string): string {
  const m = dates.match(/([A-Z][a-z]{2})\w*\s+(\d{4})/);
  if (!m) return dates;
  const i = MONTHS.indexOf(m[1]);
  return i < 0 ? m[2] : `${String(i + 1).padStart(2, "0")}/${m[2]}`;
}

function clip(s: string, n: number): string {
  return s.length <= n ? s : `${s.slice(0, n).replace(/\s+\S*$/, "")}…`;
}

/**
 * Hero illustration for the ATS guides: a sample resume (from the site's own
 * resume examples) and the application fields a parser would fill from it.
 */
export function FormFillArt({ example, poster }: { example: ResumeExample; poster: string }) {
  const r = example.resume;
  const job = r.jobs[0];
  const email = r.contact.split("·").map((s) => s.trim()).find((s) => s.includes("@")) ?? "";
  const fields = [
    { k: "Email", v: email },
    { k: "Job title", v: job.title },
    { k: "Company", v: job.company },
    { k: "From", v: fromField(job.dates) },
  ];
  return (
    <figure className="relative m-0 h-[360px] overflow-hidden rounded-[28px] bg-[#111118] sm:h-[480px] lg:h-[560px] lg:rounded-[36px]">
      <p aria-hidden="true" className="lc-poster absolute left-[18px] top-3.5 m-0 text-[44px] leading-[48px] text-[#2a2840] sm:left-[30px] sm:top-6 sm:text-[92px] sm:leading-[92px]">
        {poster}
      </p>
      <div
        aria-hidden="true"
        className="lc-float absolute left-4 top-[86px] w-[58%] max-w-[250px] -rotate-3 rounded-lg bg-white p-4 text-[9px] leading-[14px] text-[#121226] sm:left-10 sm:top-[150px] sm:p-5 sm:text-[10px] sm:leading-[15px]"
      >
        <b className="text-[13px] sm:text-[15px]">{r.name}</b>
        <p className="mt-0.5 truncate text-[#66647c]">{email}</p>
        <p className="mb-0.5 mt-2.5 border-b border-[#121226] font-extrabold tracking-[0.08em]">EXPERIENCE</p>
        <p className="mt-1">
          <b>{job.title}</b>, {job.company}
        </p>
        <p className="text-[#66647c]">{job.dates}</p>
        {job.bullets.slice(0, 2).map((b) => (
          <p key={b} className="mt-1">
            • {clip(b, 46)}
          </p>
        ))}
        <p className="mb-0.5 mt-2.5 border-b border-[#121226] font-extrabold tracking-[0.08em]">EDUCATION</p>
        <p className="mt-1">{clip(r.education, 44)}</p>
      </div>
      <div
        aria-hidden="true"
        className="lc-float lc-drift absolute bottom-5 right-4 w-[56%] max-w-[240px] rounded-[18px] border border-[#2f2d48] bg-[#1d1c2e] px-3.5 py-2 text-[12px] text-[#e9e7f3] sm:bottom-auto sm:right-9 sm:top-[170px] sm:rounded-[20px] sm:p-[18px] sm:text-[13px]"
      >
        {fields.map((f, i) => (
          <div key={f.k} className={`py-1.5 sm:py-2 ${i > 0 ? "border-t border-[#2f2d48]" : ""}`}>
            <span className="block text-[11px] text-[#a9a6c2]">{f.k}</span>
            <span className="mt-0.5 block truncate rounded-lg bg-[#2a2840] px-2.5 py-1.5">{f.v}</span>
          </div>
        ))}
      </div>
      <figcaption className="sr-only">
        Illustration: details from a sample resume ({r.name}, {job.title} at {job.company}) copied into application form fields.
      </figcaption>
    </figure>
  );
}
