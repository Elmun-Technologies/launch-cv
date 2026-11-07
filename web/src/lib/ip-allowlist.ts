/**
 * IP allow-list for the admin panel (Admin → Security → sign-in rules).
 * Pure functions, no imports: used by the admin guard and the settings API.
 *
 * Entries are single addresses ("203.0.113.7", "2001:db8::1") or CIDR ranges
 * ("203.0.113.0/24", "2001:db8::/32"). An empty list means the rule is off.
 */

type Parsed = { v: 4 | 6; bytes: number[] };

function parseV4(s: string): number[] | null {
  const parts = s.split(".");
  if (parts.length !== 4) return null;
  const out: number[] = [];
  for (const p of parts) {
    if (!/^\d{1,3}$/.test(p)) return null;
    const n = Number(p);
    if (n > 255) return null;
    out.push(n);
  }
  return out;
}

function parseV6(s: string): number[] | null {
  let str = s;
  // Embedded IPv4 tail ("::ffff:1.2.3.4").
  let tail: number[] = [];
  const lastColon = str.lastIndexOf(":");
  if (str.includes(".") && lastColon >= 0) {
    const v4 = parseV4(str.slice(lastColon + 1));
    if (!v4) return null;
    tail = v4;
    str = str.slice(0, lastColon + 1) + "0:0";
  }
  const halves = str.split("::");
  if (halves.length > 2) return null;
  const head = halves[0] ? halves[0].split(":") : [];
  const rest = halves.length === 2 && halves[1] ? halves[1].split(":") : [];
  const groups = halves.length === 2 ? 8 - head.length - rest.length : 0;
  if (groups < 0 || (halves.length === 1 && head.length !== 8)) return null;
  const all = [...head, ...Array(groups).fill("0"), ...rest];
  if (all.length !== 8) return null;
  const bytes: number[] = [];
  for (const g of all) {
    if (!/^[0-9a-fA-F]{1,4}$/.test(g)) return null;
    const n = parseInt(g, 16);
    bytes.push(n >> 8, n & 255);
  }
  if (tail.length) bytes.splice(12, 4, ...tail);
  return bytes;
}

/** Parse an address; IPv4-mapped IPv6 ("::ffff:1.2.3.4") becomes plain IPv4. */
export function parseIp(raw: string): Parsed | null {
  const s = raw.trim().replace(/^\[|\]$/g, "").replace(/%.*$/, "");
  if (!s) return null;
  const v4 = parseV4(s);
  if (v4) return { v: 4, bytes: v4 };
  const v6 = parseV6(s);
  if (!v6) return null;
  const mapped = v6.slice(0, 10).every((b) => b === 0) && v6[10] === 255 && v6[11] === 255;
  return mapped ? { v: 4, bytes: v6.slice(12) } : { v: 6, bytes: v6 };
}

export type Cidr = { v: 4 | 6; bytes: number[]; prefix: number };

export function parseCidr(raw: string): Cidr | null {
  const [addr, bits, extra] = raw.trim().split("/");
  if (extra !== undefined) return null;
  const ip = parseIp(addr ?? "");
  if (!ip) return null;
  const max = ip.v === 4 ? 32 : 128;
  if (bits === undefined) return { ...ip, prefix: max };
  if (!/^\d{1,3}$/.test(bits)) return null;
  const prefix = Number(bits);
  if (prefix > max) return null;
  return { ...ip, prefix };
}

export function ipInCidr(ip: string, cidr: Cidr): boolean {
  const p = parseIp(ip);
  if (!p || p.v !== cidr.v) return false;
  let left = cidr.prefix;
  for (let i = 0; i < p.bytes.length && left > 0; i++, left -= 8) {
    const mask = left >= 8 ? 255 : (0xff << (8 - left)) & 255;
    if ((p.bytes[i] & mask) !== (cidr.bytes[i] & mask)) return false;
  }
  return true;
}

/** True when the list is empty (rule off) or the address matches an entry. Unknown addresses never match. */
export function ipAllowed(ip: string | null | undefined, list: string[]): boolean {
  if (!list.length) return true;
  if (!ip) return false;
  return list.some((entry) => {
    const c = parseCidr(entry);
    return !!c && ipInCidr(ip, c);
  });
}

/** Split, trim, de-duplicate. Returns the valid entries and the ones that didn't parse. */
export function normalizeAllowlist(input: unknown): { valid: string[]; invalid: string[] } {
  const raw = Array.isArray(input) ? input : typeof input === "string" ? input.split(/[\s,]+/) : [];
  const valid: string[] = [];
  const invalid: string[] = [];
  for (const item of raw) {
    if (typeof item !== "string") continue;
    const s = item.trim();
    if (!s) continue;
    if (parseCidr(s)) {
      if (!valid.includes(s)) valid.push(s);
    } else invalid.push(s.slice(0, 64));
  }
  return { valid: valid.slice(0, 50), invalid };
}

/** "203.0.113.7" → "203.0.113.x"; IPv6 keeps the first three groups. For logs and UI. */
export function maskIp(raw: string | null | undefined): string {
  if (!raw) return "unknown";
  const p = parseIp(raw);
  if (!p) return "unknown";
  if (p.v === 4) return `${p.bytes.slice(0, 3).join(".")}.x`;
  const groups: string[] = [];
  for (let i = 0; i < 6; i += 2) groups.push(((p.bytes[i] << 8) | p.bytes[i + 1]).toString(16));
  return `${groups.join(":")}:…`;
}

/** Normalized display form (IPv4-mapped IPv6 shown as IPv4). */
export function displayIp(raw: string | null | undefined): string {
  if (!raw) return "unknown";
  const p = parseIp(raw);
  if (!p) return raw.trim().slice(0, 64);
  if (p.v === 4) return p.bytes.join(".");
  const groups: string[] = [];
  for (let i = 0; i < 16; i += 2) groups.push(((p.bytes[i] << 8) | p.bytes[i + 1]).toString(16));
  return groups.join(":");
}
