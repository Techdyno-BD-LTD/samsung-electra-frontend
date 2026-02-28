import { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export default function Input({ className, ...rest }: InputProps) {
  return (
    <input
      className={`w-full rounded-full border border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 ${className ?? ""}`}
      {...rest}
    />
  );
}
