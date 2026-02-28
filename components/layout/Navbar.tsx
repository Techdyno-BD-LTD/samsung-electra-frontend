import Link from "next/link";

const links = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/api/products", label: "API" },
];

export default function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-8">
        <Link href="/" className="text-2xl font-semibold text-slate-900">
          Electra
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium text-slate-600">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="transition hover:text-slate-900">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
