import Image from "next/image";

/**
 * A framed product screenshot rendered with next/image.
 *
 * All illustrations under /public/images/product are authored at 1600×900, so
 * width/height are fixed here to reserve the correct aspect ratio and avoid
 * layout shift. next/image serves local `.svg` sources unoptimized and lazy-
 * loads by default (no `priority`), which keeps these below-the-fold shots off
 * the critical path. `alt` is required so no screenshot ships without a
 * meaningful, descriptive alternative text.
 */
export function ProductScreenshot({
  src,
  alt,
  caption,
  className,
}: {
  src: string;
  alt: string;
  caption?: string;
  className?: string;
}) {
  return (
    <figure className={className}>
      <div className="overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-[0_30px_60px_-25px_rgba(15,23,42,0.25)]">
        <Image
          src={src}
          alt={alt}
          width={1600}
          height={900}
          sizes="(max-width: 1024px) 100vw, 1024px"
          className="h-auto w-full"
        />
      </div>
      {caption ? (
        <figcaption className="mt-3 text-center font-body text-[13px] leading-[1.6] text-[#94A3B8]">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
