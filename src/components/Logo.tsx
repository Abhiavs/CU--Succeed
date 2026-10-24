"use client";

import Link from "next/link";
import React from "react";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  textClassName?: string;
  href?: string;
  subtitle?: string;
}

const SIZES = {
  sm: { px: 28, box: "w-7 h-7" },
  md: { px: 36, box: "w-9 h-9" },
  lg: { px: 46, box: "w-11 h-11" },
  xl: { px: 56, box: "w-14 h-14" },
};

export function LogoIcon({ size = 36, className = "" }: { size?: number; className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/cu-succeed-logo.png"
      alt="CU-SUCCEED Logo"
      width={size}
      height={size}
      className={`flex-shrink-0 object-contain ${className}`}
    />
  );
}

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
        <span className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-none text-[#006f73]">
          CU-SUCCEED
        </span>
      </div>

      {showTagline && (
        <span className="mt-2 pl-[0.25em] text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.25em] text-[#6fbf58]">
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
}: LogoProps): React.JSX.Element {
  const { px } = SIZES[size];

  const content = (
    <div className={`flex items-center gap-3 ${className}`}>
      <LogoIcon size={px} />

      {showText && (
        <div className="flex flex-col select-none">
          <div
            className={`font-black tracking-tight text-[#006f73] leading-none ${
              size === "sm" ? "text-base" : size === "lg" || size === "xl" ? "text-2xl" : "text-xl"
            } ${textClassName}`}
          >
            CU-<span className="text-[#6fbf58]">SUCCEED</span>
          </div>
          {subtitle && (
            <span className="text-[10px] font-semibold text-gray-500 tracking-wider uppercase leading-tight mt-1">
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}

export default Logo;
