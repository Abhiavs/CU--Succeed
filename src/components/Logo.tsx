"use client";

import Link from "next/link";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  textClassName?: string;
  href?: string;
  subtitle?: string;
}

const SIZES = {
  sm: { px: 26, box: "w-7 h-7" },
  md: { px: 34, box: "w-9 h-9" },
  lg: { px: 42, box: "w-11 h-11" },
  xl: { px: 52, box: "w-14 h-14" },
};

// The official CU-SUCCEED mark, taken from the brand icon set in `favicon_io/`
// (android-chrome-192x192.png). It has a transparent background, so the same
// asset reads correctly on both the light and the dark surface.
export function LogoIcon({ size = 36, className = "" }: { size?: number; className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/cu-succeed-logo.png"
      alt=""
      aria-hidden="true"
      width={size}
      height={size}
      className={`flex-shrink-0 ${className}`}
    />
  );
}

// The stacked brand lockup shown at the top of the marketing pages: the mark,
// the "CU-SUCCEED" wordmark, and the GROW • CHANGE • SUCCEED tagline beneath.
export function BrandLockup({
  iconSize = 60,
  showTagline = true,
  className = "",
}: {
  iconSize?: number;
  showTagline?: boolean;
  className?: string;
}) {
  return (
    <div className={`flex flex-col items-center select-none ${className}`}>
      <div className="flex items-center gap-3">
        <LogoIcon size={iconSize} />
        <span className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-none text-[#197368] dark:text-[#66a770]">
          CU-SUCCEED
        </span>
      </div>

      {showTagline && (
        // The trailing letter-spacing needs a matching left pad, otherwise the
        // line reads as if it were shifted left of the wordmark above it.
        <span className="mt-2 pl-[0.25em] text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.25em] text-[#409d78] dark:text-[#89b6a6]">
          Grow • Change • Succeed
        </span>
      )}
    </div>
  );
}

export function Logo({
  className = "",
  size = "md",
  showText = true,
  textClassName = "",
  href,
  subtitle,
}: LogoProps) {
  const { px } = SIZES[size];

  const content = (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <LogoIcon size={px} />

      {showText && (
        <div className="flex flex-col select-none">
          <div
            className={`font-bold tracking-tight text-slate-900 dark:text-white leading-tight ${
              size === "sm" ? "text-sm" : size === "lg" || size === "xl" ? "text-lg" : "text-base"
            } ${textClassName}`}
          >
            CU-<span className="text-[#197368] dark:text-[#66a770] font-semibold">SUCCEED</span>
          </div>
          {subtitle && (
            <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 tracking-wide uppercase leading-tight mt-0.5">
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex items-center group transition-opacity hover:opacity-90">
        {content}
      </Link>
    );
  }

  return content;
}

export default Logo;
