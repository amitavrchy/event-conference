"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "magenta";

const variants: Record<Variant, string> = {
  primary:
    "border border-transparent bg-[#c84625] text-white hover:bg-[#ad3a1e] hover:shadow-[0_5px_18px_#ee623e25]",
  secondary:
    "border border-line bg-transparent text-text hover:border-text hover:bg-text/5",
  ghost: "text-muted hover:text-neon",
  magenta: "border border-transparent bg-text text-bg hover:bg-[#42453d]",
};

type Common = {
  children: React.ReactNode;
  className?: string;
  variant?: Variant;
};

type ButtonAsButton = Common &
  React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type ButtonAsLink = Common & {
  href: string;
  target?: string;
  rel?: string;
};

export function Button({
  children,
  className,
  variant = "primary",
  ...props
}: ButtonAsButton | ButtonAsLink) {
  const classes = cn(
    "inline-flex min-h-12 items-center justify-center gap-3 rounded-full px-6 py-3.5 text-sm font-medium tracking-normal transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neon disabled:pointer-events-none disabled:opacity-50",
    variants[variant],
    className,
  );

  if ("href" in props && props.href) {
    const { href, target, rel } = props;
    if (href.startsWith("mailto:") || href.startsWith("http")) {
      return (
        <a
          href={href}
          target={target}
          rel={rel ?? "noopener noreferrer"}
          className={classes}
        >
          {children}
        </a>
      );
    }
    return (
      <Link href={href} target={target} rel={rel} className={classes}>
        {children}
      </Link>
    );
  }

  const buttonProps = props as ButtonAsButton;
  return (
    <button className={classes} {...buttonProps}>
      {children}
    </button>
  );
}
