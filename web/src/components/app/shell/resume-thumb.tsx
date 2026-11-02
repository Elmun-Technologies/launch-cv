import type { ResumeContent } from "@/types/resume";

/** Layout width the page is drawn at before it is scaled down to `width`. */
const BASE = 600;

/**
 * v5 resume thumbnail: a white A4 sheet with the resume's own first lines
 * (name, headline, summary, two jobs, education, skills), scaled to `width`.
 * Decorative — the card around it carries the accessible name.
 */
export function ResumeThumb({ content, width }: { content: ResumeContent; width: number }) {
  // Stored JSON isn't normalized; guard every list so an odd draft can't crash the list page.
  const contact = content.contact ?? { fullName: "", email: "" };
  const experience = Array.isArray(content.experience) ? content.experience : [];
  const education = Array.isArray(content.education) ? content.education : [];
  const skills = Array.isArray(content.skills) ? content.skills : [];
  const summary = typeof content.summary === "string" ? content.summary : "";
  const headline = typeof content.headline === "string" ? content.headline : "";
  const height = Math.round(width * 1.414);
  const scale = width / BASE;
  const empty = !contact.fullName && !summary && experience.length === 0;

  if (empty) {
    return (
      <div
        aria-hidden="true"
        className="flex items-center justify-center rounded-[4px] bg-white text-[#66647c] shadow-[0_12px_24px_-14px_rgba(36,24,120,0.4)]"
        style={{ width, height, fontSize: Math.max(10, Math.round(width / 16)) }}
      >
        Empty draft
      </div>
    );
  }

  const contactLine = [contact.location, contact.email, contact.phone].filter(Boolean).join(" · ");
  const head = "mb-[7px] mt-[19px] border-b-[3px] border-[#c9c0ff] pb-1 text-[13px] font-extrabold text-[#5440e8]";
  const edu = education[0];

  return (
    <div
      aria-hidden="true"
      className="overflow-hidden rounded-[4px] bg-white shadow-[0_12px_24px_-14px_rgba(36,24,120,0.4)]"
      style={{ width, height }}
    >
      <div
        className="origin-top-left px-[44px] py-[48px] text-[12.3px] leading-[18.6px] text-[#1c1c28]"
        style={{ width: BASE, transform: `scale(${scale})` }}
      >
        <p className="text-[27px] font-extrabold leading-[31px] tracking-[-0.01em] text-[#5440e8]">{contact.fullName || "Your name"}</p>
        {headline ? <p className="mt-[3px] font-semibold">{headline}</p> : null}
        {contactLine ? <p className="mt-[2px] text-[#66647c]">{contactLine}</p> : null}
        {summary ? (
          <>
            <p className={head}>Summary</p>
            <p>{summary.slice(0, 260)}</p>
          </>
        ) : null}
        {experience.length > 0 ? (
          <>
            <p className={head}>Experience</p>
            {experience.slice(0, 2).map((x, i) => (
              <div key={x.id || i} className="mt-[6px]">
                <p className="flex justify-between gap-6">
                  <b>{[x.role, x.company].filter(Boolean).join(", ")}</b>
                  <span className="whitespace-nowrap text-[#66647c]">{[x.start, x.end].filter(Boolean).join(" – ")}</span>
                </p>
                {(x.bullets ?? []).slice(0, 3).map((b, j) => (
                  <p key={b.id || j} className="mt-[2px] pl-[13px] -indent-[10px]">
                    •&nbsp;{b.text}
                  </p>
                ))}
              </div>
            ))}
          </>
        ) : null}
        {edu ? (
          <>
            <p className={head}>Education</p>
            <p>{[edu.degree, edu.school, edu.end].filter(Boolean).join(", ")}</p>
          </>
        ) : null}
        {skills.length > 0 ? (
          <>
            <p className={head}>Skills</p>
            <p>{skills.slice(0, 10).join(" · ")}</p>
          </>
        ) : null}
      </div>
    </div>
  );
}
