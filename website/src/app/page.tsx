import {
  BarChart3,
  Bell,
  BookOpenCheck,
  Briefcase,
  ClipboardCheck,
  EyeOff,
  FileText,
  GraduationCap,
  HeartHandshake,
  type LucideIcon,
  MessageSquareWarning,
  MessagesSquare,
  ShieldCheck,
  Upload,
  UserCog,
  Users,
  Wallet,
} from "lucide-react";

import { Phone } from "@/components/phone";
import { PricingCards } from "@/components/pricing-cards";
import { ButtonLink, Container, SectionHeading, SoonBadge, buttonClass } from "@/components/ui";
import { site } from "@/config/site";

import conversationShot from "@/assets/screens/conversation.png";
import homeShot from "@/assets/screens/home.png";
import progressShot from "@/assets/screens/progress.png";
import reportShot from "@/assets/screens/report.png";

const problems = [
  {
    before: "Parents message teachers on WhatsApp at all hours.",
    after: "One app with office hours — teachers keep their personal numbers private.",
  },
  {
    before: "Complaints get lost between the front desk and the principal.",
    after: "Every concern gets a status, an owner and a reply parents can see.",
  },
  {
    before: "Report cards are printed, sent home and never discussed.",
    after: "Parents read reports on their phone and send feedback to the teacher.",
  },
];

const features: { icon: LucideIcon; title: string; body: string; soon?: boolean }[] = [
  {
    icon: MessageSquareWarning,
    title: "Complaints & suggestions",
    body: "Parents raise concerns by category and child. Schools reply, and everyone sees the status move from submitted to resolved.",
  },
  {
    icon: EyeOff,
    title: "Anonymous when it matters",
    body: "Parents can raise sensitive issues without their name attached, so problems surface early.",
  },
  {
    icon: BarChart3,
    title: "Progress at a glance",
    body: "Overall score, attendance and every subject's grade, trend and teacher remark — for each child.",
  },
  {
    icon: FileText,
    title: "Report cards with feedback",
    body: "Digital report cards parents can rate and comment on, so the conversation doesn't end at the printout.",
  },
  {
    icon: Bell,
    title: "Announcements",
    body: "Events, exam schedules and holidays reach every family instantly — no more lost circulars.",
  },
  {
    icon: ShieldCheck,
    title: "Private by design",
    body: "Each school's data is separate, and staff only see the classes and threads they're responsible for.",
  },
];

const roles: { icon: LucideIcon; title: string; body: string; soon?: boolean }[] = [
  { icon: Users, title: "Parents", body: "Follow progress, read report cards, raise concerns and track replies." },
  { icon: UserCog, title: "Administrators", body: "Set up classes and staff, publish announcements, see every open issue.", soon: true },
  { icon: ClipboardCheck, title: "Supervisors", body: "Approve report cards and handle escalated complaints for their grades.", soon: true },
  { icon: GraduationCap, title: "Teachers", body: "Take attendance, enter marks and reply to parents of their own classes.", soon: true },
  { icon: BookOpenCheck, title: "Teacher assistants", body: "Help with attendance, homework and draft marks for teacher approval.", soon: true },
  { icon: Briefcase, title: "Students", body: "See timetable, homework and grades, and send suggestions to the school.", soon: true },
  { icon: Wallet, title: "Accountants", body: "Manage fee invoices, reminders and payment records.", soon: true },
  { icon: HeartHandshake, title: "Counselors", body: "Receive confidential safeguarding concerns that others can't see.", soon: true },
];

const steps = [
  { icon: ClipboardCheck, title: "Choose a plan", body: "Start free, or pick Basic or Enterprise when you're ready." },
  { icon: Upload, title: "We set up your school", body: "Send us your student and staff lists in Excel — we import everything." },
  { icon: MessagesSquare, title: "Invite parents", body: "Parents install the app and sign in. Conversations start the same day." },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 via-white to-white">
        <div
          aria-hidden
          className="absolute -top-40 right-0 size-[36rem] rounded-full bg-blue-200/40 blur-3xl"
        />
        <Container className="relative grid items-center gap-12 py-16 lg:grid-cols-2 lg:py-24">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-sm font-medium text-blue-800 ring-1 ring-blue-200">
              <span className="size-2 rounded-full bg-emerald-500" aria-hidden />
              Parent app now available on Android, iOS & web
            </p>
            <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-balance sm:text-5xl lg:text-6xl">
              Every parent concern, <span className="text-blue-700">heard and resolved.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-pretty text-slate-600">{site.description}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/get-started/?plan=free" size="lg">
                Start for free
              </ButtonLink>
              <a href={site.demoUrl} className={buttonClass("secondary", "lg")}>
                Try the live demo
              </a>
            </div>
            <p className="mt-4 text-sm text-slate-500">Free plan for up to 50 students · No card required</p>
          </div>
          <div className="relative mx-auto flex w-full max-w-md justify-center lg:max-w-none">
            <Phone src={homeShot} alt="School Connect home screen" className="w-56 sm:w-64 lg:w-72" />
            <Phone
              src={conversationShot}
              alt="A parent's complaint with the school's reply"
              className="absolute top-16 -right-2 hidden w-52 rotate-3 sm:block lg:right-0 lg:w-60"
            />
          </div>
        </Container>
      </section>

      {/* Problems */}
      <section className="py-20">
        <Container>
          <SectionHeading
            eyebrow="Why schools switch"
            title="Replace group chats and paper with one calm channel"
          />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {problems.map((p) => (
              <div key={p.before} className="rounded-2xl bg-slate-50 p-6 ring-1 ring-slate-200">
                <p className="text-sm text-slate-500 line-through decoration-slate-300">{p.before}</p>
                <p className="mt-3 font-semibold text-slate-900">{p.after}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Features */}
      <section id="features" className="bg-slate-50 py-20">
        <Container>
          <SectionHeading
            eyebrow="Features"
            title="Everything parents ask for, in one place"
            description="Built around the conversations that matter most between a school and its families."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, body, soon }) => (
              <div key={title} className="rounded-2xl bg-white p-6 ring-1 ring-slate-200">
                <span className="flex size-10 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                  <Icon className="size-5" aria-hidden />
                </span>
                <h3 className="mt-4 font-semibold">
                  {title}
                  {soon && <SoonBadge />}
                </h3>
                <p className="mt-2 text-sm text-slate-600">{body}</p>
              </div>
            ))}
          </div>

          <div className="mt-20 grid items-center gap-12 lg:grid-cols-2">
            <div className="flex min-w-0 justify-center gap-4 sm:gap-6">
              <Phone src={progressShot} alt="Child progress screen" className="w-40 sm:w-60" />
              <Phone src={reportShot} alt="Report card screen" className="mt-12 w-40 sm:w-60" />
            </div>
            <div>
              <h3 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Parents see how their child is really doing
              </h3>
              <p className="mt-4 text-lg text-slate-600">
                Scores, attendance, trends and teacher remarks for every subject — and report cards
                that parents can respond to. Families with more than one child switch between them in
                a tap.
              </p>
              <a href={site.demoUrl} className={`${buttonClass("secondary")} mt-6`}>
                Explore the demo
              </a>
            </div>
          </div>
        </Container>
      </section>

      {/* Roles */}
      <section id="roles" className="py-20">
        <Container>
          <SectionHeading
            eyebrow="For the whole school"
            title="The right tools for every role"
            description="The parent app is available today. Staff tools and the admin portal are rolling out next."
          />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {roles.map(({ icon: Icon, title, body, soon }) => (
              <div key={title} className="rounded-2xl p-6 ring-1 ring-slate-200">
                <Icon className="size-6 text-blue-700" aria-hidden />
                <h3 className="mt-3 font-semibold">
                  {title}
                  {soon && <SoonBadge />}
                </h3>
                <p className="mt-1 text-sm text-slate-600">{body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* How it works */}
      <section className="bg-slate-50 py-20">
        <Container>
          <SectionHeading eyebrow="Getting started" title="Live in days, not months" />
          <ol className="mt-12 grid gap-6 md:grid-cols-3">
            {steps.map(({ icon: Icon, title, body }, i) => (
              <li key={title} className="rounded-2xl bg-white p-6 ring-1 ring-slate-200">
                <div className="flex items-center gap-3">
                  <span className="flex size-8 items-center justify-center rounded-full bg-blue-700 text-sm font-bold text-white">
                    {i + 1}
                  </span>
                  <Icon className="size-5 text-blue-700" aria-hidden />
                </div>
                <h3 className="mt-4 font-semibold">{title}</h3>
                <p className="mt-1 text-sm text-slate-600">{body}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* Pricing */}
      <section className="py-20">
        <Container>
          <SectionHeading
            eyebrow="Pricing"
            title="Simple plans that grow with your school"
            description="Parents never pay. Start free and upgrade when you need more."
          />
          <div className="mt-10">
            <PricingCards />
          </div>
          <p className="mt-8 text-center">
            <ButtonLink href="/pricing/" variant="ghost">
              Compare all features →
            </ButtonLink>
          </p>
        </Container>
      </section>

      {/* CTA */}
      <section className="pb-20">
        <Container>
          <div className="rounded-3xl bg-blue-700 px-6 py-14 text-center text-white sm:px-12">
            <h2 className="text-3xl font-bold tracking-tight text-balance">
              Give your parents a better way to reach the school
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-blue-100">
              Set up takes a couple of days. We&apos;ll import your data and train your staff.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <ButtonLink href="/get-started/?plan=free" variant="secondary" size="lg">
                Start for free
              </ButtonLink>
              <ButtonLink
                href="/get-started/?plan=enterprise"
                size="lg"
                className="bg-blue-800 ring-1 ring-blue-400 hover:bg-blue-900"
              >
                Talk to sales
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
