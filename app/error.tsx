"use client";

import { useEffect } from "react";
import Button from "@/components/ui/Button";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
      <h2 className="text-2xl font-semibold text-slate-900">Something glitched.</h2>
      <p className="text-slate-500">We couldn&apos;t load this view. Try again or head home.</p>
      <div className="flex gap-3">
        <Button onClick={() => reset()}>Retry</Button>
        <Button variant="secondary" onClick={() => (window.location.href = "/")}>Go home</Button>
      </div>
    </div>
  );
}
