/**
 * Branded, email-client-safe layout for everything we send: tables and inline
 * styles only (Gmail strips <style>), no images (many clients block them), and a
 * plain-text version. Colors follow the site (v5): ink #121226, violet #5440E8.
 */
const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export type EmailRow = { label: string; value: string; note?: string; tone?: "good" | "bad" | "neutral" };
export type EmailSection = { title: string; rows: EmailRow[]; /** Shown when there are no rows. */ empty?: string };

/** A personal discount shown as a coupon. Plain text, escaped here. */
export type EmailOffer = {
  /** Small caps line above the amount, e.g. "Your welcome offer". */
  label: string;
  /** The big line, e.g. "20% off". */
  headline: string;
  /** Under the headline, e.g. "Any plan · one use · just for you". */
  sub: string;
  code: string;
  /** e.g. "Ends Tuesday, November 10 at 3:07 PM EST". */
  expires: string;
};

const C = {
  page: "#F1EFFA",
  card: "#FFFFFF",
  line: "#E6E3F2",
  ink: "#121226",
  body: "#4A4862",
  muted: "#77758C",
  violet: "#5440E8",
  violetSoft: "#EEEBFF",
  lilac: "#B9B0FF",
  good: "#0B7A4F",
  bad: "#B42318",
} as const;
const TONE = { good: C.good, bad: C.bad, neutral: C.muted } as const;
const FONT = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";
const MONO = "'SFMono-Regular',Menlo,Consolas,'Liberation Mono',monospace";

function sectionHtml(s: EmailSection): string {
  const cell = `padding:8px 0;border-top:1px solid ${C.line};font-size:14px;line-height:1.4;vertical-align:top;`;
  const rows = s.rows.length
    ? s.rows
        .map((r) =>
          !r.value && !r.note
            ? `<tr><td colspan="3" style="${cell}color:${C.body};">${esc(r.label)}</td></tr>`
            : // Fixed widths for the number columns keep them aligned across sections.
              `<tr><td style="${cell}color:${C.body};">${esc(r.label)}</td><td align="right" width="84" style="${cell}width:84px;padding-left:12px;font-weight:700;color:${C.ink};white-space:nowrap;">${esc(r.value)}</td><td align="right" width="150" style="${cell}width:150px;padding-left:12px;font-size:12px;color:${TONE[r.tone ?? "neutral"]};">${esc(r.note ?? "")}</td></tr>`,
        )
        .join("")
    : `<tr><td colspan="3" style="${cell}color:${C.muted};">${esc(s.empty ?? "Nothing to show.")}</td></tr>`;
  return `<h2 style="margin:24px 0 6px;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;font-weight:800;color:${C.violet};">${esc(s.title)}</h2>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows}</table>`;
}

function offerHtml(o: EmailOffer): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:8px 0 6px;"><tr><td align="center" bgcolor="${C.ink}" style="background:${C.ink};border-radius:18px;padding:26px 20px 24px;">
<p style="margin:0 0 6px;font-size:12px;letter-spacing:0.14em;text-transform:uppercase;font-weight:800;color:${C.lilac};">${esc(o.label)}</p>
<p style="margin:0;font-size:44px;line-height:1.05;font-weight:800;letter-spacing:-0.02em;color:#FFFFFF;">${esc(o.headline)}</p>
<p style="margin:8px 0 18px;font-size:14px;line-height:1.5;color:#D9D5F5;">${esc(o.sub)}</p>
<table role="presentation" cellpadding="0" cellspacing="0" align="center"><tr><td style="border:2px dashed ${C.lilac};border-radius:12px;padding:12px 22px;">
<span style="font-family:${MONO};font-size:22px;font-weight:700;letter-spacing:0.14em;color:#FFFFFF;">${esc(o.code)}</span>
</td></tr></table>
<p style="margin:14px 0 0;font-size:13px;line-height:1.5;color:${C.lilac};">⏳ ${esc(o.expires)}</p>
</td></tr></table>`;
}

function bulletsHtml(items: string[]): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:6px 0 4px;">${items
    .map(
      (b) =>
        `<tr><td width="30" valign="top" style="width:30px;padding:5px 0;"><span style="display:inline-block;width:20px;height:20px;line-height:20px;border-radius:10px;background:${C.violetSoft};color:${C.violet};font-size:12px;font-weight:800;text-align:center;">✓</span></td><td style="padding:5px 0;font-size:15px;line-height:1.5;color:${C.body};">${esc(b)}</td></tr>`,
    )
    .join("")}</table>`;
}

export function transactionalEmail(args: {
  preheader: string;
  /** Optional small pill above the heading, e.g. "Welcome" or "Ends in 48 hours". */
  eyebrow?: string;
  heading: string;
  paragraphs: string[];
  /** Optional personal discount, shown as a coupon after the paragraphs. */
  offer?: EmailOffer;
  /** Optional checklist after the offer (what you get). */
  bullets?: string[];
  cta: { label: string; url: string };
  /** Optional line after the button, e.g. a sign-off or a P.S. */
  after?: string[];
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
  /** Site address for the footer links; defaults to https://launch-cv.com. */
  siteUrl?: string;
}): { html: string; text: string } {
  const { preheader, eyebrow, heading, paragraphs, offer, bullets = [], cta, after = [], footnote, footer, sections = [] } = args;
  const site = (args.siteUrl ?? "https://launch-cv.com").replace(/\/$/, "");
  const link = (href: string, label: string) => `<a href="${esc(href)}" style="color:${C.muted};text-decoration:underline;">${esc(label)}</a>`;
  const footerHtml = footer
    ? `<tr><td align="center" style="padding:10px 12px 0;font-family:${FONT};font-size:12px;line-height:1.6;color:${C.muted};">${footer.lines.map(esc).join("<br>")}${
        footer.unsubscribeUrl ? `<br>${link(footer.unsubscribeUrl, "Unsubscribe from offers")}` : ""
      }</td></tr>\n`
    : "";
  const p = (s: string) => `<p style="margin:0 0 14px;font-size:16px;line-height:1.65;color:${C.body};">${esc(s)}</p>`;
  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><meta name="supported-color-schemes" content="light"><title>${esc(heading)}</title></head>
<body style="margin:0;padding:0;background:${C.page};-webkit-text-size-adjust:100%;">
<span style="display:none;max-height:0;overflow:hidden;opacity:0;color:${C.page};">${esc(preheader)}&#8199;&#847;&#8199;&#847;&#8199;&#847;&#8199;&#847;&#8199;&#847;&#8199;&#847;</span>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="${C.page}" style="background:${C.page};">
<tr><td align="center" style="padding:32px 14px 40px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">
<tr><td style="padding:0 6px 18px;font-family:${FONT};">
<table role="presentation" cellpadding="0" cellspacing="0"><tr>
<td width="32" height="32" align="center" bgcolor="${C.violet}" style="width:32px;height:32px;background:${C.violet};border-radius:9px;font-size:17px;font-weight:800;color:#FFFFFF;line-height:32px;">L</td>
<td style="padding-left:10px;font-size:20px;font-weight:800;letter-spacing:-0.02em;color:${C.ink};">launch<span style="color:${C.violet};">cv</span></td>
</tr></table>
</td></tr>
<tr><td bgcolor="${C.card}" style="background:${C.card};border:1px solid ${C.line};border-radius:22px;overflow:hidden;font-family:${FONT};">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td height="6" bgcolor="${C.violet}" style="border-radius:22px 22px 0 0;height:6px;line-height:6px;font-size:0;background:${C.violet};background-image:linear-gradient(90deg,${C.violet},#8B7CFF,#FF9F7A);">&nbsp;</td></tr></table>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td style="padding:34px 32px 32px;">
${eyebrow ? `<p style="margin:0 0 14px;"><span style="display:inline-block;padding:5px 12px;border-radius:999px;background:${C.violetSoft};color:${C.violet};font-size:12px;font-weight:800;letter-spacing:0.06em;text-transform:uppercase;">${esc(eyebrow)}</span></p>` : ""}
<h1 style="margin:0 0 16px;font-size:28px;line-height:1.2;font-weight:800;letter-spacing:-0.02em;color:${C.ink};">${esc(heading)}</h1>
${paragraphs.map(p).join("\n")}
${offer ? offerHtml(offer) : ""}
${bullets.length ? bulletsHtml(bullets) : ""}
${sections.map(sectionHtml).join("\n")}
<table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px 0 6px;"><tr><td bgcolor="${C.violet}" style="border-radius:14px;background:${C.violet};">
<a href="${esc(cta.url)}" style="display:inline-block;padding:15px 30px;font-size:16px;font-weight:700;color:#FFFFFF;text-decoration:none;border-radius:14px;">${esc(cta.label)} &rarr;</a>
</td></tr></table>
${after.map((s) => `<p style="margin:16px 0 0;font-size:15px;line-height:1.6;color:${C.body};">${esc(s)}</p>`).join("\n")}
<p style="margin:22px 0 0;padding-top:16px;border-top:1px solid ${C.line};font-size:12px;line-height:1.6;color:${C.muted};">Button not working? Paste this link into your browser:<br><a href="${esc(cta.url)}" style="color:${C.violet};word-break:break-all;">${esc(cta.url)}</a></p>
</td></tr></table>
</td></tr>
<tr><td align="center" style="padding:18px 12px 0;font-family:${FONT};font-size:12px;line-height:1.6;color:${C.muted};">${esc(footnote)} Questions? Write to <a href="mailto:support@launch-cv.com" style="color:${C.muted};">support@launch-cv.com</a>.</td></tr>
<tr><td align="center" style="padding:10px 12px 0;font-family:${FONT};font-size:12px;line-height:1.6;color:${C.muted};">${link(`${site}/free-ats-check`, "Free ATS check")} &nbsp;·&nbsp; ${link(`${site}/resume-templates`, "Templates")} &nbsp;·&nbsp; ${link(`${site}/pricing`, "Pricing")}</td></tr>
${footerHtml}</table>
</td></tr></table>
</body></html>`;
  const text = [
    heading,
    "",
    ...paragraphs.flatMap((s) => [s, ""]),
    ...(offer ? [`${offer.label.toUpperCase()}: ${offer.headline}`, offer.sub, `Code: ${offer.code}`, offer.expires, ""] : []),
    ...(bullets.length ? [...bullets.map((b) => `- ${b}`), ""] : []),
    ...sections.flatMap((s) => [
      s.title.toUpperCase(),
      ...(s.rows.length ? s.rows.map((r) => `- ${r.label}: ${r.value}${r.note ? ` (${r.note})` : ""}`) : [s.empty ?? "Nothing to show."]),
      "",
    ]),
    `${cta.label}: ${cta.url}`,
    ...after.flatMap((s) => ["", s]),
    "",
    footnote,
    "Questions? Write to support@launch-cv.com.",
    ...(footer ? ["", ...footer.lines, ...(footer.unsubscribeUrl ? [`Unsubscribe from offers: ${footer.unsubscribeUrl}`] : [])] : []),
  ].join("\n");
  return { html, text };
}
