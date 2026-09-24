import Image, { type StaticImageData } from "next/image";

export function Phone({ src, alt, className = "" }: { src: StaticImageData; alt: string; className?: string }) {
  return (
    <div
      className={`rounded-[2.5rem] bg-slate-900 p-2.5 shadow-2xl shadow-slate-900/25 ring-1 ring-slate-900/10 ${className}`}
    >
      <div className="overflow-hidden rounded-[2rem] bg-white">
        <Image src={src} alt={alt} className="h-auto w-full" sizes="(min-width: 1024px) 300px, 60vw" priority />
      </div>
    </div>
  );
}
