import Link from "next/link";
import { container, labelCls, Chip } from "@/components/site/ui";
import type { ResumeExample } from "@/lib/resume-examples";
import { getCoverLetterExample } from "@/lib/cover-letter-examples";
import { roleShort } from "@/lib/seo/resume-keywords";

type Page = "example" | "keywords" | "letter";
type Card = { badge: string; title: string; href: string };

/** The other pages about the same role, plus one tool that fits where the reader is. */
export function roleNextSteps(e: ResumeExample, page: Page): Card[] {
  const short = roleShort(e);
  const cards: Card[] = [];
  if (page !== "example") cards.push({ badge: "Example", title: `${e.role} resume example`, href: `/resume-examples/${e.slug}` });
  if (page !== "keywords") cards.push({ badge: "Keywords", title: `${e.keywords.length} ${short} resume keywords`, href: `/resume-keywords/${e.slug}` });
  if (page !== "letter" && getCoverLetterExample(e.slug)) cards.push({ badge: "Cover letter", title: `${e.role} cover letter example`, href: `/cover-letter-examples/${e.slug}` });
  cards.push(
    page === "example"
      ? { badge: "Free tool", title: `Turn rough notes into ${short} resume bullets`, href: "/tools/resume-bullet-point-generator" }
      : { badge: "Tool", title: `Match your resume to a ${short} job post`, href: "/features/jd-alignment" },
  );
  return cards;
}

export function RoleNextSteps({ e, page, className = "pt-14 lg:pt-[110px]" }: { e: ResumeExample; page: Page; className?: string }) {
  const cards = roleNextSteps(e, page);
  return (
    <section aria-labelledby="next-steps" className={`${container} ${className}`}>
      <h2 id="next-steps" className={labelCls}>
        <span aria-hidden="true">/ </span>Keep going
      </h2>
      <ul className={`mt-3.5 grid gap-2 sm:gap-4 lg:mt-5 ${cards.length === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
        {cards.map((c) => (
          <li key={c.href}>
            <Link href={c.href} className="lc-card lc-rise group flex h-full flex-col rounded-[22px] p-5 text-[#121226] sm:rounded-3xl sm:p-[26px]">
              <span>
                <Chip tone="lilac">{c.badge}</Chip>
              </span>
              <span className="mt-4 block flex-1 text-[19px] font-extrabold leading-[25px] tracking-[-0.01em] group-hover:text-[#5440e8] sm:mt-7 sm:text-[21px] sm:leading-[27px]">
                {c.title}
              </span>
              <span className="mt-3 text-[14px] font-bold text-[#5440e8] sm:mt-3.5">
                Open <span aria-hidden="true">→</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
