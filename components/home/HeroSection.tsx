import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function HeroSection() {
  return (
    <section className="mx-auto flex max-w-6xl flex-col gap-10 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-8 py-16 text-white shadow-2xl">
      <div className="space-y-6">
        <p className="text-sm uppercase tracking-[0.4em] text-slate-300">Samsung Electra</p>
        <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
          Reimagining connected commerce for bold electronics brands.
        </h1>
        <p className="max-w-2xl text-base text-slate-300">
          Integrate inventory, launch curated drops, and power subscription boxes that feel bespoke on every device.
        </p>
      </div>
      <form className="flex flex-col gap-3 sm:flex-row">
        <Input placeholder="Work email" type="email" required />
        <Button type="submit" className="justify-center">
          Book a demo
        </Button>
      </form>
    </section>
  );
}
