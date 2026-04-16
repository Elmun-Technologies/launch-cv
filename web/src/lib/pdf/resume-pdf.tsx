import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { ResumeContent } from "@/types/resume";

const us = StyleSheet.create({
  page: { padding: 36, fontSize: 10, fontFamily: "Helvetica" },
  name: { fontSize: 18, marginBottom: 4, fontFamily: "Helvetica-Bold" },
  headline: { fontSize: 11, marginBottom: 8, color: "#333" },
  sectionTitle: {
    fontSize: 11,
    marginTop: 10,
    marginBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    fontFamily: "Helvetica-Bold",
  },
  row: { marginBottom: 2 },
  company: { fontFamily: "Helvetica-Bold" },
  meta: { color: "#555", marginBottom: 4 },
  bullet: { marginLeft: 8, marginBottom: 2 },
  skills: { lineHeight: 1.4 },
});

const eu = StyleSheet.create({
  page: { padding: 48, fontSize: 11, fontFamily: "Helvetica" },
  name: { fontSize: 20, marginBottom: 6, fontFamily: "Helvetica-Bold" },
  headline: { fontSize: 12, marginBottom: 10, color: "#222" },
  sectionTitle: {
    fontSize: 12,
    marginTop: 12,
    marginBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#999",
    fontFamily: "Helvetica-Bold",
  },
  row: { marginBottom: 3 },
  company: { fontFamily: "Helvetica-Bold" },
  meta: { color: "#444", marginBottom: 5 },
  bullet: { marginLeft: 10, marginBottom: 3 },
  skills: { lineHeight: 1.5 },
});

export function ResumePdfDocument({
  content,
  title,
  regionMode = "us",
}: {
  content: ResumeContent;
  title: string;
  regionMode?: string;
}) {
  const styles = regionMode === "eu" ? eu : us;
  const isEu = regionMode === "eu";
  const links = content.contact.links?.filter(Boolean).join(" · ");
  const sumTitle = isEu ? "Professional summary" : "Summary";
  const expTitle = isEu ? "Work experience" : "Experience";
  const eduTitle = isEu ? "Education and training" : "Education";

  return (
    <Document title={title}>
      <Page size="A4" style={styles.page}>
        <Text style={styles.name}>{content.contact.fullName || "Name"}</Text>
        <Text style={styles.headline}>{content.headline}</Text>
        {isEu ? (
          <Text style={{ fontSize: 8, color: "#666", marginBottom: 6 }}>Curriculum vitae — {title}</Text>
        ) : null}
        <View style={styles.row}>
          <Text>
            {[content.contact.email, content.contact.phone, content.contact.location].filter(Boolean).join(" · ")}
          </Text>
        </View>
        {links ? (
          <View style={styles.row}>
            <Text>{links}</Text>
          </View>
        ) : null}

        {content.summary ? (
          <>
            <Text style={styles.sectionTitle}>{sumTitle}</Text>
            <Text style={styles.row}>{content.summary}</Text>
          </>
        ) : null}

        {content.experience.length > 0 ? (
          <>
            <Text style={styles.sectionTitle}>{expTitle}</Text>
            {content.experience.map((ex) => (
              <View key={ex.id} wrap={false}>
                <Text style={styles.company}>
                  {ex.role} — {ex.company}
                </Text>
                <Text style={styles.meta}>
                  {ex.start} – {ex.end}
                  {ex.location ? ` · ${ex.location}` : ""}
                </Text>
                {ex.bullets.map((b) => (
                  <Text key={b.id} style={styles.bullet}>
                    • {b.text}
                  </Text>
                ))}
              </View>
            ))}
          </>
        ) : null}

        {content.education.length > 0 ? (
          <>
            <Text style={styles.sectionTitle}>{eduTitle}</Text>
            {content.education.map((ed) => (
              <View key={ed.id} style={{ marginBottom: 6 }}>
                <Text style={styles.company}>{ed.school}</Text>
                <Text style={styles.meta}>
                  {ed.degree} · {ed.start} – {ed.end}
                </Text>
              </View>
            ))}
          </>
        ) : null}

        {content.skills.length > 0 ? (
          <>
            <Text style={styles.sectionTitle}>Skills</Text>
            <Text style={styles.skills}>{content.skills.join(", ")}</Text>
          </>
        ) : null}
      </Page>
    </Document>
  );
}
