/** `maria.lopez@gmail.com` → `m•••z@gmail.com`. The domain stays readable so people know which inbox to open. */
export function maskEmail(email: string): string {
  const at = email.lastIndexOf("@");
  if (at < 1) return "your email address";
  const local = email.slice(0, at);
  const domain = email.slice(at + 1);
  const masked = local.length <= 2 ? `${local[0]}•••` : `${local[0]}•••${local[local.length - 1]}`;
  return `${masked}@${domain}`;
}

export type InboxLink = { href: string; label: string; webmail: boolean };

const WEBMAIL: { match: (domain: string) => boolean; href: string; label: string }[] = [
  {
    match: (d) => d === "gmail.com" || d === "googlemail.com",
    href: "https://mail.google.com/mail/u/0/#inbox",
    label: "Open Gmail",
  },
  {
    match: (d) => ["outlook.com", "hotmail.com", "live.com", "msn.com"].includes(d) || /^(outlook|hotmail|live)\.[a-z.]+$/.test(d),
    href: "https://outlook.live.com/mail/0/inbox",
    label: "Open Outlook",
  },
  {
    match: (d) => ["ymail.com", "rocketmail.com"].includes(d) || /^yahoo\.[a-z.]+$/.test(d),
    href: "https://mail.yahoo.com/",
    label: "Open Yahoo Mail",
  },
];

/** Web inbox for the big free providers, otherwise a plain `mailto:` that opens the default mail app. */
export function inboxLinkFor(email: string): InboxLink {
  const domain = email.slice(email.lastIndexOf("@") + 1).toLowerCase();
  const hit = WEBMAIL.find((w) => w.match(domain));
  return hit ? { href: hit.href, label: hit.label, webmail: true } : { href: "mailto:", label: "Open my email app", webmail: false };
}
