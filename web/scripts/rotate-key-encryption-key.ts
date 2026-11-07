/**
 * Rotate KEY_ENCRYPTION_KEY: re-encrypt every secret stored in the database
 * from the old master key to a new one.
 *
 * What it re-encrypts (everything sealed with lib/secret-box.ts):
 *   - IntegrationSecret.ciphertext  (API keys saved in Admin → Integrations)
 *   - User.totpSecret               (staff authenticator secrets)
 * Recovery codes are scrypt hashes, not encrypted, so they don't change.
 *
 * Usage (from web/):
 *   OLD_KEY_ENCRYPTION_KEY='<current value>' NEW_KEY_ENCRYPTION_KEY='<new value>' \
 *     npx tsx scripts/rotate-key-encryption-key.ts --dry-run
 *   …then the same command without --dry-run to write.
 *
 * DATABASE_URL comes from the environment (or web/.env). Generate the new key
 * with `openssl rand -base64 48` (at least 32 characters).
 *
 * Order of operations for a live site:
 *   1. Run with --dry-run. It decrypts every row with the old key and checks
 *      the new key round-trips; nothing is written.
 *   2. Run without --dry-run. All rows are rewritten in one transaction:
 *      either every secret moves to the new key or none does.
 *   3. Set KEY_ENCRYPTION_KEY to the new value in hosting and redeploy right
 *      away. Until then, running servers can't read panel keys and fall back to
 *      hosting env values; staff 2FA codes fail until the redeploy.
 *
 * Safety:
 *   - Fails closed: if any row can't be decrypted with the old key (and isn't
 *     already on the new key), nothing is written and the script exits 1.
 *   - Rows that already decrypt with the new key are skipped, so a re-run
 *     after a partial failure is safe.
 *   - Never prints a secret, a key or a ciphertext — only row labels
 *     ("openai.apiKey", "user <id>") and counts.
 */
import { PrismaClient } from "@prisma/client";
import { deriveMasterKey, openWith, sealWith } from "../src/lib/secret-box";

type Item = { kind: "integration" | "totp"; id: string; label: string; sealed: string };
type Plan = { item: Item; next: string };

function fail(message: string): never {
  console.error(`✗ ${message}`);
  process.exit(1);
}

function tryOpen(key: Buffer, sealed: string): string | null {
  try {
    return openWith(key, sealed);
  } catch {
    return null;
  }
}

async function main() {
  const args = new Set(process.argv.slice(2));
  const unknown = [...args].filter((a) => a !== "--dry-run");
  if (unknown.length) fail(`Unknown argument: ${unknown.join(" ")}. The only flag is --dry-run.`);
  const dryRun = args.has("--dry-run");

  const oldRaw = process.env.OLD_KEY_ENCRYPTION_KEY;
  const newRaw = process.env.NEW_KEY_ENCRYPTION_KEY;
  const oldKey = deriveMasterKey(oldRaw);
  const newKey = deriveMasterKey(newRaw);
  if (!oldKey) fail("Set OLD_KEY_ENCRYPTION_KEY to the current key (at least 32 characters).");
  if (!newKey) fail("Set NEW_KEY_ENCRYPTION_KEY to the new key (at least 32 characters).");
  if (oldKey.equals(newKey)) fail("OLD_KEY_ENCRYPTION_KEY and NEW_KEY_ENCRYPTION_KEY are the same.");
  if (!process.env.DATABASE_URL) fail("DATABASE_URL is not set.");

  const prisma = new PrismaClient();
  try {
    const [secrets, staff] = await Promise.all([
      prisma.integrationSecret.findMany({ select: { id: true, provider: true, field: true, ciphertext: true } }),
      prisma.user.findMany({ where: { totpSecret: { not: null } }, select: { id: true, totpSecret: true } }),
    ]);
    const items: Item[] = [
      ...secrets.map((s) => ({ kind: "integration" as const, id: s.id, label: `${s.provider}.${s.field}`, sealed: s.ciphertext })),
      ...staff.map((u) => ({ kind: "totp" as const, id: u.id, label: `user ${u.id} (2FA)`, sealed: u.totpSecret! })),
    ];

    const plans: Plan[] = [];
    const alreadyNew: string[] = [];
    const unreadable: string[] = [];
    for (const item of items) {
      const plain = tryOpen(oldKey, item.sealed);
      if (plain === null) {
        if (tryOpen(newKey, item.sealed) !== null) alreadyNew.push(item.label);
        else unreadable.push(item.label);
        continue;
      }
      const next = sealWith(newKey, plain);
      // Round-trip check before anything is written.
      if (tryOpen(newKey, next) !== plain) fail(`Re-encryption check failed for ${item.label}. Nothing was written.`);
      plans.push({ item, next });
    }

    const count = (kind: Item["kind"]) => plans.filter((p) => p.item.kind === kind).length;
    console.log(`Key rotation ${dryRun ? "(dry run — nothing will be written)" : ""}`.trim());
    console.log(`  Integration secrets to re-encrypt: ${count("integration")} of ${secrets.length}`);
    console.log(`  Staff 2FA secrets to re-encrypt:   ${count("totp")} of ${staff.length}`);
    if (alreadyNew.length) console.log(`  Already on the new key (skipped):  ${alreadyNew.length} — ${alreadyNew.join(", ")}`);
    if (unreadable.length) {
      console.log(`  Unreadable with either key:        ${unreadable.length} — ${unreadable.join(", ")}`);
      fail("Some rows can't be decrypted with OLD_KEY_ENCRYPTION_KEY. Check the old key. Nothing was written.");
    }

    if (dryRun) {
      console.log("✓ Dry run OK. Run again without --dry-run to write.");
      return;
    }
    if (!plans.length) {
      console.log("✓ Nothing to do.");
      return;
    }
    await prisma.$transaction(
      plans.map(({ item, next }) =>
        item.kind === "integration"
          ? prisma.integrationSecret.update({ where: { id: item.id }, data: { ciphertext: next } })
          : prisma.user.update({ where: { id: item.id }, data: { totpSecret: next } }),
      ),
    );
    console.log(`✓ Re-encrypted ${plans.length} secret${plans.length === 1 ? "" : "s"}. Now set KEY_ENCRYPTION_KEY to the new value in hosting and redeploy.`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e: unknown) => {
  // Error messages from Prisma can include query parameters; print only the type and code.
  const name = e instanceof Error ? e.name : "Error";
  const code = (e as { code?: string })?.code;
  console.error(`✗ Rotation failed (${name}${code ? ` ${code}` : ""}). Nothing was written if the failure happened before the final transaction.`);
  process.exit(1);
});
