import type { ResumeExample } from "@/lib/resume-examples";
import type { ResumeContent } from "@/types/resume";

/**
 * Turns a written resume example into editor content. With `owner`, the sample
 * person's contact line is swapped for the account holder's, so a resume started
 * from an example never carries someone else's name or email.
 */
export function exampleToContent(e: ResumeExample, owner?: { name: string; email: string }): ResumeContent {
  const r = e.resume;
  const [location, email, ...links] = r.contact.split(" · ");
  // "Degree, School, Year · Licence · Certification"
  const [main, ...extras] = r.education.split(" · ");
  const parts = main.split(", ");
  const year = /^\d{4}$/.test(parts[parts.length - 1] ?? "") ? parts.pop()! : "";
  let degree = parts.shift() ?? "";
  // A major after the degree ("Associate of Arts, Business Administration, …") belongs to the degree.
  const isSchool = (x: string) => /University|College|Institute|School|Academy/i.test(x);
  while (parts.length > 1 && !isSchool(parts[0]) && parts.slice(1).some(isSchool)) degree += `, ${parts.shift()}`;
  const school = parts.join(", ");
  return {
    contact: owner
      ? { fullName: owner.name, email: owner.email, location: "", phone: "", links: [] }
      : { fullName: r.name, email: email ?? "", location, links },
    headline: r.headline,
    summary: r.summary,
    experience: r.jobs.map((j, i) => {
      const [start, end] = j.dates.split("–").map((s) => s.trim());
      return {
        id: `x${i}`,
        company: j.company,
        role: j.title,
        start: start ?? "",
        end: end ?? "",
        bullets: j.bullets.map((b, k) => ({ id: `x${i}b${k}`, text: b, evidenceIds: [] })),
      };
    }),
    education: [{ id: "ed", school, degree, start: "", end: year }],
    certifications: extras.map((x, i) => ({ id: `c${i}`, name: x, issuer: "", date: "" })),
    achievements: [],
    recommendations: [],
    skills: [...r.skills],
    evidence: [],
  };
}
