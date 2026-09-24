import { ChevronDown } from "lucide-react";

import { faqs } from "@/config/site";

export function Faq() {
  return (
    <div className="mx-auto max-w-3xl divide-y divide-slate-200 rounded-2xl ring-1 ring-slate-200">
      {faqs.map((item) => (
        <details key={item.q} className="group px-6 py-5">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold [&::-webkit-details-marker]:hidden">
            {item.q}
            <ChevronDown className="size-5 flex-none text-slate-400 transition group-open:rotate-180" aria-hidden />
          </summary>
          <p className="mt-3 text-slate-600">{item.a}</p>
        </details>
      ))}
    </div>
  );
}
