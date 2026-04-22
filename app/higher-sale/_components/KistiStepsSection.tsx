type PurchaseStep = {
  stepLabel: string;
  title: string;
  description: string;
};

type KistiStepsSectionProps = {
  title: string;
  steps: PurchaseStep[];
};

export default function KistiStepsSection({ title, steps }: KistiStepsSectionProps) {
  return (
    <section className="mt-4 rounded-2xl bg-[#f4ead9] p-4 sm:p-6 lg:p-8">
      <h2 className="text-center text-xl font-semibold text-[#1f74e8] sm:text-2xl">{title}</h2>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {steps.map((step, index) => (
          <article key={`${step.stepLabel}-${index}`} className="rounded-lg bg-[#f5f5f5] p-5 shadow-sm">
            <p className="text-2xl font-semibold text-slate-400">/ {step.stepLabel}</p>
            <h3 className="mt-14 text-2xl font-bold leading-9 text-slate-900">{step.title}</h3>
            <p className="mt-4 text-[15px] leading-7 text-slate-600">{step.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
