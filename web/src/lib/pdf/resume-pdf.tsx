import path from "node:path";
import { Document, Font, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { ResumeContent } from "@/types/resume";
import { TEMPLATE_SPECS, sectionTitles, type TemplateStyle } from "@/lib/resume-templates";

// The built-in PDF fonts only cover WinAnsi, so names in Cyrillic, Turkish or
// Uzbek Latin and characters like − or → came out blank or garbled. Liberation
// Sans/Serif are metric-compatible with Helvetica/Times and cover them (OFL,
// see fonts/LICENSE.txt). next.config traces this folder into the PDF route.
const FONT_DIR = path.join(process.cwd(), "src/lib/pdf/fonts");
Font.register({
  family: "ResumeSans",
  fonts: [
    { src: path.join(FONT_DIR, "LiberationSans-Regular.ttf"), fontWeight: 400 },
    { src: path.join(FONT_DIR, "LiberationSans-Bold.ttf"), fontWeight: 700 },
  ],
});
Font.register({
  family: "ResumeSerif",
  fonts: [
    { src: path.join(FONT_DIR, "LiberationSerif-Regular.ttf"), fontWeight: 400 },
    { src: path.join(FONT_DIR, "LiberationSerif-Bold.ttf"), fontWeight: 700 },
  ],
});
// Don't split words at arbitrary points across lines.
Font.registerHyphenationCallback((word) => [word]);

/** Region sets page density; the template sets typography (see resume-templates). */
const density = {
  us: { padding: 36, fontSize: 10, name: 18, headline: 11, section: 11, gap: 10 },
  eu: { padding: 48, fontSize: 11, name: 20, headline: 12, section: 12, gap: 12 },
};

export function ResumePdfDocument({
  content,
  title,
  regionMode = "us",
  template = "classic",
}: {
  content: ResumeContent;
  title: string;
  regionMode?: string;
  template?: TemplateStyle;
}) {
  const d = regionMode === "eu" ? density.eu : density.us;
  const t = TEMPLATE_SPECS[template];
  const titles = sectionTitles(regionMode);
  const font = t.serif ? "ResumeSerif" : "ResumeSans";

  const s = StyleSheet.create({
    page: { padding: d.padding, fontSize: d.fontSize, fontFamily: font, lineHeight: 1.35, color: "#1c1c1c" },
    head: { textAlign: t.centered ? "center" : "left" },
    name: { fontSize: d.name, fontWeight: 700, color: t.accent, lineHeight: 1.2, marginBottom: 4 },
    headline: { fontSize: d.headline, color: "#333", marginBottom: 5 },
    section: {
      fontSize: d.section,
      fontWeight: 700,
      color: t.accent,
      marginTop: d.gap,
      marginBottom: 4,
      paddingBottom: 1.5,
      ...(t.rule ? { borderBottomWidth: 1, borderBottomColor: t.rule } : {}),
      ...(t.upper ? { textTransform: "uppercase" as const, letterSpacing: 0.6 } : {}),
    },
    row: { marginBottom: 2 },
    strong: { fontWeight: 700 },
    meta: { color: "#555", marginBottom: 3 },
    bullet: { marginLeft: 8, marginBottom: 1.5 },
    block: { marginBottom: 6 },
  });

  const c = content;
  const contactLine = [c.contact.email, c.contact.phone, c.contact.location].filter(Boolean).join(" · ");
  const links = (c.contact.links ?? []).filter(Boolean).join(" · ");
  const certs = (c.certifications ?? []).filter((x) => x.name);
  const achievements = (c.achievements ?? []).filter((x) => x.title);

  return (
    <Document title={title}>
      <Page size="A4" style={s.page}>
        <View style={s.head}>
          <Text style={s.name}>{c.contact.fullName || "Name"}</Text>
          {c.headline ? <Text style={s.headline}>{c.headline}</Text> : null}
          {contactLine ? <Text style={s.row}>{contactLine}</Text> : null}
          {links ? <Text style={s.row}>{links}</Text> : null}
        </View>

        {c.summary ? (
          <>
            <Text style={s.section}>{titles.summary}</Text>
            <Text style={s.row}>{c.summary}</Text>
          </>
        ) : null}

        {c.experience.length > 0 ? (
          <>
            <Text style={s.section}>{titles.experience}</Text>
            {c.experience.map((ex) => (
              <View key={ex.id} wrap={false} style={s.block}>
                <Text style={s.strong}>{[ex.role, ex.company].filter(Boolean).join(" — ")}</Text>
                <Text style={s.meta}>
                  {[ex.start, ex.end].filter(Boolean).join(" – ")}
                  {ex.location ? ` · ${ex.location}` : ""}
                </Text>
                {ex.bullets
                  .filter((b) => b.text.trim())
                  .map((b) => (
                    <Text key={b.id} style={s.bullet}>
                      • {b.text}
                    </Text>
                  ))}
              </View>
            ))}
          </>
        ) : null}

        {c.education.length > 0 ? (
          <>
            <Text style={s.section}>{titles.education}</Text>
            {c.education.map((ed) => (
              <View key={ed.id} style={s.block}>
                <Text style={s.strong}>{ed.school}</Text>
                <Text style={s.meta}>
                  {[ed.degree, [ed.start, ed.end].filter(Boolean).join(" – ")].filter(Boolean).join(" · ")}
                </Text>
              </View>
            ))}
          </>
        ) : null}

        {certs.length > 0 ? (
          <>
            <Text style={s.section}>{titles.certifications}</Text>
            {certs.map((x) => (
              <Text key={x.id} style={s.row}>
                <Text style={s.strong}>{x.name}</Text>
                {[x.issuer, x.date].filter(Boolean).length ? ` · ${[x.issuer, x.date].filter(Boolean).join(", ")}` : ""}
              </Text>
            ))}
          </>
        ) : null}

        {achievements.length > 0 ? (
          <>
            <Text style={s.section}>{titles.achievements}</Text>
            {achievements.map((x) => (
              <Text key={x.id} style={s.row}>
                <Text style={s.strong}>{x.title}</Text>
                {x.date ? ` (${x.date})` : ""}
                {x.description ? ` — ${x.description}` : ""}
              </Text>
            ))}
          </>
        ) : null}

        {c.skills.length > 0 ? (
          <>
            <Text style={s.section}>{titles.skills}</Text>
            <Text>{c.skills.join(", ")}</Text>
          </>
        ) : null}
      </Page>
    </Document>
  );
}
