import type { ResumeContent } from "@/types/resume";

export type TemplateStyle = "classic" | "modern" | "minimal" | "executive";

const DEMO_SKILLS = [
  { name: "Problem Solving", pct: 95 },
  { name: "Microsoft Office Suite", pct: 80 },
  { name: "Problem Solving", pct: 70 },
  { name: "Team Leadership", pct: 65 },
  { name: "Excellent communication skill", pct: 55 },
  { name: "70WPM Typist", pct: 50 },
];

const TEMPLATE_COLORS: Record<TemplateStyle, { accent: string; sidebarBg: string; nameFg: string }> = {
  classic: { accent: "#7C5CFC", sidebarBg: "#f9fafb", nameFg: "#7C5CFC" },
  modern: { accent: "#7C3AED", sidebarBg: "#F5F3FF", nameFg: "#7C3AED" },
  minimal: { accent: "#111827", sidebarBg: "#ffffff", nameFg: "#111827" },
  executive: { accent: "#B45309", sidebarBg: "#FFFBEB", nameFg: "#92400E" },
};

export function ResumePreview({ content, template = "classic" }: { content: ResumeContent; regionMode?: string; title?: string; template?: TemplateStyle }) {
  const name = content.contact.fullName || "Ralph Edwards";
  const headline = content.headline || "Software Engineer";
  const tc = TEMPLATE_COLORS[template];

  return (
    <div className="soha-a4 overflow-hidden bg-white text-[9px] leading-snug text-gray-800" style={{ "--accent": tc.accent } as React.CSSProperties}>
      <div className="flex h-full">
        <div className="flex-1 p-6 pr-4">
          <h1 className="text-[22px] font-bold leading-tight" style={{ color: tc.nameFg }}>{name}</h1>
          <p className="mt-0.5 text-[11px] font-medium text-gray-600">{headline}</p>

          <div className="mt-3 border-l-[3px] pl-2" style={{ borderColor: tc.accent }}>
            <h2 className="text-[10px] font-bold text-gray-900">My Self</h2>
          </div>
          <p className="mt-1.5 text-[8.5px] leading-[1.6] text-gray-600">
            {content.summary || "Six years of experience facilitating cutting-edge engineering solutions with a wide range of e-commerce application and technology skills. Proven ability to leverage full-stack expertise to build interactive and user-entered website designs to scale."}
          </p>

          {content.experience.length > 0 ? (
            <>
              <div className="mt-3 border-l-[3px] border-[var(--accent)] pl-2">
                <h2 className="text-[10px] font-bold text-gray-900">Experience</h2>
              </div>
              <div className="mt-2 space-y-2.5">
                {content.experience.map((ex) => (
                  <div key={ex.id}>
                    <div className="flex items-baseline justify-between">
                      <p className="text-[9px] font-bold text-gray-900">{ex.company || "Company"} - {ex.location || "Location"}</p>
                      <p className="text-[7.5px] text-gray-500">{ex.start} - {ex.end || "Present"}</p>
                    </div>
                    <p className="text-[8px] italic text-gray-500">{ex.role || "Role"}</p>
                    {ex.bullets.length > 0 ? (
                      <ul className="mt-1 space-y-0.5 pl-2">
                        {ex.bullets.map((b) => (
                          <li key={b.id} className="relative pl-2 text-[8px] text-gray-600 before:absolute before:left-0 before:top-[0.5em] before:h-0.5 before:w-0.5 before:rounded-full before:bg-gray-500">
                            {b.text || "Achievement bullet"}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="mt-3 border-l-[3px] border-[var(--accent)] pl-2">
                <h2 className="text-[10px] font-bold text-gray-900">Experience</h2>
              </div>
              <div className="mt-2 space-y-2.5">
                <div>
                  <div className="flex items-baseline justify-between">
                    <p className="text-[9px] font-bold text-gray-900">New Enterprise - San Josse, CA</p>
                    <p className="text-[7.5px] text-gray-500">Sept 2016 - Present</p>
                  </div>
                  <p className="text-[8px] italic text-gray-500">Senior Web Developer / Systems Architect</p>
                  <ul className="mt-1 space-y-0.5 pl-2">
                    <li className="relative pl-2 text-[8px] text-gray-600 before:absolute before:left-0 before:top-[0.5em] before:h-0.5 before:w-0.5 before:rounded-full before:bg-gray-500">Structure several internal systems comprising order entry/management tools, conversion/revenue reporting, and production workflow tracking.</li>
                    <li className="relative pl-2 text-[8px] text-gray-600 before:absolute before:left-0 before:top-[0.5em] before:h-0.5 before:w-0.5 before:rounded-full before:bg-gray-500">Successfully installed Linux servers and virtualized environments using Docker, Hyper-V, and Amazon Web Services.</li>
                  </ul>
                </div>
                <div>
                  <div className="flex items-baseline justify-between">
                    <p className="text-[9px] font-bold text-gray-900">Top Design, INK - Lake City, UT</p>
                    <p className="text-[7.5px] text-gray-500">Sept 2013 - 2016</p>
                  </div>
                  <p className="text-[8px] italic text-gray-500">Contract Software Engineer</p>
                  <ul className="mt-1 space-y-0.5 pl-2">
                    <li className="relative pl-2 text-[8px] text-gray-600 before:absolute before:left-0 before:top-[0.5em] before:h-0.5 before:w-0.5 before:rounded-full before:bg-gray-500">Successfully generated back-end programming utilizing LAMP stack; Linux, Apache with Kohana 3</li>
                  </ul>
                </div>
              </div>
            </>
          )}

          <div className="mt-3 border-l-[3px] border-[var(--accent)] pl-2">
            <h2 className="text-[10px] font-bold text-gray-900">Education</h2>
          </div>
          {content.education.length > 0 ? (
            <div className="mt-2 grid grid-cols-2 gap-2">
              {content.education.map((ed) => (
                <div key={ed.id}>
                  <p className="text-[9px] font-bold text-gray-900">{ed.degree || "Degree"}</p>
                  <p className="text-[8px] text-gray-500">{ed.school || "School"}, {ed.end || "Year"}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-2 grid grid-cols-2 gap-2">
              <div><p className="text-[9px] font-bold text-gray-900">B.A Computer Science</p><p className="text-[8px] text-gray-500">Boston University, June 2012</p></div>
              <div><p className="text-[9px] font-bold text-gray-900">Honours Computer Science</p><p className="text-[8px] text-gray-500">Boston High college, June 2012</p></div>
            </div>
          )}
        </div>

        <div className="w-[140px] shrink-0 p-4" style={{ backgroundColor: tc.sidebarBg }}>
          <div className="border-l-[3px] border-[var(--accent)] pl-2">
            <h2 className="text-[10px] font-bold text-gray-900">Contact</h2>
          </div>
          <div className="mt-2 space-y-1.5 text-[7.5px] text-gray-600">
            <p>📍 {content.contact.location || "3423 South Street, Boston, MA 02112"}</p>
            <p>📞 {content.contact.phone || "774-987-4009"}</p>
            <p>📧 {content.contact.email || "andrewblack@gmail.com"}</p>
            <p>🌐 {(content.contact.links ?? [])[0] || "uptowork.com/mycv/j.smith"}</p>
          </div>

          <div className="mt-4 border-l-[3px] border-[var(--accent)] pl-2">
            <h2 className="text-[10px] font-bold text-gray-900">Skills</h2>
          </div>
          <div className="mt-2 space-y-2">
            {(content.skills.length > 0
              ? content.skills.slice(0, 6).map((s, i) => ({ name: s, pct: Math.max(30, 95 - i * 10) }))
              : DEMO_SKILLS
            ).map((s) => (
              <div key={s.name}>
                <p className="text-[8px] font-medium text-gray-700">{s.name}</p>
                <div className="mt-0.5 h-1 w-full rounded-full bg-gray-200">
                  <div className="h-full rounded-full bg-gray-900" style={{ width: `${s.pct}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 border-l-[3px] border-[var(--accent)] pl-2">
            <h2 className="text-[10px] font-bold text-gray-900">Certification</h2>
          </div>
          <div className="mt-2 space-y-1.5 text-[8px]">
            <div><p className="font-bold text-gray-900">Best Worker Of the Institution</p><p className="text-gray-500">2017, Clarendon Smith</p></div>
            <div><p className="font-bold text-gray-900">Employee of the Month</p><p className="text-gray-500">December 2009, Didier Sachs</p></div>
          </div>

          <div className="mt-4 border-l-[3px] border-[var(--accent)] pl-2">
            <h2 className="text-[10px] font-bold text-gray-900">Awards</h2>
          </div>
          <div className="mt-2 space-y-1.5 text-[8px]">
            <div><p className="font-bold text-gray-900">Outstanding Achievement Award</p><p className="text-gray-500">2017, Clarendon Smith</p></div>
            <div><p className="font-bold text-gray-900">Best Employee of the Year</p><p className="text-gray-500">December 2009, Didier Sachs</p></div>
          </div>
        </div>
      </div>
    </div>
  );
}
