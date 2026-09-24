import type { Metadata } from "next";
import { Suspense } from "react";

import { Checkout } from "@/components/checkout";
import { Container } from "@/components/ui";

export const metadata: Metadata = {
  title: "Get started",
  description: "Choose a plan and set up School Connect for your school.",
};

export default function GetStartedPage() {
  return (
    <section className="bg-slate-50 py-12 sm:py-16">
      <Container>
        <Suspense fallback={<div className="h-[600px]" />}>
          <Checkout />
        </Suspense>
      </Container>
    </section>
  );
}
