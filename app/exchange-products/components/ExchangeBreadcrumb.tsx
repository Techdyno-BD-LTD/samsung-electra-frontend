import Link from "next/link";

type ExchangeBreadcrumbProps = {
  home: string;
  current: string;
};

export default function ExchangeBreadcrumb({ home, current }: ExchangeBreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4 mt-4 flex items-center gap-2 text-[12px] text-slate-500 sm:text-sm">
      <Link href="/" className="transition hover:text-slate-700">
        {home}
      </Link>
      <span className="text-slate-400">›</span>
      <span className="font-medium text-slate-700">{current}</span>
    </nav>
  );
}
