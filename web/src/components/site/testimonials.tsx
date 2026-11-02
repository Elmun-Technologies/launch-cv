import type { PublicTestimonial } from "@/lib/cms/testimonials";
import { container, labelCls } from "@/components/site/ui";

/**
 * Real testimonials added in Admin → Content → Testimonials (published, for this
 * placement). Pages render this only when there is at least one; nothing is
 * shown — and no rating markup is emitted — otherwise.
 */
export function Testimonials({ items, title = "What people say." }: { items: PublicTestimonial[]; title?: string }) {
  return (
    <section className={`${container} pt-24 lg:pt-[140px]`} aria-labelledby="testimonials-title">
      <div className="lc-reveal max-w-[820px]">
        <p className={labelCls}>/ From our users</p>
        <h2 id="testimonials-title" className="lc-h2 mt-5">
          {title}
        </h2>
      </div>
      <ul className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((t) => (
          <li key={t.id} className="lc-card lc-reveal lc-rise flex flex-col rounded-3xl p-6">
            {t.rating ? (
              <p className="text-[16px] tracking-[2px] text-[#ff7a33]" aria-label={`${t.rating} out of 5`}>
                {"★".repeat(Math.max(0, Math.min(5, t.rating)))}
                <span className="text-[#e2e0ea]">{"★".repeat(5 - Math.max(0, Math.min(5, t.rating)))}</span>
              </p>
            ) : null}
            <blockquote className="mt-3 flex-1 text-[17px] leading-[27px] text-[#121226]">“{t.quote}”</blockquote>
            <footer className="mt-5 flex items-center gap-3">
              {t.authorAvatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element -- CMS image, unknown dimensions
                <img src={t.authorAvatarUrl} alt="" width={40} height={40} className="h-10 w-10 rounded-full object-cover" />
              ) : (
                <span aria-hidden="true" className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#e4dfff] text-[14px] font-bold text-[#3a2bb8]">
                  {t.authorName
                    .split(/\s+/)
                    .map((w) => w[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </span>
              )}
              <span>
                <span className="block text-[15px] font-bold">{t.authorName}</span>
                {t.authorRole ? <span className="block text-[13px] text-[#66647c]">{t.authorRole}</span> : null}
              </span>
            </footer>
          </li>
        ))}
      </ul>
    </section>
  );
}
