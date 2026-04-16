import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <p className="text-[80px] font-bold leading-none text-[#7C5CFC]">404</p>
        <h1 className="mt-4 text-2xl font-bold text-gray-900">Page not found</h1>
        <p className="mt-2 text-sm text-gray-500">Sorry, we couldn&apos;t find the page you&apos;re looking for.</p>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/dashboard" className="rounded-full bg-[#7C5CFC] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#6B4CE0]">Go to Dashboard</Link>
          <Link href="/" className="rounded-full border border-gray-200 px-6 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50">Back to Home</Link>
        </div>
      </div>
    </div>
  );
}
