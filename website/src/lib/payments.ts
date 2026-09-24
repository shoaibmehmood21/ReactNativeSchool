import { type Billing, type Plan, type PlanId, bankTransfer, plans, site } from "@/config/site";

/**
 * Payment methods offered at checkout. Only bank transfer works today; when a
 * card processor is chosen, implement its checkout in `startCardCheckout` and
 * flip `available` to true.
 */
export type PaymentMethodId = "bank_transfer" | "card";

export const paymentMethods: {
  id: PaymentMethodId;
  label: string;
  description: string;
  available: boolean;
}[] = [
  {
    id: "bank_transfer",
    label: "Bank transfer",
    description: "Transfer to our account and email us the payment slip.",
    available: true,
  },
  {
    id: "card",
    label: "Credit / debit card",
    description: "Pay instantly by card.",
    available: false,
  },
];

export type SchoolDetails = {
  schoolName: string;
  contactName: string;
  role: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  students: string;
  message: string;
};

export type Order = {
  reference: string;
  planId: PlanId;
  billing: Billing;
  amount: number;
  currency: string;
  paymentMethod: PaymentMethodId;
  school: SchoolDetails;
  createdAt: string;
};

export function getPlan(id: string | null | undefined): Plan {
  return plans.find((p) => p.id === id) ?? plans[1];
}

export function planAmount(plan: Plan, billing: Billing): number {
  return plan.price ? plan.price[billing] : 0;
}

export function formatMoney(amount: number): string {
  return new Intl.NumberFormat(site.locale, {
    style: "currency",
    currency: site.currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

function newReference(now: Date): string {
  const yy = String(now.getFullYear()).slice(2);
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const random = Math.random().toString(36).slice(2, 6).toUpperCase().padEnd(4, "0");
  return `SC-${yy}${mm}${dd}-${random}`;
}

export function createOrder(
  plan: Plan,
  billing: Billing,
  paymentMethod: PaymentMethodId,
  school: SchoolDetails,
): Order {
  const now = new Date();
  return {
    reference: newReference(now),
    planId: plan.id,
    billing,
    amount: planAmount(plan, billing),
    currency: site.currency,
    paymentMethod,
    school,
    createdAt: now.toISOString(),
  };
}

/**
 * Sends the order to the configured webhook, if any. Returns true when the
 * school's request reached us without the customer having to email it.
 */
export async function submitOrder(order: Order): Promise<boolean> {
  if (!site.orderWebhookUrl) return false;
  try {
    // Sent as text/plain so the browser skips the CORS preflight, which Google
    // Apps Script (and many webhook services) don't answer. The body is JSON.
    const response = await fetch(site.orderWebhookUrl, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(order),
    });
    if (!response.ok) return false;
    const result = (await response.json().catch(() => null)) as { ok?: boolean } | null;
    // Apps Script always answers 200; it reports failures in the body.
    return result?.ok !== false;
  } catch {
    return false;
  }
}

/** A mailto: link carrying the order details, addressed to the right team. */
export function orderEmailLink(order: Order): string {
  const plan = getPlan(order.planId);
  const paid = order.amount > 0;
  const to = plan.price === null ? site.contact.sales : paid ? site.contact.billing : site.contact.support;
  const subject = paid
    ? `Payment slip – ${order.reference} – ${order.school.schoolName}`
    : plan.price === null
      ? `Enterprise enquiry – ${order.school.schoolName}`
      : `Free plan sign-up – ${order.school.schoolName}`;

  const lines = [
    paid ? "Please find our payment slip attached." : "We'd like to get started with School Connect.",
    "",
    `Reference: ${order.reference}`,
    `Plan: ${plan.name}${plan.price ? ` (${order.billing})` : ""}`,
    ...(paid ? [`Amount: ${formatMoney(order.amount)}`] : []),
    "",
    `School: ${order.school.schoolName}`,
    `Contact: ${order.school.contactName}${order.school.role ? ` (${order.school.role})` : ""}`,
    `Email: ${order.school.email}`,
    `Phone: ${order.school.phone}`,
    `Location: ${[order.school.city, order.school.country].filter(Boolean).join(", ")}`,
    `Students: ${order.school.students}`,
    ...(order.school.message ? ["", order.school.message] : []),
  ];

  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`;
}

export { bankTransfer };
