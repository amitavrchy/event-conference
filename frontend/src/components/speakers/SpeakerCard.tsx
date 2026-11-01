import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Speaker } from "@/lib/types";
import { cn } from "@/lib/utils";

export function SpeakerCard({
  speaker,
  className,
  number,
}: {
  speaker: Speaker;
  className?: string;
  number?: number;
}) {
  return (
    <Link
      href={`/speakers/${speaker.slug}`}
      className={cn("speaker-link group block h-full", className)}
    >
      <div className="relative aspect-[4/4.7] overflow-hidden rounded-lg bg-surface-2">
        {speaker.photoUrl ? (
          <Image
            src={speaker.photoUrl}
            alt={speaker.name}
            fill
            className="speaker-image object-cover object-top"
            sizes="(max-width: 640px) 45vw, (max-width: 1024px) 43vw, 22vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center font-display text-7xl text-neon">
            {speaker.name[0]}
          </div>
        )}
        {number && (
          <span className="absolute left-3 top-3 font-mono text-sm text-white mix-blend-difference">
            0{number}
          </span>
        )}
        {speaker.company && (
          <span className="absolute bottom-3 left-3 rounded-full border border-white/50 bg-bg/95 px-3 py-1 text-sm font-medium text-text">
            {speaker.company}
          </span>
        )}
        <span className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-bg/95 text-text transition group-hover:rotate-45 group-hover:bg-[#ee623e] group-hover:text-white">
          <ArrowUpRight size={17} />
        </span>
      </div>
      <h3 className="mt-4 font-display text-[22px] font-medium! tracking-[-.045em]! sm:text-[25px]">
        {speaker.name}
      </h3>
      <p className="mt-1 text-sm text-muted">{speaker.title}</p>
    </Link>
  );
}
