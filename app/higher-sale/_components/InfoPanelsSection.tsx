type DetailItem = {
  title: string;
  description: string;
};

type DetailSection = {
  title: string;
  intro: string;
  items: DetailItem[];
};

type InfoPanelsSectionProps = {
  benefits: DetailSection;
  requirements: DetailSection;
};

export default function InfoPanelsSection({ benefits, requirements }: InfoPanelsSectionProps) {
  return (
    <section className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-5">
      <article className="overflow-hidden rounded-2xl border border-[#c7d8ea] bg-[#eaf4ff] shadow-sm">
        <header className="mx-4 mt-4 rounded-lg bg-[#1f74e8] px-4 py-2 text-center text-base font-semibold text-white sm:mx-5 sm:text-lg">
          {benefits.title}
        </header>

        <div className="p-5 sm:p-6">
          <p className="text-sm leading-7 text-slate-700 sm:text-[15px]">{benefits.intro}</p>

          <ul className="mt-4 space-y-3">
            {benefits.items.map((item, index) => (
              <li key={`${item.title}-${index}`} className="text-slate-800">
                <p className="pb-2 text-sm font-semibold leading-6 sm:text-[15px]">• {item.title}</p>
                <p className="pl-4 text-xs text-slate-600 sm:text-sm">{item.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </article>

      <article className="overflow-hidden rounded-2xl border border-[#d8caef] bg-[#f3ecff] shadow-sm">
        <header className="mx-4 mt-4 rounded-lg bg-[#5e3bea] px-4 py-2 text-center text-base font-semibold text-white sm:mx-5 sm:text-lg">
          {requirements.title}
        </header>

        <div className="p-5 sm:p-6">
          <p className="text-sm leading-7 text-slate-700 sm:text-[15px]">{requirements.intro}</p>

          <ul className="mt-4 space-y-3">
            {requirements.items.map((item, index) => (
              <li key={`${item.title}-${index}`} className="text-slate-800">
                <p className="pb-2 text-sm font-semibold leading-6 sm:text-[15px]">• {item.title}</p>
                <p className="pl-4 text-xs text-slate-600 sm:text-sm">{item.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </article>
    </section>
  );
}
