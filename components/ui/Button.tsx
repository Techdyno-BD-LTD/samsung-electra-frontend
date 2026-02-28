import { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "primary" | "secondary";
};

const cn = (...classes: (false | null | undefined | string)[]) =>
  classes.filter(Boolean).join(" ");

export default function Button({
  children,
  className,
  variant = "primary",
  ...rest
}: ButtonProps) {
  return (
    <button
      className={cn(
        "rounded-full px-6 py-3 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
        variant === "primary" && "bg-slate-900 text-white hover:bg-slate-800 focus-visible:outline-slate-900",
        variant === "secondary" && "border border-slate-300 text-slate-700 hover:border-slate-400 hover:text-slate-900",
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
