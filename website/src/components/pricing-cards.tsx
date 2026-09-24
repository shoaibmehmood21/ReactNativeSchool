"use client";

import { Check } from "lucide-react";
import { useState } from "react";

import { ButtonLink } from "@/components/ui";
import { type Billing, plans } from "@/config/site";
import { formatMoney } from "@/lib/payments";

export function BillingToggle({ value, onChange }: { value: Billing; onChange: (b: Billing) => void }) {
  return (
    <div className="inline-flex items-center rounded-full bg-slate-100 p-1 text-sm font-semibold" role="radiogroup" aria-label="Billing period">
      {(["monthly", "yearly"] as const).map((option) => (
        <button
          key={option}
          type="button"
          role="radio"
          aria-checked={value === option}
          onClick={() => onChange(option)}
          className={`rounded-full px-4 py-1.5 transition ${
            value === option ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
          }`}
        >
          {option === "monthly" ? "Monthly" : "Yearly"}
          {option === "yearly" && <span className="ml-1.5 text-xs text-emerald-600">2 months free</span>}
        </button>
      ))}
    </div>
  );
}

export function PricingCards() {
  const [billing, setBilling] = useState<Billing>("yearly");

  return (
    <div>
      <div className="flex justify-center">
        <BillingToggle value={billing} onChange={setBilling} />
      </div>
      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`relative flex flex-col rounded-2xl bg-white p-8 ${
              plan.popular ? "shadow-xl ring-2 shadow-blue-900/10 ring-blue-700" : "ring-1 ring-slate-200"
            }`}
          >
            {plan.popular && (
              <span className="absolute -top-3 left-8 rounded-full bg-blue-700 px-3 py-1 text-xs font-semibold text-white">
                Most popular
              </span>
            )}
            <h3 className="text-lg font-semibold">{plan.name}</h3>
            <p className="mt-2 min-h-12 text-sm text-slate-600">{plan.tagline}</p>
            <div className="mt-6 flex items-baseline gap-1">
              {plan.price ? (
                <>
                  <span className="text-4xl font-bold tracking-tight">{formatMoney(plan.price[billing])}</span>
                  <span className="text-sm text-slate-500">
                    {plan.price.monthly === 0 ? "forever" : `/${billing === "monthly" ? "month" : "year"}`}
                  </span>
                </>
              ) : (
                <span className="text-4xl font-bold tracking-tight">Custom</span>
              )}
            </div>
            <p className="mt-1 text-sm font-medium text-blue-700">{plan.students}</p>
            <ButtonLink
              href={`/get-started/?plan=${plan.id}&billing=${billing}`}
              variant={plan.popular ? "primary" : "secondary"}
              className="mt-6 w-full"
            >
              {plan.cta}
            </ButtonLink>
            <ul className="mt-8 space-y-3 text-sm text-slate-700">
              {plan.highlights.map((item) => (
                <li key={item} className="flex gap-3">
                  <Check className="size-5 flex-none text-blue-700" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
