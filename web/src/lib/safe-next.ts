/** Same rules as middleware's safeNextPath: only same-site relative paths. */
export function safeNextPath(value: string | null | undefined): string | null {
  if (!value || value.length > 512) return null;
  if (!value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\") || value.includes("://")) return null;
  return value;
}
