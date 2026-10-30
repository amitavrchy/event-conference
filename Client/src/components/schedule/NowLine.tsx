"use client";

export function NowLine({ label = "Now" }: { label?: string }) {
  return (
    <div className="relative my-4 flex items-center gap-3" aria-hidden>
      <span className="now-line-pulse h-2.5 w-2.5 rounded-full bg-neon" />
      <div className="h-px flex-1 bg-gradient-to-r from-neon via-magenta to-transparent" />
      <span className="font-mono text-sm uppercase tracking-widest text-neon">
        {label}
      </span>
    </div>
  );
}
