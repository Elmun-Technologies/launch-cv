import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";

export function SiteFooter() {
  const support = process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? "support@launchcv.local";

  return (
    <footer className="border-t border-gray-200 bg-white py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 sm:flex-row sm:justify-between">
        <div className="flex items-center gap-2">
          <BrandMark size={24} />
          <span className="text-sm font-semibold">
            <span className="text-[#0F172A]">launch</span>
            <span className="text-[#2563EB]">cv</span>
          </span>
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
          <Link href="/legal/terms" className="hover:text-gray-900">Terms</Link>
          <Link href="/legal/privacy" className="hover:text-gray-900">Privacy</Link>
          <a href={`mailto:${support}`} className="hover:text-blue-600">{support}</a>
        </div>
        <p className="text-xs text-gray-400">&copy; {new Date().getFullYear()} LaunchCV</p>
      </div>
    </footer>
  );
}
