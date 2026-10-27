/**
 * Plain, email-client-safe layout for transactional mail: tables and inline styles only,
 * no images (many clients block them), plus a text version for clients that prefer it.
 */
const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function transactionalEmail(args: {
  preheader: string;
  heading: string;
  paragraphs: string[];
  cta: { label: string; url: string };
  footnote: string;
}): { html: string; text: string } {
  const { preheader, heading, paragraphs, cta, footnote } = args;
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
<table role="presentation" cellpadding="0" cellspacing="0" style="margin:22px 0 8px;"><tr><td style="border-radius:999px;background:#2563EB;">
<a href="${esc(cta.url)}" style="display:inline-block;padding:12px 22px;font-size:15px;font-weight:600;color:#FFFFFF;text-decoration:none;border-radius:999px;">${esc(cta.label)}</a>
</td></tr></table>
<p style="margin:18px 0 0;font-size:13px;line-height:1.6;color:#6B6B6B;">Button not working? Paste this link into your browser:<br><a href="${esc(cta.url)}" style="color:#1D4ED8;word-break:break-all;">${esc(cta.url)}</a></p>
</td></tr>
<tr><td style="padding:16px 4px 0;font-family:${font};font-size:12px;line-height:1.6;color:#6B6B6B;">${esc(footnote)} Questions? Write to support@launch-cv.com.</td></tr>
</table>
</td></tr></table>
</body></html>`;
  const text = [heading, "", ...paragraphs.flatMap((p) => [p, ""]), `${cta.label}: ${cta.url}`, "", footnote, "Questions? Write to support@launch-cv.com."].join("\n");
  return { html, text };
}
