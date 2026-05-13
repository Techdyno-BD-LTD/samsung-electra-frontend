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
    <section className="py-6 grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-10">
      {/* Conditions Panel (Red) */}
      <article className="overflow-hidden rounded-[30px] border border-[#FFE3E3] bg-[#FFF5F5] shadow-sm flex flex-col">
        <div className="px-6 pt-8 pb-4 flex justify-center">
          <header className="w-full bg-[#DC3545] px-10 py-3 rounded-md text-center text-lg md:text-xl font-bold text-white shadow-md">
            {benefits.title}
          </header>
        </div>

        <div className="px-8 pb-10 flex-1">
          <p className="text-[15px] md:text-[16px] leading-relaxed text-slate-700 mb-8">{benefits.intro}</p>

          <ul className="space-y-6">
            {benefits.items.map((item, index) => (
              <li key={`${item.title}-${index}`} className="flex flex-col gap-1">
                <div className="flex items-start gap-3">
                  <span className="text-slate-800 font-black text-xl mt-[-2px]">•</span>
                  <h4 className="text-[16px] md:text-[18px] font-bold text-slate-900 leading-tight">
                    {item.title}
                  </h4>
                </div>
                <p className="pl-6 text-[14px] md:text-[15px] text-slate-500 leading-relaxed font-medium">
                  {item.description}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </article>

      {/* Procedure Panel (Green) */}
      <article className="overflow-hidden rounded-[30px] border border-[#C6F6D5] bg-[#F0FFF4] shadow-sm flex flex-col">
        <div className="px-6 pt-8 pb-4 flex justify-center">
          <header className="w-full bg-[#28A745] px-10 py-3 rounded-md text-center text-lg md:text-xl font-bold text-white shadow-md">
            {requirements.title}
          </header>
        </div>

        <div className="px-8 pb-10 flex-1">
          <p className="text-[15px] md:text-[16px] leading-relaxed text-slate-700 mb-8">{requirements.intro}</p>

          <ul className="space-y-6">
            {requirements.items.map((item, index) => (
              <li key={`${item.title}-${index}`} className="flex flex-col gap-1">
                <div className="flex items-start gap-3">
                  <span className="text-slate-800 font-black text-xl mt-[-2px]">•</span>
                  <h4 className="text-[16px] md:text-[18px] font-bold text-slate-900 leading-tight">
                    {item.title}
                  </h4>
                </div>
                <p className="pl-6 text-[14px] md:text-[15px] text-slate-500 leading-relaxed font-medium">
                  {item.description}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </article>
    </section>
  );
}
