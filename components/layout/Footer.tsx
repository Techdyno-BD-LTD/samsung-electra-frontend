export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 bg-white/70 py-8 text-sm text-slate-500">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 text-center sm:flex-row sm:px-8 sm:text-left">
        <p>&copy; {year} Electra Commerce. All rights reserved.</p>
        <div className="flex gap-4">
          <a href="mailto:hello@electra.dev" className="hover:text-slate-900">
            Contact
          </a>
          <a href="/privacy" className="hover:text-slate-900">
            Privacy
          </a>
          <a href="/terms" className="hover:text-slate-900">
            Terms
          </a>
        </div>
      </div>
    </footer>
  );
}
