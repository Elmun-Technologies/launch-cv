import { test, expect } from "@playwright/test";
import { analyzeAtsSignals } from "../src/lib/ats-signals";

// Pure-function tests — no browser needed. They lock in the deterministic
// grounding that the free ATS score relies on.

test("detects contact info, sections, and quantified bullets", () => {
  const s = analyzeAtsSignals(`John Doe
john@example.com | +1 555 123 4567 | linkedin.com/in/johndoe
SUMMARY
Experienced engineer.
EXPERIENCE
- Led a team of 5, improved latency by 30%
- Shipped 12 features across two quarters
EDUCATION
BS Computer Science, 2018
SKILLS
TypeScript, Go, Postgres`);

  expect(s.hasEmail).toBe(true);
  expect(s.hasPhone).toBe(true);
  expect(s.hasLinks).toBe(true);
  expect(s.sections).toEqual({ experience: true, education: true, skills: true, summary: true });
  expect(s.bulletCount).toBe(2);
  expect(s.quantifiedBulletRatio).toBe(1);
  expect(s.columnOrTableHint).toBe(false);
});

test("flags a multi-column / table layout", () => {
  const s = analyzeAtsSignals(`Name           Title Here
Contact Info           Skills List
Led the team           TypeScript Go
Improved latency       Postgres AWS`);
  expect(s.columnOrTableHint).toBe(true);
});

test("empty input yields all-false signals", () => {
  const s = analyzeAtsSignals("   ");
  expect(s.wordCount).toBe(0);
  expect(s.hasEmail).toBe(false);
  expect(s.bulletCount).toBe(0);
  expect(s.columnOrTableHint).toBe(false);
});
