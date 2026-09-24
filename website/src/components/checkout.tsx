"use client";

import { Building2, Check, CheckCircle2, Copy, CreditCard, Landmark, Mail } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { type FormEvent, useState } from "react";

import { BillingToggle } from "@/components/pricing-cards";
import { buttonClass } from "@/components/ui";
import { type Billing, type Plan, plans, site } from "@/config/site";
import {
  type Order,
  type PaymentMethodId,
  type SchoolDetails,
  bankTransfer,
  createOrder,
  formatMoney,
  getPlan,
  orderEmailLink,
  paymentMethods,
  planAmount,
  submitOrder,
} from "@/lib/payments";

const emptyDetails: SchoolDetails = {
  schoolName: "",
  contactName: "",
  role: "Principal",
  email: "",
  phone: "",
  city: "",
  country: "",
  students: "",
  message: "",
};

const inputClass =
  "mt-1.5 block w-full rounded-lg border-0 bg-white px-3 py-2.5 text-slate-900 ring-1 ring-slate-300 ring-inset placeholder:text-slate-400 focus:ring-2 focus:ring-blue-700 focus:ring-inset";

export function Checkout() {
  const params = useSearchParams();
  const [plan, setPlan] = useState<Plan>(() => getPlan(params.get("plan")));
  const [billing, setBilling] = useState<Billing>(params.get("billing") === "monthly" ? "monthly" : "yearly");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodId>("bank_transfer");
  const [details, setDetails] = useState<SchoolDetails>(emptyDetails);
  const [submitting, setSubmitting] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [delivered, setDelivered] = useState(false);

  const amount = planAmount(plan, billing);
  const isPaid = amount > 0;
  const isEnterprise = plan.price === null;

  function update(field: keyof SchoolDetails) {
    return (e: { target: { value: string } }) => setDetails((d) => ({ ...d, [field]: e.target.value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const next = createOrder(plan, billing, paymentMethod, details);
    setDelivered(await submitOrder(next));
    setOrder(next);
    setSubmitting(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (order) return <Confirmation order={order} delivered={delivered} onBack={() => setOrder(null)} />;

  return (
    <div>
      <div className="max-w-2xl">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          {isEnterprise ? "Talk to our team" : "Set up School Connect"}
        </h1>
        <p className="mt-3 text-lg text-slate-600">
          {isEnterprise
            ? "Tell us about your schools and we'll put together a plan and quote."
            : "Tell us about your school. We'll import your data and have you running in a couple of days."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-8">
          {/* Plan */}
          <fieldset className="rounded-2xl bg-white p-6 ring-1 ring-slate-200">
            <legend className="sr-only">Plan</legend>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-semibold">1. Plan</h2>
              {plan.price && plan.price.monthly > 0 && <BillingToggle value={billing} onChange={setBilling} />}
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {plans.map((p) => {
                const selected = p.id === plan.id;
                return (
                  <label
                    key={p.id}
                    className={`cursor-pointer rounded-xl p-4 ring-1 transition ${
                      selected ? "bg-blue-50 ring-2 ring-blue-700" : "ring-slate-200 hover:ring-slate-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="plan"
                      value={p.id}
                      checked={selected}
                      onChange={() => setPlan(p)}
                      className="sr-only"
                    />
                    <span className="flex items-center justify-between font-semibold">
                      {p.name}
                      {selected && <Check className="size-4 text-blue-700" aria-hidden />}
                    </span>
                    <span className="mt-1 block text-sm text-slate-600">
                      {p.price ? (p.price.monthly === 0 ? "Free" : `${formatMoney(p.price[billing])}/${billing === "monthly" ? "mo" : "yr"}`) : "Custom"}
                    </span>
                    <span className="mt-1 block text-xs text-slate-500">{p.students}</span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          {/* School details */}
          <fieldset className="rounded-2xl bg-white p-6 ring-1 ring-slate-200">
            <legend className="sr-only">School details</legend>
            <h2 className="text-lg font-semibold">2. Your school</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="School name" className="sm:col-span-2">
                <input required className={inputClass} value={details.schoolName} onChange={update("schoolName")} autoComplete="organization" />
              </Field>
              <Field label="Your name">
                <input required className={inputClass} value={details.contactName} onChange={update("contactName")} autoComplete="name" />
              </Field>
              <Field label="Your role">
                <select className={inputClass} value={details.role} onChange={update("role")}>
                  {["Owner", "Principal", "Administrator", "IT / Operations", "Other"].map((r) => (
                    <option key={r}>{r}</option>
                  ))}
                </select>
              </Field>
              <Field label="Work email">
                <input required type="email" className={inputClass} value={details.email} onChange={update("email")} autoComplete="email" />
              </Field>
              <Field label="Phone">
                <input required type="tel" className={inputClass} value={details.phone} onChange={update("phone")} autoComplete="tel" />
              </Field>
              <Field label="City">
                <input className={inputClass} value={details.city} onChange={update("city")} autoComplete="address-level2" />
              </Field>
              <Field label="Country">
                <input className={inputClass} value={details.country} onChange={update("country")} autoComplete="country-name" />
              </Field>
              <Field label="Number of students">
                <input required type="number" min={1} inputMode="numeric" className={inputClass} value={details.students} onChange={update("students")} />
              </Field>
              <Field label={isEnterprise ? "Tell us what you need" : "Anything we should know? (optional)"} className="sm:col-span-2">
                <textarea
                  rows={3}
                  required={isEnterprise}
                  className={inputClass}
                  value={details.message}
                  onChange={update("message")}
                  placeholder={isEnterprise ? "Number of campuses, features you need, timeline…" : ""}
                />
              </Field>
            </div>
          </fieldset>

          {/* Payment */}
          {isPaid && (
            <fieldset className="rounded-2xl bg-white p-6 ring-1 ring-slate-200">
              <legend className="sr-only">Payment method</legend>
              <h2 className="text-lg font-semibold">3. Payment method</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {paymentMethods.map((m) => {
                  const selected = m.id === paymentMethod;
                  const Icon = m.id === "card" ? CreditCard : Landmark;
                  return (
                    <label
                      key={m.id}
                      className={`flex gap-3 rounded-xl p-4 ring-1 transition ${
                        !m.available
                          ? "cursor-not-allowed opacity-60 ring-slate-200"
                          : selected
                            ? "cursor-pointer bg-blue-50 ring-2 ring-blue-700"
                            : "cursor-pointer ring-slate-200 hover:ring-slate-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={m.id}
                        checked={selected}
                        disabled={!m.available}
                        onChange={() => setPaymentMethod(m.id)}
                        className="sr-only"
                      />
                      <Icon className="size-5 flex-none text-blue-700" aria-hidden />
                      <span>
                        <span className="block font-semibold">
                          {m.label}
                          {!m.available && <span className="ml-2 text-xs font-medium text-amber-700">Coming soon</span>}
                        </span>
                        <span className="mt-0.5 block text-sm text-slate-600">{m.description}</span>
                      </span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
          )}
        </div>

        {/* Summary */}
        <aside className="h-fit rounded-2xl bg-white p-6 ring-1 ring-slate-200 lg:sticky lg:top-24">
          <h2 className="text-lg font-semibold">Summary</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <Row label="Plan" value={plan.name} />
            {plan.price && isPaid && <Row label="Billing" value={billing === "monthly" ? "Monthly" : "Yearly"} />}
            <Row label="Includes" value={plan.students} />
          </dl>
          <div className="mt-4 flex items-baseline justify-between border-t border-slate-200 pt-4">
            <span className="font-semibold">{isEnterprise ? "Price" : "Total due"}</span>
            <span className="text-2xl font-bold">{isEnterprise ? "Custom quote" : formatMoney(amount)}</span>
          </div>
          <button type="submit" disabled={submitting} className={`${buttonClass("primary", "lg")} mt-6 w-full`}>
            {submitting ? "Please wait…" : isEnterprise ? "Request a quote" : isPaid ? "Place order" : "Create free account"}
          </button>
          <p className="mt-3 text-xs text-slate-500">
            {isPaid
              ? "You'll get bank transfer details and an order reference on the next screen."
              : "No payment needed. We'll get back to you to set things up."}
          </p>
        </aside>
      </form>
    </div>
  );
}

function Confirmation({ order, delivered, onBack }: { order: Order; delivered: boolean; onBack: () => void }) {
  const plan = getPlan(order.planId);
  const isPaid = order.amount > 0;
  const emailLink = orderEmailLink(order);
  const emailTo = plan.price === null ? site.contact.sales : isPaid ? site.contact.billing : site.contact.support;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="text-center">
        <CheckCircle2 className="mx-auto size-14 text-emerald-600" aria-hidden />
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight">
          {isPaid ? "Order placed — one step left" : delivered ? "Request received" : "Almost done"}
        </h1>
        <p className="mt-3 text-lg text-slate-600">
          {isPaid
            ? "Transfer the amount below, then email us your payment slip. We'll activate your school once it's verified."
            : delivered
              ? `Thanks, ${order.school.contactName}. We'll be in touch at ${order.school.email} shortly.`
              : "Send us your details by email and we'll get your school set up."}
        </p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Stat label="Order reference" value={order.reference} copy />
        <Stat label="Plan" value={`${plan.name}${plan.price && isPaid ? ` · ${order.billing}` : ""}`} />
        <Stat label={isPaid ? "Amount due" : "Price"} value={plan.price === null ? "Custom" : formatMoney(order.amount)} />
      </div>

      {isPaid && (
        <div className="mt-6 rounded-2xl bg-white p-6 ring-1 ring-slate-200">
          <div className="flex items-center gap-2">
            <Building2 className="size-5 text-blue-700" aria-hidden />
            <h2 className="text-lg font-semibold">Bank transfer details</h2>
          </div>
          {bankTransfer.isSample && (
            <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800 ring-1 ring-amber-200">
              Sample details for preview — please don&apos;t transfer money to this account.
            </p>
          )}
          <dl className="mt-4 divide-y divide-slate-100 text-sm">
            <BankRow label="Account title" value={bankTransfer.accountTitle} />
            <BankRow label="Bank" value={bankTransfer.bankName} />
            <BankRow label="Account number" value={bankTransfer.accountNumber} copy />
            <BankRow label="IBAN" value={bankTransfer.iban} copy />
            <BankRow label="SWIFT / BIC" value={bankTransfer.swift} copy />
            <BankRow label="Branch" value={bankTransfer.branch} />
            <BankRow label="Payment remark" value={order.reference} copy />
          </dl>
        </div>
      )}

      <ol className="mt-6 space-y-4 rounded-2xl bg-white p-6 ring-1 ring-slate-200">
        {(isPaid
          ? [
              `Transfer ${formatMoney(order.amount)} and write ${order.reference} as the payment remark.`,
              `Email the payment slip to ${emailTo} — the button below fills in your order details.`,
              `We verify the payment and set up your school within ${bankTransfer.setupDays} business days, then email your admin login.`,
            ]
          : delivered
            ? ["We review your request.", "We contact you to import your students and staff.", "You invite parents and go live."]
            : [
                `Email your details to ${emailTo} — the button below fills them in for you.`,
                "We contact you to import your students and staff.",
                "You invite parents and go live.",
              ]
        ).map((step, i) => (
          <li key={step} className="flex gap-3">
            <span className="flex size-6 flex-none items-center justify-center rounded-full bg-blue-700 text-xs font-bold text-white">
              {i + 1}
            </span>
            <span className="text-slate-700">{step}</span>
          </li>
        ))}
      </ol>

      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        {!(delivered && !isPaid) && (
          <a href={emailLink} className={buttonClass("primary", "lg")}>
            <Mail className="size-5" aria-hidden />
            {isPaid ? "Email payment slip" : "Send details by email"}
          </a>
        )}
        <button type="button" onClick={onBack} className={buttonClass("secondary", "lg")}>
          Change order
        </button>
      </div>
      <p className="mt-6 text-center text-sm text-slate-500">
        Questions? <a href={`mailto:${site.contact.support}`} className="font-medium text-blue-700">{site.contact.support}</a>
      </p>
    </div>
  );
}

function Field({ label, className = "", children }: { label: string; className?: string; children: React.ReactNode }) {
  return (
    <label className={`block text-sm font-medium text-slate-800 ${className}`}>
      {label}
      {children}
    </label>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-slate-500">{label}</dt>
      <dd className="text-right font-medium">{value}</dd>
    </div>
  );
}

function Stat({ label, value, copy }: { label: string; value: string; copy?: boolean }) {
  return (
    <div className="rounded-2xl bg-white p-4 text-center ring-1 ring-slate-200">
      <p className="text-xs font-medium tracking-wide text-slate-500 uppercase">{label}</p>
      <p className="mt-1 flex items-center justify-center gap-2 text-lg font-bold capitalize">
        {value}
        {copy && <CopyButton value={value} label={label} />}
      </p>
    </div>
  );
}

function BankRow({ label, value, copy }: { label: string; value: string; copy?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5">
      <dt className="text-slate-500">{label}</dt>
      <dd className="flex items-center gap-2 text-right font-medium">
        <span className="font-mono">{value}</span>
        {copy && <CopyButton value={value} label={label} />}
      </dd>
    </div>
  );
}

function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      aria-label={`Copy ${label}`}
      className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        } catch {
          // Clipboard can be unavailable (e.g. insecure context); the value is still visible.
        }
      }}
    >
      {copied ? <Check className="size-4 text-emerald-600" /> : <Copy className="size-4" />}
    </button>
  );
}
