import { Check, Minus } from "lucide-react";

import { SoonBadge } from "@/components/ui";
import { comparison, plans } from "@/config/site";

function CellValue({ value }: { value: boolean | string }) {
  if (value === true) return <Check className="mx-auto size-5 text-blue-700" aria-label="Included" />;
  if (value === false) return <Minus className="mx-auto size-5 text-slate-300" aria-label="Not included" />;
  return <span className="text-sm text-slate-700">{value}</span>;
}

export function ComparisonTable() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] border-separate border-spacing-0 text-left">
        <thead>
          <tr>
            <th className="w-2/5 py-4 text-sm font-semibold text-slate-500">Compare plans</th>
            {plans.map((plan) => (
              <th key={plan.id} className="py-4 text-center text-base font-semibold">
                {plan.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {comparison.map((section) => (
            <Section key={section.group} section={section} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Section({ section }: { section: (typeof comparison)[number] }) {
  return (
    <>
      <tr>
        <th colSpan={4} className="pt-8 pb-3 text-sm font-semibold text-blue-700">
          {section.group}
        </th>
      </tr>
      {section.rows.map((row) => (
        <tr key={row.label}>
          <td className="border-t border-slate-200 py-3 pr-4 text-sm text-slate-700">
            {row.label}
            {row.soon && <SoonBadge />}
          </td>
          <td className="border-t border-slate-200 py-3 text-center"><CellValue value={row.free} /></td>
          <td className="border-t border-slate-200 py-3 text-center"><CellValue value={row.basic} /></td>
          <td className="border-t border-slate-200 py-3 text-center"><CellValue value={row.enterprise} /></td>
        </tr>
      ))}
    </>
  );
}
