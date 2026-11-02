import { AlignmentType, BorderStyle, Document, LevelFormat, Packer, Paragraph, TextRun } from "docx";
import type { ResumeContent } from "@/types/resume";
import { pageSizeFor, sectionTitles } from "@/lib/resume-templates";

/**
 * Word export of a resume. One column, real headings, real bullet lists and
 * no tables or text boxes, so applicant tracking systems that ask for .docx
 * read it the same way they read the PDF. Same sections and order as the PDF.
 */

const FONT = "Calibri";
const TWIP_PER_PT = 20;
const MARGIN = 0.7 * 72 * TWIP_PER_PT; // 0.7 in

const text = (t: string, opts: { bold?: boolean; size?: number; color?: string } = {}) =>
  new TextRun({ text: t, font: FONT, bold: opts.bold, size: opts.size ?? 21, color: opts.color });

function heading(title: string) {
  return new Paragraph({
    spacing: { before: 200, after: 80 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: "222222", space: 2 } },
    children: [new TextRun({ text: title.toUpperCase(), font: FONT, bold: true, size: 21, characterSpacing: 10 })],
  });
}

const line = (children: TextRun[], after = 40) => new Paragraph({ spacing: { after }, children });
const bullet = (t: string) => new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 30 }, children: [text(t)] });
const join = (parts: (string | undefined)[], sep: string) => parts.filter((p) => p && p.trim()).join(sep);

export async function resumeDocxBuffer(c: ResumeContent, opts: { title: string; regionMode?: string }): Promise<Buffer> {
  const titles = sectionTitles(opts.regionMode);
  const page = pageSizeFor(opts.regionMode);
  const body: Paragraph[] = [];

  body.push(new Paragraph({ spacing: { after: 40 }, children: [text(c.contact.fullName || "Name", { bold: true, size: 36 })] }));
  if (c.headline) body.push(line([text(c.headline, { size: 23 })]));
  const contact = join([c.contact.email, c.contact.phone, c.contact.location], " · ");
  if (contact) body.push(line([text(contact)]));
  const links = join(c.contact.links ?? [], " · ");
  if (links) body.push(line([text(links)]));

  if (c.summary) {
    body.push(heading(titles.summary));
    body.push(line([text(c.summary)], 60));
  }

  if (c.experience.length > 0) {
    body.push(heading(titles.experience));
    for (const ex of c.experience) {
      body.push(line([text(join([ex.role, ex.company], " — "), { bold: true })], 0));
      const meta = join([join([ex.start, ex.end], " – "), ex.location], " · ");
      if (meta) body.push(line([text(meta, { color: "555555" })], 40));
      for (const b of ex.bullets) if (b.text.trim()) body.push(bullet(b.text.trim()));
      body.push(new Paragraph({ spacing: { after: 60 }, children: [] }));
    }
  }

  if (c.education.length > 0) {
    body.push(heading(titles.education));
    for (const ed of c.education) {
      body.push(line([text(ed.school, { bold: true })], 0));
      const meta = join([ed.degree, join([ed.start, ed.end], " – "), ed.gpa ? `GPA ${ed.gpa}` : undefined], " · ");
      if (meta) body.push(line([text(meta, { color: "555555" })], 60));
      for (const a of ed.achievements ?? []) if (a.trim()) body.push(bullet(a.trim()));
    }
  }

  const certs = (c.certifications ?? []).filter((x) => x.name);
  if (certs.length > 0) {
    body.push(heading(titles.certifications));
    for (const x of certs) {
      const rest = join([x.issuer, x.date], ", ");
      body.push(line([text(x.name, { bold: true }), ...(rest ? [text(` · ${rest}`)] : [])]));
    }
  }

  const achievements = (c.achievements ?? []).filter((x) => x.title);
  if (achievements.length > 0) {
    body.push(heading(titles.achievements));
    for (const x of achievements) {
      body.push(
        line([
          text(x.title, { bold: true }),
          ...(x.date ? [text(` (${x.date})`)] : []),
          ...(x.description ? [text(` — ${x.description}`)] : []),
        ]),
      );
    }
  }

  if (c.skills.length > 0) {
    body.push(heading(titles.skills));
    body.push(line([text(c.skills.join(", "))]));
  }

  const doc = new Document({
    title: opts.title,
    creator: c.contact.fullName || undefined,
    styles: { default: { document: { run: { font: FONT, size: 21 } } } },
    numbering: {
      config: [
        {
          reference: "bullets",
          levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 360, hanging: 220 } } } }],
        },
      ],
    },
    sections: [
      {
        properties: {
          page: {
            size: { width: page.width * TWIP_PER_PT, height: page.height * TWIP_PER_PT },
            margin: { top: MARGIN, bottom: MARGIN, left: MARGIN, right: MARGIN },
          },
        },
        children: body,
      },
    ],
  });
  return Packer.toBuffer(doc);
}

/**
 * Word file for a cover letter: the resume's contact header (so the pair looks
 * like a set), today's date, then the letter as written, one paragraph per block.
 */
export async function coverLetterDocxBuffer(
  c: ResumeContent,
  letter: string,
  opts: { regionMode?: string; date?: Date },
): Promise<Buffer> {
  const page = pageSizeFor(opts.regionMode);
  const body: Paragraph[] = [];
  body.push(new Paragraph({ spacing: { after: 40 }, children: [text(c.contact.fullName || "Name", { bold: true, size: 32 })] }));
  const contact = join([c.contact.email, c.contact.phone, c.contact.location], " · ");
  if (contact) body.push(line([text(contact)]));
  const links = join(c.contact.links ?? [], " · ");
  if (links) body.push(line([text(links)]));
  const date = (opts.date ?? new Date()).toLocaleDateString(opts.regionMode === "eu" ? "en-GB" : "en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  body.push(new Paragraph({ spacing: { before: 280, after: 240 }, children: [text(date)] }));
  for (const block of letter.replace(/\r\n/g, "\n").split(/\n\s*\n/)) {
    const lines = block.split("\n").map((l) => l.trimEnd()).filter((l) => l.trim());
    if (!lines.length) continue;
    const runs: TextRun[] = [];
    lines.forEach((l, i) => runs.push(new TextRun({ text: l, font: FONT, size: 22, break: i > 0 ? 1 : undefined })));
    body.push(new Paragraph({ spacing: { after: 200, line: 300 }, children: runs }));
  }
  const doc = new Document({
    creator: c.contact.fullName || undefined,
    title: "Cover letter",
    styles: { default: { document: { run: { font: FONT, size: 22 } } } },
    sections: [
      {
        properties: {
          page: {
            size: { width: page.width * TWIP_PER_PT, height: page.height * TWIP_PER_PT },
            margin: { top: MARGIN * 1.3, bottom: MARGIN, left: MARGIN * 1.3, right: MARGIN * 1.3 },
          },
        },
        children: body,
      },
    ],
  });
  return Packer.toBuffer(doc);
}
