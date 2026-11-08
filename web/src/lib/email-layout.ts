/**
 * Plain, email-client-safe layout for transactional mail: tables and inline styles only,
 * no images (many clients block them), plus a text version for clients that prefer it.
 */
const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export type EmailRow = { label: string; value: string; note?: string; tone?: "good" | "bad" | "neutral" };
export type EmailSection = { title: string; rows: EmailRow[]; /** Shown when there are no rows. */ empty?: string };

const TONE = { good: "#0B7A4F", bad: "#B42318", neutral: "#6B6B6B" } as const;

function sectionHtml(s: EmailSection): string {
  const cell = "padding:7px 0;border-top:1px solid #EEEEEB;font-size:14px;line-height:1.4;vertical-align:top;";
  const rows = s.rows.length
    ? s.rows
        .map((r) =>
          !r.value && !r.note
            ? `<tr><td colspan="3" style="${cell}color:#3F3F3F;">${esc(r.label)}</td></tr>`
            : // Fixed widths for the number columns keep them aligned across sections.
              `<tr><td style="${cell}color:#3F3F3F;">${esc(r.label)}</td><td align="right" width="84" style="${cell}width:84px;padding-left:12px;font-weight:600;color:#111111;white-space:nowrap;">${esc(r.value)}</td><td align="right" width="150" style="${cell}width:150px;padding-left:12px;font-size:12px;color:${TONE[r.tone ?? "neutral"]};">${esc(r.note ?? "")}</td></tr>`,
        )
        .join("")
    : `<tr><td colspan="3" style="${cell}color:#6B6B6B;">${esc(s.empty ?? "Nothing to show.")}</td></tr>`;
  return `<h2 style="margin:22px 0 4px;font-size:12px;letter-spacing:0.06em;text-transform:uppercase;font-weight:700;color:#6B6B6B;">${esc(s.title)}</h2>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows}</table>`;
}

export function transactionalEmail(args: {
  preheader: string;
  heading: string;
  paragraphs: string[];
  cta: { label: string; url: string };
  footnote: string;
  /**
   * Optional lines under the footnote (marketing mail: why you got it, the
   * sender and postal address) and an unsubscribe link. Plain text, escaped here.
   */
  footer?: { lines: string[]; unsubscribeUrl?: string };
  /**
   * Optional tables between the paragraphs and the button (reports): a title,
   * then rows of label · value · note. Plain text, escaped here. `tone` colors
   * the note (green good, red bad, grey neutral).
   */
  sections?: EmailSection[];
}): { html: string; text: string } {
  const { preheader, heading, paragraphs, cta, footnote, footer, sections = [] } = args;
  const footerHtml = footer
    ? `<tr><td style="padding:10px 4px 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:12px;line-height:1.6;color:#6B6B6B;">${footer.lines.map(esc).join("<br>")}${
        footer.unsubscribeUrl ? `<br><a href="${esc(footer.unsubscribeUrl)}" style="color:#6B6B6B;text-decoration:underline;">Unsubscribe</a>` : ""
      }</td></tr>\n`
    : "";
  const font = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";
  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(heading)}</title></head>
<body style="margin:0;padding:0;background:#F5F5F3;">
<span style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(preheader)}</span>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F5F5F3;">
<tr><td align="center" style="padding:32px 16px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;">
<tr><td style="padding:0 4px 16px;font-family:${font};font-size:18px;font-weight:700;color:#111111;">launch<span style="color:#2563EB;">cv</span></td></tr>
<tr><td style="background:#FFFFFF;border:1px solid #E5E5E2;border-radius:14px;padding:32px 28px;font-family:${font};">
<h1 style="margin:0 0 16px;font-size:22px;line-height:1.3;font-weight:600;color:#111111;">${esc(heading)}</h1>
${paragraphs.map((p) => `<p style="margin:0 0 14px;font-size:15px;line-height:1.6;color:#3F3F3F;">${esc(p)}</p>`).join("\n")}
${sections.map(sectionHtml).join("\n")}
<table role="presentation" cellpadding="0" cellspacing="0" style="margin:22px 0 8px;"><tr><td style="border-radius:999px;background:#2563EB;">
<a href="${esc(cta.url)}" style="display:inline-block;padding:12px 22px;font-size:15px;font-weight:600;color:#FFFFFF;text-decoration:none;border-radius:999px;">${esc(cta.label)}</a>
</td></tr></table>
<p style="margin:18px 0 0;font-size:13px;line-height:1.6;color:#6B6B6B;">Button not working? Paste this link into your browser:<br><a href="${esc(cta.url)}" style="color:#1D4ED8;word-break:break-all;">${esc(cta.url)}</a></p>
</td></tr>
<tr><td style="padding:16px 4px 0;font-family:${font};font-size:12px;line-height:1.6;color:#6B6B6B;">${esc(footnote)} Questions? Write to support@launch-cv.com.</td></tr>
${footerHtml}</table>
</td></tr></table>
</body></html>`;
  const text = [
    heading,
    "",
    ...paragraphs.flatMap((p) => [p, ""]),
    ...sections.flatMap((s) => [
      s.title.toUpperCase(),
      ...(s.rows.length ? s.rows.map((r) => `- ${r.label}: ${r.value}${r.note ? ` (${r.note})` : ""}`) : [s.empty ?? "Nothing to show."]),
      "",
    ]),
    `${cta.label}: ${cta.url}`,
    "",
    footnote,
    "Questions? Write to support@launch-cv.com.",
    ...(footer ? ["", ...footer.lines, ...(footer.unsubscribeUrl ? [`Unsubscribe: ${footer.unsubscribeUrl}`] : [])] : []),
  ].join("\n");
  return { html, text };
}
