import Link from "next/link";

const cols = {
  Product: [
    { label: "Features", href: "/features" },
    { label: "Pricing", href: "/pricing" },
    { label: "Resume Builder", href: "/features/resume-builder" },
    { label: "JD Alignment", href: "/features/jd-alignment" },
    { label: "ATS Score", href: "/features/ats-score" },
  ],
  "Use Cases": [
    { label: "Software Engineers", href: "/use-cases/software-engineers" },
    { label: "Product Managers", href: "/use-cases/product-managers" },
    { label: "Designers", href: "/use-cases/designers" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Investors", href: "/investors" },
    { label: "Support", href: "/dashboard/support" },
  ],
  Legal: [
    { label: "Privacy", href: "/legal/privacy" },
    { label: "Terms", href: "/legal/terms" },
  ],
};

export function LandingFooter() {
  return (
    <footer className="border-t border-[#f0f0f0] bg-white">
      <div className="mx-auto max-w-[1120px] px-6 py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[#0a0a0a] text-[12px] font-bold text-white">L</span>
              <span className="text-[15px] font-bold text-[#0a0a0a]">Launch CV</span>
            </Link>
            <p className="mt-4 text-[13px] leading-relaxed text-[#999]">
              AI-powered resume platform.<br />Built for modern job seekers.
            </p>
          </div>
          {Object.entries(cols).map(([group, items]) => (
            <div key={group}>
              <p className="text-[13px] font-semibold text-[#0a0a0a]">{group}</p>
              <ul className="mt-4 space-y-2.5">
                {items.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="text-[13px] text-[#999] transition hover:text-[#0a0a0a]">{item.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex items-center justify-between border-t border-[#f0f0f0] pt-6">
          <p className="text-[12px] text-[#ccc]">&copy; {new Date().getFullYear()} Launch CV</p>
          <p className="text-[12px] text-[#ccc]">support@launch-cv.com</p>
        </div>
      </div>
    </footer>
  );
}
