/**
 * Content for the /skills-for-resume pillar guide.
 *
 * Body copy is Markdown. The "skills by field" lists are computed from the
 * keywords on our resume examples (lib/resume-examples.ts) at build time, so
 * they say "most common across our examples", never "most in demand". No
 * hiring statistics: add one only with a primary source.
 */

import type { GuideSection } from "@/components/site/seo/guide-page";
import type { FaqItem } from "@/lib/faq-ld";
import { RESUME_EXAMPLES, RESUME_GROUPS, type ResumeExample, type ResumeGroup } from "@/lib/resume-examples";
import { keywordGroups } from "@/lib/seo/resume-keywords";

export const RESUME_SKILLS_PUBLISHED = "2026-11-08";
export const RESUME_SKILLS_UPDATED = "2026-11-08";

export const SKILL_TYPES: { name: string; what: string; examples: string; featured?: boolean }[] = [
  { name: "Hard skills", what: "Teachable, testable abilities specific to the work.", examples: "SQL, bookkeeping, IV insertion, blueprint reading", featured: true },
  { name: "Tools & software", what: "The programs and equipment you use to do it.", examples: "Excel, Salesforce, Epic, Figma, a multimeter" },
  { name: "Soft skills", what: "How you work with people and handle the job.", examples: "Communication, de-escalation, time management" },
  { name: "Transferable skills", what: "Skills that carry over from one field to another.", examples: "Training others, budgeting, customer service" },
];

export const SKILLS_QUICK = [
  "Pick 6 to 12 skills for a skills section, mostly hard skills and tools",
  "Match the job post's wording for skills you really have",
  "Prove soft skills in your bullets instead of listing them",
  "Put the most important skills in your summary and recent bullets too",
  "Drop skills everyone has (\"Microsoft Word\", \"email\") unless the post asks",
  "Never list a skill you couldn't discuss in an interview",
];

/** Soft skill → how to show it in a bullet. Columns: skill, weak, strong. */
export const SOFT_SKILL_PROOF: string[][] = [
  ["Communication", "Excellent communication skills", "Wrote the weekly client update read by 40 account managers"],
  ["Leadership", "Strong leader", "Led a team of 6 through a system migration with no missed deadlines"],
  ["Problem solving", "Creative problem solver", "Found the cause of a recurring billing error and cut refunds by 30%"],
  ["Teamwork", "Team player", "Covered two roles during a hiring freeze and trained both replacements"],
  ["Time management", "Good at managing time", "Handled 60+ tickets a day while keeping a 95% on-time response rate"],
  ["Customer service", "Customer-focused", "Raised the store's satisfaction score from 4.2 to 4.7 in six months"],
  ["Adaptability", "Adaptable and flexible", "Moved our onboarding fully online in two weeks when the office closed"],
  ["Attention to detail", "Detail-oriented", "Reconciled 400+ invoices a month with a 0.5% error rate"],
];

export const TRANSFERABLE_SKILLS: { skill: string; from: string; to: string }[] = [
  { skill: "Training and coaching", from: "Teacher, shift lead, nurse preceptor", to: "Onboarding, customer success, L&D" },
  { skill: "Budgeting", from: "Club treasurer, store manager, event planner", to: "Operations, project management, finance" },
  { skill: "Customer service", from: "Retail, hospitality, call centers", to: "Account management, sales, support" },
  { skill: "Data and reporting", from: "Any job where you tracked numbers in Excel", to: "Analyst, operations, marketing" },
  { skill: "Scheduling and coordination", from: "Restaurants, clinics, logistics", to: "Project coordination, admin, operations" },
  { skill: "Writing", from: "Teaching, research, social media", to: "Content, communications, documentation" },
  { skill: "De-escalation", from: "Healthcare, security, retail", to: "Customer support, HR, social services" },
  { skill: "Process improvement", from: "Any role where you fixed a recurring problem", to: "Operations, quality, business analysis" },
];

/** Example skills section, as it would appear on a resume (data analyst). */
export const SKILLS_SECTION_EXAMPLE = [
  { label: "Analysis", items: "SQL, Python (pandas), A/B testing, forecasting, data cleaning" },
  { label: "Tools", items: "Tableau, Power BI, Excel (pivot tables, Power Query), dbt, BigQuery" },
  { label: "Certifications", items: "Google Data Analytics Certificate" },
];

export type FieldSkills = { group: ResumeGroup; roles: ResumeExample[]; hard: string[]; tools: string[] };

/** Most common hard skills and tools per field, across our examples (ties keep list order). */
export function skillsByField(perList = 10): FieldSkills[] {
  return RESUME_GROUPS.map((group) => {
    const roles = RESUME_EXAMPLES.filter((e) => e.group === group).sort((a, b) => a.role.localeCompare(b.role));
    const count = { hard: new Map<string, number>(), tools: new Map<string, number>() };
    for (const e of roles) {
      for (const g of keywordGroups(e)) {
        if (g.id !== "hard" && g.id !== "tools") continue;
        for (const it of g.items) count[g.id].set(it.term, (count[g.id].get(it.term) ?? 0) + 1);
      }
    }
    const top = (m: Map<string, number>) => [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, perList).map(([t]) => t);
    return { group, roles, hard: top(count.hard), tools: top(count.tools) };
  }).filter((f) => f.roles.length > 0);
}

export const RESUME_SKILLS_SECTIONS: GuideSection[] = [
  {
    id: "what-skills",
    title: "What skills should you put on a resume?",
    body: [
      "The skills the job asks for that you really have. That sounds obvious, but it changes how you build the list: start from the job post, not from everything you've ever done.",
      "Most of your list should be **hard skills and tools**, because they're specific and easy to check. **Soft skills** matter just as much, but a word like \"leadership\" in a list proves nothing. Show those in your bullets instead (examples below).",
    ],
    figure: "types",
  },
  {
    id: "how-to-choose",
    title: "How to choose the right skills for each job",
    body: [
      "1. **Read the job post twice.** Highlight every skill, tool and certification it names. Note which ones it repeats or lists under \"required\".\n2. **Mark the ones you have.** Be honest: could you talk about it for two minutes in an interview?\n3. **Use their wording.** If the post says \"Salesforce\" and \"pipeline management\", use those words rather than \"CRM\" and \"sales funnel\".\n4. **Add your strongest extras.** One or two skills the post doesn't mention but that make you stand out in the role.",
      "The free [job description keyword scanner](/tools/job-description-keyword-scanner) does steps 1 and 2 for you: it ranks the skills a posting mentions and shows which ones your resume already has.",
    ],
  },
  {
    id: "where",
    title: "Where to put skills on your resume",
    body: [
      "Skills belong in three places, not one:",
      "- **A skills section** near the top or bottom, with 6 to 12 hard skills, tools and certifications. Group them if you have many.\n- **Your summary**, which names the two or three most important ones for this job.\n- **Your bullets**, where each skill shows up in a result: *\"Built a Tableau dashboard that cut weekly reporting from 6 hours to 1\"*.",
      "Applicant tracking systems read the whole resume, not just the skills section, and to a recruiter a skill shown in a result is far more convincing than one that only sits in a list. Here's what a compact skills section looks like:",
    ],
    figure: "section-example",
  },
  {
    id: "soft-skills",
    title: "Soft skills: show them, don't list them",
    body: [
      "Anyone can type \"excellent communication skills\". A bullet that shows the skill at work is what convinces a reader. Here are common soft skills with a weak and a strong way to show each:",
    ],
    figure: "soft",
    after: [
      "If the job post lists a soft skill as a requirement, it's fine to name it in your summary too. Just make sure a bullet backs it up. The [resume action verbs](/resume-action-verbs) guide has more ways to start these bullets.",
    ],
  },
  {
    id: "transferable",
    title: "Transferable skills for a career change",
    body: [
      "Changing fields? Your old job taught you skills the new one needs; you just have to name them in the new field's language. A few common ones:",
    ],
    figure: "transferable",
    after: [
      "Put transferable skills in your summary and in your most recent bullets, written as results. The [career change cover letter](/cover-letter/career-change) shows how to explain the move.",
    ],
  },
  {
    id: "by-field",
    title: "Skills to put on a resume, by field",
    body: [
      "The most common hard skills and tools across our resume examples in each field. Use them as a starting point, then check the job post. Open a role for its full keyword list, sorted into skills, tools and certifications.",
    ],
    figure: "fields",
  },
  {
    id: "how-many",
    title: "How many skills should you list?",
    body: [
      "Six to twelve in a skills section is a good range for most resumes. Fewer can look thin; many more and the important ones get lost. Technical roles with lots of tools can go higher, grouped into short labeled lines like the example above.",
      "Quality beats quantity: every skill on the list should be one you'd be glad to be asked about.",
    ],
  },
  {
    id: "mistakes",
    title: "Common mistakes with resume skills",
    body: [
      "- **Listing skills you can't back up.** Interviewers often pick something from your list and ask you to explain it.\n- **Rating yourself with bars or stars.** \"Python ★★★★☆\" means nothing to a reader, and many applicant tracking systems can't read graphics.\n- **Generic skills only.** \"Microsoft Office\" and \"teamwork\" don't separate you from anyone.\n- **Ignoring the job post's wording.** If you call it something different, a keyword search can miss it.\n- **Putting skills in a sidebar or table.** Some parsers skip them. A plain section with commas or short lines is safest.",
      "Run the [free ATS check](/free-ats-check) to see how software reads your skills section.",
    ],
  },
];

export const RESUME_SKILLS_FAQS: FaqItem[] = [
  { q: "What are the best skills to put on a resume?", a: "The ones the job post asks for that you can back up. For most jobs that means the hard skills and tools named in the posting, plus one or two strengths that set you apart, shown in your bullets." },
  { q: "Should I include soft skills on my resume?", a: "Yes, but show them in your bullets and summary rather than only listing them. \"Led a team of 6\" proves leadership; \"strong leader\" doesn't." },
  { q: "How many skills should I put on a resume?", a: "Six to twelve in a skills section works for most people. Technical roles can list more, grouped into short labeled lines." },
  { q: "Where should the skills section go?", a: "Near the top for career changers, students and technical roles where skills are the main qualification; after experience for everyone else. Either works for applicant tracking systems as long as it's a plain text section." },
  { q: "Should I list Microsoft Office?", a: "Only if the job asks for it or you have advanced skills worth naming (Excel pivot tables, Power Query, macros). Basic Word and email are assumed." },
  { q: "What are transferable skills?", a: "Skills that carry from one field to another, like training others, budgeting, customer service or data reporting. They're the bridge in a career-change resume." },
];

export const RESUME_SKILLS_READING: string[] = ["how-to-tailor-your-resume-for-every-job", "how-to-write-an-ats-friendly-resume"];
