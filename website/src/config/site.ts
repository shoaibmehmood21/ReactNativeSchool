/**
 * Everything a non-developer is likely to change lives here: company details,
 * plans and prices, payment instructions, and the FAQ.
 */

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const site = {
  name: "School Connect",
  tagline: "The parent–school communication platform",
  description:
    "School Connect gives parents one app to follow their child's progress, read report cards and raise concerns — and gives schools the tools to answer every one of them.",

  /** Where "Live demo" and "Log in" point. */
  demoUrl: process.env.NEXT_PUBLIC_DEMO_URL ?? `${basePath}/app/`,

  contact: {
    // Replace with real addresses before launch.
    sales: "sales@example.com",
    billing: "billing@example.com",
    support: "support@example.com",
  },

  /**
   * Optional: an HTTPS endpoint that receives each order as JSON (for example a
   * Google Apps Script, Zapier/Make webhook, or your own API). Leave empty to
   * rely on the customer emailing the order details and payment slip.
   */
  orderWebhookUrl: process.env.NEXT_PUBLIC_ORDER_WEBHOOK_URL ?? "",

  currency: "USD",
  locale: "en-US",
} as const;

/** Bank transfer instructions shown after a customer places a paid order. */
export const bankTransfer = {
  // Set to false once the details below are real.
  isSample: true,
  accountTitle: "Your Company Name",
  bankName: "Your Bank",
  accountNumber: "0000 0000 0000 0000",
  iban: "XX00 XXXX 0000 0000 0000 0000",
  swift: "XXXXXXXX",
  branch: "Main Branch",
  /** Business days to verify a payment and set up the school. */
  setupDays: 2,
};

export type PlanId = "free" | "basic" | "enterprise";
export type Billing = "monthly" | "yearly";

export type Plan = {
  id: PlanId;
  name: string;
  tagline: string;
  /** null = custom pricing (contact sales). */
  price: { monthly: number; yearly: number } | null;
  students: string;
  cta: string;
  popular?: boolean;
  highlights: string[];
};

export const plans: Plan[] = [
  {
    id: "free",
    name: "Free",
    tagline: "Try School Connect with a small school or a single class.",
    price: { monthly: 0, yearly: 0 },
    students: "Up to 50 students",
    cta: "Start for free",
    highlights: [
      "Parent mobile app (Android, iOS, web)",
      "Announcements",
      "Complaints, suggestions & appreciation",
      "Conversation tracking with status",
      "2 staff accounts",
      "Community support",
    ],
  },
  {
    id: "basic",
    name: "Basic",
    tagline: "Everything a single school needs to run parent communication.",
    price: { monthly: 49, yearly: 490 },
    students: "Up to 500 students",
    cta: "Choose Basic",
    popular: true,
    highlights: [
      "Everything in Free",
      "Student progress & attendance",
      "Report cards with parent feedback",
      "Teacher & teacher-assistant roles",
      "Unlimited staff accounts",
      "Email support",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    tagline: "For school groups, large campuses and custom needs.",
    price: null,
    students: "Unlimited students & campuses",
    cta: "Talk to sales",
    highlights: [
      "Everything in Basic",
      "Multiple campuses under one account",
      "Supervisor, accountant & counselor roles",
      "Principal analytics dashboard",
      "Your school's own branded app",
      "Dedicated onboarding & priority support",
    ],
  },
];

type Cell = boolean | string;

export type FeatureRow = {
  label: string;
  free: Cell;
  basic: Cell;
  enterprise: Cell;
  /** Shown with a "Coming soon" badge until it ships. */
  soon?: boolean;
};

export const comparison: { group: string; rows: FeatureRow[] }[] = [
  {
    group: "Parents",
    rows: [
      { label: "Parent app on Android, iOS and web", free: true, basic: true, enterprise: true },
      { label: "Multiple children per parent", free: true, basic: true, enterprise: true },
      { label: "Announcements", free: true, basic: true, enterprise: true },
      { label: "Progress, grades & attendance", free: false, basic: true, enterprise: true },
      { label: "Report cards", free: false, basic: true, enterprise: true },
      { label: "Push notifications", free: true, basic: true, enterprise: true, soon: true },
      { label: "Online fee payment", free: false, basic: false, enterprise: true, soon: true },
    ],
  },
  {
    group: "Feedback & complaints",
    rows: [
      { label: "Complaints, suggestions & appreciation", free: true, basic: true, enterprise: true },
      { label: "Anonymous submissions", free: true, basic: true, enterprise: true },
      { label: "Status tracking & replies", free: true, basic: true, enterprise: true },
      { label: "Feedback on report cards", free: false, basic: true, enterprise: true },
      { label: "Auto-assignment, deadlines & escalation", free: false, basic: true, enterprise: true, soon: true },
      { label: "Confidential safeguarding channel", free: false, basic: false, enterprise: true, soon: true },
    ],
  },
  {
    group: "School staff",
    rows: [
      { label: "Staff accounts", free: "2", basic: "Unlimited", enterprise: "Unlimited" },
      { label: "Admin web portal", free: true, basic: true, enterprise: true, soon: true },
      { label: "Teacher & teacher-assistant roles", free: false, basic: true, enterprise: true, soon: true },
      { label: "Supervisor, accountant & counselor roles", free: false, basic: false, enterprise: true, soon: true },
      { label: "Principal analytics dashboard", free: false, basic: false, enterprise: true, soon: true },
    ],
  },
  {
    group: "Account & support",
    rows: [
      { label: "Students", free: "50", basic: "500", enterprise: "Unlimited" },
      { label: "Campuses", free: "1", basic: "1", enterprise: "Unlimited" },
      { label: "Data import from Excel", free: false, basic: true, enterprise: true },
      { label: "Branded app with your school's name", free: false, basic: false, enterprise: true },
      { label: "Support", free: "Community", basic: "Email", enterprise: "Dedicated manager" },
    ],
  },
];

export const faqs: { q: string; a: string }[] = [
  {
    q: "How do we pay?",
    a: "For now we accept bank transfer. After you choose a plan you'll see our bank details and an order reference. Transfer the amount, email the payment slip with your reference, and we'll activate your school. Card payments are coming soon.",
  },
  {
    q: "How long does setup take?",
    a: `Usually ${bankTransfer.setupDays} business days after we receive your payment slip. We import your students and staff from Excel and send login details to your administrator.`,
  },
  {
    q: "Can we start on Free and upgrade later?",
    a: "Yes. Everything you set up on Free carries over when you upgrade — no data is lost.",
  },
  {
    q: "What happens if we go over the student limit?",
    a: "We'll let you know and help you move to the right plan. We never cut off parents mid-term.",
  },
  {
    q: "Do parents pay anything?",
    a: "No. The school's subscription covers every parent and student account.",
  },
  {
    q: "Is our data safe?",
    a: "Each school's data is kept separate and is only visible to the people you give access to. You can export or delete your data at any time.",
  },
  {
    q: "Is there a discount for yearly billing?",
    a: "Yes — paying yearly gets you roughly two months free compared with monthly billing.",
  },
];
