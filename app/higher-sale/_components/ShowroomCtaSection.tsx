import Link from "next/link";

type ShowroomCtaSectionProps = {
  title: string;
  description: string;
  buttonLabel: string;
  buttonHref: string;
};

export default function ShowroomCtaSection({ title, description, buttonLabel, buttonHref }: ShowroomCtaSectionProps) {
  return (
    <section className="mt-4 rounded-2xl bg-[#e9e9e9] px-4 py-6 sm:px-6 lg:px-9 lg:py-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-2xl font-bold leading-snug text-slate-900 sm:text-3xl">{title}</h2>
          <p className="mt-2 text-[15px] text-slate-700 sm:text-lg">{description}</p>
        </div>

        <Link
          href={buttonHref}
          className="inline-flex h-12 items-center justify-center rounded-full bg-[#1f74e8] px-8 text-sm font-semibold text-white transition hover:bg-[#1666d4] sm:h-14 sm:px-10 sm:text-base"
        >
          {buttonLabel}
        </Link>
      </div>
    </section>
  );
}
