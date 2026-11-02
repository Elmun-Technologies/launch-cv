/** Self-checks for lib/bullet-quality.ts. Run: npx tsx src/lib/bullet-quality.check.ts */
import { BULLET_QUALITY_CASES, runBulletQualitySelfChecks } from "./bullet-quality";

const failures = runBulletQualitySelfChecks();
if (failures.length) {
  console.error(`bullet-quality: ${failures.length} of ${BULLET_QUALITY_CASES.length} checks failed`);
  for (const f of failures) console.error(`  ✗ ${f}`);
  process.exit(1);
}
console.log(`bullet-quality: all ${BULLET_QUALITY_CASES.length} checks pass`);
