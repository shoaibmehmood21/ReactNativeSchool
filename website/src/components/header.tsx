"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Logo } from "@/components/logo";
import { ButtonLink, Container, buttonClass } from "@/components/ui";
import { site } from "@/config/site";

const links = [
  { href: "/#features", label: "Features" },
  { href: "/#roles", label: "For schools" },
  { href: "/pricing/", label: "Pricing" },
  { href: "/pricing/#faq", label: "FAQ" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/85 backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Logo />
        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          <a href={site.demoUrl} className={buttonClass("ghost")}>
            Live demo
          </a>
          <ButtonLink href="/get-started/?plan=free">Get started</ButtonLink>
        </div>
        <button
          type="button"
          className="rounded-md p-2 text-slate-700 md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </Container>
      {open && (
        <div className="border-t border-slate-200 bg-white md:hidden">
          <Container className="flex flex-col gap-1 py-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-2 grid grid-cols-2 gap-2">
              <a href={site.demoUrl} className={buttonClass("secondary")}>
                Live demo
              </a>
              <ButtonLink href="/get-started/?plan=free" onClick={() => setOpen(false)}>
                Get started
              </ButtonLink>
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}
