import type { Metadata } from "next";

import { ComparisonTable } from "@/components/comparison-table";
import { Faq } from "@/components/faq";
import { PricingCards } from "@/components/pricing-cards";
import { Container, SectionHeading } from "@/components/ui";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Free, Basic and Enterprise plans for schools of every size. Parents never pay.",
};

export default function PricingPage() {
  return (
    <>
      <section className="bg-gradient-to-b from-blue-50 to-white py-16 sm:py-20">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Plans for every school</h1>
            <p className="mt-4 text-lg text-slate-600">
              Start free. Upgrade when you need progress tracking, report cards and more staff. Parents never pay.
            </p>
          </div>
          <div className="mt-12">
            <PricingCards />
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <SectionHeading eyebrow="Compare" title="What's in each plan" />
          <div className="mt-8">
            <ComparisonTable />
          </div>
        </Container>
      </section>

      <section id="faq" className="bg-slate-50 py-16">
        <Container>
          <SectionHeading eyebrow="FAQ" title="Questions schools ask" />
          <div className="mt-10">
            <Faq />
          </div>
        </Container>
      </section>
    </>
  );
}
