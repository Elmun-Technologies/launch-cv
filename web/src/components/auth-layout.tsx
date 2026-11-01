import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { AlertCircle, ArrowLeft, CheckCircle2 } from "lucide-react";
import { siteFontVars } from "@/lib/site-fonts";
import { SiteLogo } from "@/components/site/brand";

/**
 * Split layout for the sign-in / sign-up / account-recovery pages (design v5):
 * the form on the lilac ground, a purple poster stage with a cut-out photo on
 * the right. Below `lg` the stage collapses into a short banner above the form.
 */

type AuthMode = "login" | "register" | "recover" | "verify";

type Stage = {
  poster: [string, string];
  src: string;
  alt: string;
  width: number;
  height: number;
  /** Desktop image height (px) and horizontal anchoring. */
  imgCls: string;
  /** Phone banner image classes. */
  mobileImgCls: string;
  /** Login/register banners are taller and carry the poster line. */
  tallBanner: boolean;
  note: ReactNode;
  sticker?: string;
};

const STAGES: Record<AuthMode, Stage> = {
  login: {
    poster: ["WELCOME", "BACK"],
    src: "/images/people/woman-blazer-laptop.webp",
    alt: "Smiling woman in a grey blazer",
    width: 620,
    height: 1080,
    imgCls: "right-0 h-[520px]",
    mobileImgCls: "-right-1.5 h-[170px] sm:h-[220px]",
    tallBanner: true,
    note: (
      <p className="text-[16px] font-semibold leading-6">Your resumes, reports and applications are where you left them.</p>
    ),
  },
  register: {
    poster: ["GET", "HIRED"],
    src: "/images/people/woman-red-top.webp",
    alt: "Laughing woman in a red top",
    width: 747,
    height: 1080,
    imgCls: "left-1/2 h-[500px] -translate-x-1/2",
    mobileImgCls: "-right-5 h-[170px] sm:right-4 sm:h-[220px]",
    tallBanner: true,
    sticker: "NO CREDIT CARD",
    note: (
      <div className="flex items-center gap-[18px]">
        <div className="flex-none">
          <p className="text-[13px] text-[#66647c]">Free to start</p>
          <p className="text-[24px] font-extrabold tracking-[-0.02em]">ATS check</p>
        </div>
        <span aria-hidden="true" className="h-11 w-px flex-none bg-[#e2e0ea]" />
        <p className="text-[14px] leading-[21px] text-[#4a4862]">
          See every issue, fix it with AI and tailor your resume to each job.
        </p>
      </div>
    ),
  },
  recover: {
    poster: ["FRESH", "START"],
    src: "/images/people/man-white-tee.webp",
    alt: "Smiling man in a white t-shirt",
    width: 739,
    height: 1080,
    imgCls: "left-1/2 h-[470px] -translate-x-1/2",
    mobileImgCls: "-right-2.5 h-[160px] sm:right-4 sm:h-[200px]",
    tallBanner: false,
    note: <p className="text-[15px] font-semibold leading-[23px]">Your resumes and reports stay exactly where you left them.</p>,
  },
  verify: {
    poster: ["ALMOST", "THERE"],
    src: "/images/people/woman-red-top.webp",
    alt: "Laughing woman in a red top",
    width: 747,
    height: 1080,
    imgCls: "left-1/2 h-[480px] -translate-x-1/2",
    mobileImgCls: "-right-2.5 h-[160px] sm:right-4 sm:h-[200px]",
    tallBanner: false,
    note: <p className="text-[15px] font-semibold leading-[23px]">One click in that email and your account is verified.</p>,
  },
};

const YEAR = new Date().getFullYear();

type AuthLayoutProps = {
  children: ReactNode;
  mode: AuthMode;
  /** Replaces the default copy on the white card in the photo stage. */
  stageNote?: ReactNode;
};

export function AuthLayout({ children, mode, stageNote }: AuthLayoutProps) {
  const s = STAGES[mode];
  const note = stageNote ?? s.note;

  return (
    <div className={`lc-site ${siteFontVars} min-h-screen lg:grid lg:grid-cols-2`}>
      {/* PHONE / TABLET BANNER */}
      <header
        className={`relative mx-2 mt-2 overflow-hidden rounded-[28px] bg-[#5440e8] lg:hidden ${
          s.tallBanner ? "h-[200px] sm:h-[250px]" : "h-[180px] sm:h-[230px]"
        }`}
      >
        <div className="absolute left-[18px] top-[18px] z-10">
          <SiteLogo size={30} tone="light" />
        </div>
        {s.tallBanner ? (
          <p
            aria-hidden="true"
            className="lc-poster absolute bottom-3.5 left-[18px] m-0 text-[38px] leading-[38px] text-[#6a58ee] sm:text-[56px] sm:leading-[54px]"
          >
            {s.poster[0]}
            <br />
            {s.poster[1]}
          </p>
        ) : null}
        <Image
          src={s.src}
          alt=""
          width={s.width}
          height={s.height}
          fetchPriority="high"
          sizes="(min-width: 640px) 160px, 120px"
          className={`absolute bottom-0 w-auto max-w-none ${s.mobileImgCls}`}
        />
      </header>

      {/* FORM */}
      <div className="flex min-h-[calc(100svh-208px)] flex-col px-[18px] pb-8 pt-7 sm:px-10 lg:min-h-screen lg:px-14 lg:py-8">
        <header className="hidden lg:block">
          <SiteLogo size={36} />
        </header>
        <main className="mx-auto flex w-full max-w-[440px] flex-1 flex-col lg:justify-center lg:py-10">{children}</main>
        <footer className="mx-auto mt-12 w-full max-w-[440px] text-[13px] text-[#66647c] lg:mx-0 lg:mt-0 lg:max-w-none">
          <p>
            <span suppressHydrationWarning>© {YEAR}</span> Elmun Technologies LLC ·{" "}
            <Link href="/legal/privacy" className="lc-link transition-colors hover:text-[#5440e8]">
              Privacy
            </Link>{" "}
            ·{" "}
            <Link href="/legal/terms" className="lc-link transition-colors hover:text-[#5440e8]">
              Terms
            </Link>{" "}
            · Need help?{" "}
            <a href="mailto:support@launch-cv.com" className="lc-link font-semibold text-[#4a4862] transition-colors hover:text-[#5440e8]">
              Email us
            </a>
          </p>
        </footer>
      </div>

      {/* DESKTOP STAGE */}
      <aside className="hidden p-4 pl-0 lg:block">
        <div className="relative h-full min-h-[calc(100vh-32px)] overflow-hidden rounded-[36px] bg-[#5440e8]">
          <p
            aria-hidden="true"
            className="lc-poster absolute left-10 top-9 m-0 text-[72px] leading-[70px] text-[#6a58ee] xl:text-[96px] xl:leading-[92px]"
          >
            {s.poster[0]}
            <br />
            {s.poster[1]}
          </p>
          <div aria-hidden="true" className="absolute bottom-[-200px] left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[#4430d6]" />
          <Image
            src={s.src}
            alt={s.alt}
            width={s.width}
            height={s.height}
            fetchPriority="high"
            sizes="360px"
            className={`absolute bottom-0 w-auto max-w-none ${s.imgCls}`}
          />
          {s.sticker ? (
            <span
              aria-hidden="true"
              className="lc-poster absolute right-11 top-[320px] -rotate-6 rounded-full bg-[#ff7a33] px-[15px] py-[9px] text-[13px] text-[#111118]"
            >
              {s.sticker}
            </span>
          ) : null}
          <div className="lc-float absolute inset-x-10 bottom-10 rounded-3xl bg-white px-6 py-[22px] text-[#121226]">{note}</div>
        </div>
      </aside>
    </div>
  );
}

/* ── Shared form pieces ─────────────────────────────────────────────── */

export const authH1Cls = "text-[32px] font-extrabold leading-[36px] tracking-[-0.04em] text-[#121226] lg:text-[44px] lg:leading-[48px]";
/** Smaller H1 for the recovery / verification pages. */
export const authH1SmCls = "text-[32px] font-extrabold leading-[36px] tracking-[-0.04em] text-[#121226] lg:text-[40px] lg:leading-[44px]";
export const authLeadCls = "mt-2.5 text-[16px] leading-6 text-[#4a4862]";
export const authInlineLinkCls = "lc-link font-bold text-[#5440e8] transition-colors hover:text-[#3a2bb8]";

export const authLabelCls = "block text-[14px] font-semibold text-[#121226]";
export const authHintCls = "font-normal text-[#66647c]";

/** 52px tall, 16px text (no iOS zoom). The global v5 focus outline is swapped for a border + ring so the field keeps its shape. */
export const authInputCls =
  "mt-1.5 block h-[52px] w-full rounded-2xl border-[1.5px] border-[#e2e0ea] bg-white px-[18px] text-[16px] text-[#121226] outline-none transition-[border-color,box-shadow] placeholder:text-[#706e88] hover:border-[#c9c0ff] focus:border-[#5440e8] focus:ring-4 focus:ring-[#5440e8]/15 focus-visible:outline-none! focus-visible:rounded-2xl! disabled:opacity-60";

export const authSubmitCls =
  "lc-btn-lift inline-flex h-[54px] w-full items-center justify-center gap-2 rounded-full bg-[#5440e8] px-[26px] text-[16px] font-semibold text-white hover:bg-[#4430d6] focus-visible:rounded-full! disabled:pointer-events-none disabled:opacity-60";

export const authDarkBtnCls =
  "lc-btn-lift inline-flex h-[54px] w-full items-center justify-center gap-2 rounded-full bg-[#111118] px-[26px] text-[16px] font-semibold text-white hover:bg-[#2a2940] focus-visible:rounded-full!";

/** Show/hide password toggle sitting inside the field (44px hit area). */
export const authEyeBtnCls =
  "absolute right-1 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-xl text-[#66647c] transition-colors hover:text-[#121226]";

export function AuthBackLink({ href = "/login", children = "Back to sign in" }: { href?: string; children?: ReactNode }) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-1.5 self-start text-[14px] font-bold text-[#5440e8] transition-colors hover:text-[#3a2bb8]"
    >
      <ArrowLeft className="h-4 w-4 transition-transform motion-safe:group-hover:-translate-x-0.5" aria-hidden="true" />
      {children}
    </Link>
  );
}

/** Error / success message box. Errors are announced assertively, success politely. */
export function AuthNotice({
  tone,
  title,
  children,
  className = "",
  announce = true,
}: {
  tone: "error" | "success";
  title?: ReactNode;
  children?: ReactNode;
  className?: string;
  /** Set false when the notice already sits inside a persistent aria-live region. */
  announce?: boolean;
}) {
  const err = tone === "error";
  const Icon = err ? AlertCircle : CheckCircle2;
  return (
    <div
      role={announce ? (err ? "alert" : "status") : undefined}
      className={`flex items-start gap-3 rounded-2xl px-4 py-3.5 ${err ? "bg-[#fbe2e3] text-[#a3222a]" : "bg-[#dcf5ea] text-[#08603e]"} ${className}`}
    >
      <Icon className="mt-0.5 h-[18px] w-[18px] shrink-0" aria-hidden="true" />
      <div className="min-w-0 text-[14px] leading-[21px]">
        {title ? <p className="font-bold">{title}</p> : null}
        {children}
      </div>
    </div>
  );
}
