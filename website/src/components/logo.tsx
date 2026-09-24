import { GraduationCap } from "lucide-react";
import Link from "next/link";

import { site } from "@/config/site";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 font-bold text-slate-900">
      <span className="flex size-8 items-center justify-center rounded-lg bg-blue-700 text-white">
        <GraduationCap className="size-5" aria-hidden />
      </span>
      <span className="text-lg tracking-tight">{site.name}</span>
    </Link>
  );
}
