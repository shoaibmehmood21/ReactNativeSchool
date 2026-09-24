import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

export function Container({ className = "", children }: { className?: string; children: ReactNode }) {
  return <div className={`mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>;
}

const buttonStyles = {
  primary:
    "bg-blue-700 text-white shadow-sm hover:bg-blue-800 focus-visible:outline-blue-700 disabled:bg-blue-300",
  secondary:
    "bg-white text-slate-900 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus-visible:outline-blue-700",
  ghost: "text-slate-700 hover:bg-slate-100 focus-visible:outline-blue-700",
};

export type ButtonVariant = keyof typeof buttonStyles;

export function buttonClass(variant: ButtonVariant = "primary", size: "md" | "lg" = "md") {
  const sizing = size === "lg" ? "px-5 py-3 text-base" : "px-4 py-2 text-sm";
  return `inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed ${sizing} ${buttonStyles[variant]}`;
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ComponentProps<typeof Link> & { variant?: ButtonVariant; size?: "md" | "lg" }) {
  return <Link {...props} className={`${buttonClass(variant, size)} ${className}`} />;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="text-sm font-semibold uppercase tracking-wider text-blue-700">{eyebrow}</p>
      <h2 className="mt-2 text-3xl font-bold tracking-tight text-balance sm:text-4xl">{title}</h2>
      {description && <p className="mt-4 text-lg text-pretty text-slate-600">{description}</p>}
    </div>
  );
}

export function SoonBadge() {
  return (
    <span className="ml-2 inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap text-amber-700 ring-1 ring-amber-200 ring-inset">
      Coming soon
    </span>
  );
}
