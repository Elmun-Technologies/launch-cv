import { test, expect } from "@playwright/test";
import { extractJobTerms, scanJobDescription } from "../src/lib/resume-keywords";
import { SAMPLE_JOB_DESCRIPTION, SAMPLE_RESUME } from "../src/lib/seo/keyword-scanner-sample";

// Pure-function tests — no browser needed. They lock in how the free job description
// keyword scanner ranks terms and matches them against a pasted resume.

const PM = `Project Manager, Construction

We are hiring a Project Manager to lead commercial construction projects from preconstruction through closeout.

Responsibilities:
- Manage project schedules, budgets and subcontractor coordination
- Track RFIs and submittals in Procore
- Maintain project schedules in Primavera P6 or Microsoft Project

Qualifications:
- 5+ years of project management experience on commercial construction projects
- PMP certification is a plus
- Experience with Procore and Bluebeam required

We offer competitive pay, 401k and paid time off. Equal Opportunity Employer.`;

test("ranks required terms above preferred ones and tags each", () => {
  const scan = scanJobDescription(SAMPLE_JOB_DESCRIPTION);
  const by = (t: string) => scan.terms.find((x) => x.term === t);
  expect(scan.hasSections).toBe(true);
  expect(scan.resume).toBeNull();
  expect(by("SQL")?.priority).toBe("required");
  expect(by("Tableau")?.priority).toBe("required");
  expect(by("Statistics")?.priority).toBe("preferred");
  // dbt is a duty and a nice-to-have, so it isn't labeled either way.
  expect(by("dbt")?.priority).toBe("mentioned");
  const rank = (t: string) => scan.terms.findIndex((x) => x.term === t);
  expect(rank("SQL")).toBeGreaterThanOrEqual(0);
  expect(rank("SQL")).toBeLessThan(rank("Statistics"));
  // Sorted by score, highest first.
  expect(scan.terms.map((t) => t.score)).toEqual([...scan.terms.map((t) => t.score)].sort((a, b) => b - a));
});

test("finds the job title, multi-word skills and repeated phrases, not boilerplate", () => {
  const terms = scanJobDescription(PM).terms;
  const names = terms.map((t) => t.term);
  const title = terms.find((t) => t.term === "Project Manager");
  expect(title?.inTitle).toBe(true);
  expect(names[0]).toBe("Project Manager");
  for (const want of ["Project management", "Procore", "Project schedules", "Commercial construction projects", "PMP"]) expect(names).toContain(want);
  for (const not of ["Equal Opportunity Employer", "Paid time off", "Construction"]) expect(names).not.toContain(not);
  expect(terms.find((t) => t.term === "PMP")?.priority).toBe("preferred");
  expect(terms.find((t) => t.term === "Procore")?.priority).toBe("required");
  // A name the dictionary doesn't know, listed once under the requirements.
  expect(terms.find((t) => t.term === "Bluebeam")?.priority).toBe("required");
});

test("lone names in requirement lists count; company names and filler words don't", () => {
  const names = scanJobDescription(`Marketing Manager

About Brightleaf
Brightleaf makes budgeting software.

Requirements
- Hands-on HubSpot or Marketo experience
- Strong copywriting skills, Strong attention to detail
- Experience at Brightleaf or a similar company`).terms.map((t) => t.term);
  expect(names).toContain("Marketo");
  expect(names).not.toContain("Strong");
  expect(names).not.toContain("Brightleaf");
});

test("marks each term as in the resume or missing", () => {
  const scan = scanJobDescription(SAMPLE_JOB_DESCRIPTION, SAMPLE_RESUME);
  const by = (t: string) => scan.terms.find((x) => x.term === t);
  expect(by("SQL")?.present).toBe(true);
  expect(by("A/B testing")?.present).toBe(true);
  expect(by("Power BI")?.present).toBe(false);
  expect(by("dbt")?.present).toBe(false);
  expect(scan.resume?.total).toBe(scan.terms.length);
  expect(scan.resume?.found).toBe(scan.terms.filter((t) => t.present).length);
  expect(scan.terms.every((t) => typeof t.present === "boolean")).toBe(true);
});

test("a paragraph without headings is split by sentence", () => {
  const scan = scanJobDescription(
    "We are seeking a Registered Nurse (RN) for our medical-surgical unit. Candidates must hold a current RN license and BLS certification; ACLS is preferred. Our nurses chart in Epic every shift.",
  );
  const by = (t: string) => scan.terms.find((x) => x.term === t);
  expect(by("BLS")?.priority).toBe("required");
  expect(by("ACLS")?.priority).toBe("preferred");
  expect(by("Epic")?.priority).toBe("mentioned");
});

test("empty or tiny input gives nothing, and the editor's extraction is unchanged", () => {
  expect(scanJobDescription("").terms).toEqual([]);
  expect(scanJobDescription("short", "SQL").resume).toBeNull();
  // extractJobTerms (the editor panel) still caps at 30 and ignores lower-case phrases.
  const editor = extractJobTerms(PM).map((t) => t.term);
  expect(editor.length).toBeLessThanOrEqual(30);
  expect(editor).not.toContain("Project schedules");
});
