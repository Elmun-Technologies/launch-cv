import type { ResumeContent } from "@/types/resume";
import { TEMPLATE_SPECS, sectionTitles, type TemplateStyle } from "@/lib/resume-templates";

export type { TemplateStyle } from "@/lib/resume-templates";

/**
 * On-screen twin of the exported PDF (lib/pdf/resume-pdf.tsx): same sections,
 * same order, only the user's own content. Sizes are in em against a base that
 * scales with the container, so the page keeps A4 proportions at any width.
 */
export function ResumePreview({
  content,
  regionMode,
  template = "classic",
}: {
  content: ResumeContent;
  regionMode?: string;
  title?: string;
  template?: TemplateStyle;
}) {
  const t = TEMPLATE_SPECS[template];
  const titles = sectionTitles(regionMode);
  const c = content;
  const contactLine = [c.contact.email, c.contact.phone, c.contact.location].filter(Boolean).join(" · ");
  const links = (c.contact.links ?? []).filter(Boolean).join(" · ");
  const certs = (c.certifications ?? []).filter((x) => x.name);
  const achievements = (c.achievements ?? []).filter((x) => x.title);
  const empty = !c.contact.fullName && !c.summary && c.experience.length === 0 && c.education.length === 0 && c.skills.length === 0;

  const heading = (text: string) => (
    <p
      className="mb-[0.4em] mt-[1.1em] pb-[0.15em] font-bold"
      style={{
        color: t.accent,
        fontSize: "1.1em",
        letterSpacing: t.upper ? "0.06em" : undefined,
        textTransform: t.upper ? "uppercase" : undefined,
        borderBottom: t.rule ? `1px solid ${t.rule}` : undefined,
      }}
    >
      {text}
    </p>
  );

  return (
    <div className="w-full [container-type:inline-size]">
      <div
        className="aspect-[210/297] w-full overflow-hidden rounded-[3px] bg-white text-[#1c1c1c] shadow-[0_10px_30px_-14px_rgba(0,0,0,0.25)]"
        style={{
          fontSize: "calc(100cqw * 10 / 595)",
          lineHeight: 1.35,
          padding: "3.6em",
          fontFamily: t.serif ? "Georgia, 'Times New Roman', serif" : "Helvetica, Arial, sans-serif",
        }}
      >
        {empty ? (
          <div className="flex h-full items-center justify-center text-center text-[1.3em] text-[#6E6E6A]">
            Your resume appears here as you fill it in.
          </div>
        ) : (
          <>
            <div style={{ textAlign: t.centered ? "center" : undefined }}>
              <p className="font-bold" style={{ fontSize: "1.8em", color: t.accent, lineHeight: 1.15 }}>
                {c.contact.fullName || "Your name"}
              </p>
              {c.headline ? (
                <p className="mt-[0.3em]" style={{ fontSize: "1.1em", color: "#333" }}>
                  {c.headline}
                </p>
              ) : null}
              {contactLine ? <p className="mt-[0.5em]">{contactLine}</p> : null}
              {links ? <p className="mt-[0.15em]">{links}</p> : null}
            </div>

            {c.summary ? (
              <>
                {heading(titles.summary)}
                <p>{c.summary}</p>
              </>
            ) : null}

            {c.experience.length > 0 ? (
              <>
                {heading(titles.experience)}
                {c.experience.map((ex) => (
                  <div key={ex.id} className="mb-[0.6em]">
                    <p className="font-bold">{[ex.role, ex.company].filter(Boolean).join(" — ")}</p>
                    <p className="mb-[0.3em]" style={{ color: "#555" }}>
                      {[ex.start, ex.end].filter(Boolean).join(" – ")}
                      {ex.location ? ` · ${ex.location}` : ""}
                    </p>
                    {ex.bullets
                      .filter((b) => b.text.trim())
                      .map((b) => (
                        <p key={b.id} className="mb-[0.15em] pl-[0.8em]">
                          • {b.text}
                        </p>
                      ))}
                  </div>
                ))}
              </>
            ) : null}

            {c.education.length > 0 ? (
              <>
                {heading(titles.education)}
                {c.education.map((ed) => (
                  <div key={ed.id} className="mb-[0.6em]">
                    <p className="font-bold">{ed.school}</p>
                    <p style={{ color: "#555" }}>
                      {[ed.degree, [ed.start, ed.end].filter(Boolean).join(" – ")].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                ))}
              </>
            ) : null}

            {certs.length > 0 ? (
              <>
                {heading(titles.certifications)}
                {certs.map((x) => (
                  <p key={x.id} className="mb-[0.2em]">
                    <span className="font-bold">{x.name}</span>
                    {[x.issuer, x.date].filter(Boolean).length ? ` · ${[x.issuer, x.date].filter(Boolean).join(", ")}` : ""}
                  </p>
                ))}
              </>
            ) : null}

            {achievements.length > 0 ? (
              <>
                {heading(titles.achievements)}
                {achievements.map((x) => (
                  <p key={x.id} className="mb-[0.2em]">
                    <span className="font-bold">{x.title}</span>
                    {x.date ? ` (${x.date})` : ""}
                    {x.description ? ` — ${x.description}` : ""}
                  </p>
                ))}
              </>
            ) : null}

            {c.skills.length > 0 ? (
              <>
                {heading(titles.skills)}
                <p>{c.skills.join(", ")}</p>
              </>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}
