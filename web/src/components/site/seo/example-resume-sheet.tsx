import { ResumePreview } from "@/components/resume-preview";
import type { TemplateStyle } from "@/lib/resume-templates";
import type { ResumeContent } from "@/types/resume";

const headingCls = "mb-[5px] mt-3 border-b border-[#1c1c28] pb-0.5 text-[9px] font-extrabold uppercase tracking-[0.1em]";

/**
 * A resume example as plain responsive text for phones (the Example-mobile
 * canvas): a scaled letter page at 360px wide shrinks the type to 4–5px.
 * Same data as the paper preview, so the two never drift.
 */
export function ExampleResumeText({ content: c }: { content: ResumeContent }) {
  const contact = [c.contact.location, c.contact.email, c.contact.phone, ...(c.contact.links ?? [])].filter(Boolean).join(" · ");
  const certs = (c.certifications ?? []).filter((x) => x.name);
  const education = c.education
    .map((ed) => [ed.degree, ed.school, ed.end].filter(Boolean).join(", "))
    .concat(certs.map((x) => x.name))
    .filter(Boolean);

  return (
    <div className="rounded-md bg-white px-[18px] py-5 text-[11px] leading-4 text-[#1c1c28]">
      <p className="text-[18px] font-extrabold leading-[22px]">{c.contact.fullName}</p>
      {c.headline ? <p className="mt-0.5 font-semibold">{c.headline}</p> : null}
      {contact ? <p className="mt-px text-[#66647c]">{contact}</p> : null}

      {c.summary ? (
        <>
          <p className={headingCls}>Summary</p>
          <p>{c.summary}</p>
        </>
      ) : null}

      {c.experience.length ? (
        <>
          <p className={headingCls}>Experience</p>
          {c.experience.map((ex) => (
            <div key={ex.id} className="mt-1.5 first-of-type:mt-0">
              <p>
                <b>{ex.role}</b>
                {ex.company ? `, ${ex.company}` : ""}
                <span className="text-[#66647c]"> · {[ex.start, ex.end].filter(Boolean).join(" – ")}</span>
              </p>
              <ul>
                {ex.bullets
                  .filter((b) => b.text.trim())
                  .map((b) => (
                    <li key={b.id} className="mt-0.5 pl-[9px] -indent-[7px]">
                      • {b.text}
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </>
      ) : null}

      {education.length ? (
        <>
          <p className={headingCls}>{certs.length ? "Education & certifications" : "Education"}</p>
          <p>{education.join(" · ")}</p>
        </>
      ) : null}

      {c.skills.length ? (
        <>
          <p className={headingCls}>Skills</p>
          <p>{c.skills.join(" · ")}</p>
        </>
      ) : null}
    </div>
  );
}

/** Readable text below `sm`, the paper preview (cropped to its content by default) from `sm` up. */
export function ExampleResumeSheet({
  content,
  template = "classic",
  fit = "content",
}: {
  content: ResumeContent;
  template?: TemplateStyle;
  /** "page" keeps the full letter page, e.g. where the page length is the point. */
  fit?: "page" | "content";
}) {
  return (
    <>
      <div className="sm:hidden">
        <ExampleResumeText content={content} />
      </div>
      <div className="hidden sm:block">
        <ResumePreview content={content} template={template} fit={fit} />
      </div>
    </>
  );
}
