import Link from "next/link";

import { Logo } from "@/components/logo";
import { Container } from "@/components/ui";
import { site } from "@/config/site";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <Container className="grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2">
          <Logo />
          <p className="mt-3 max-w-sm text-sm text-slate-600">{site.description}</p>
        </div>
        <div>
          <h3 className="text-sm font-semibold">Product</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li><Link href="/#features" className="hover:text-slate-900">Features</Link></li>
            <li><Link href="/pricing/" className="hover:text-slate-900">Pricing</Link></li>
            <li><a href={site.demoUrl} className="hover:text-slate-900">Live demo</a></li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold">Contact</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li><a href={`mailto:${site.contact.sales}`} className="hover:text-slate-900">{site.contact.sales}</a></li>
            <li><a href={`mailto:${site.contact.support}`} className="hover:text-slate-900">{site.contact.support}</a></li>
          </ul>
        </div>
      </Container>
      <div className="border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} {site.name}. All rights reserved.
      </div>
    </footer>
  );
}
