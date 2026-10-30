"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import type { Speaker } from "@/lib/types";
import { cn } from "@/lib/utils";

export function SpeakerCard({
  speaker,
  className,
}: {
  speaker: Speaker;
  className?: string;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 260, damping: 20, mass: 0.35 });
  const springY = useSpring(y, { stiffness: 260, damping: 20, mass: 0.35 });

  function onMove(e: React.MouseEvent) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    x.set((e.clientX - (rect.left + rect.width / 2)) * 0.1);
    y.set((e.clientY - (rect.top + rect.height / 2)) * 0.1);
  }

  function onLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div style={{ x: springX, y: springY }} className={cn("h-full", className)}>
      <Link
        ref={ref}
        href={`/speakers/${speaker.slug}`}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className="group relative block h-full overflow-hidden bg-surface"
      >
        <div className="relative aspect-[3/4] overflow-hidden">
          {speaker.photoUrl ? (
            <Image
              src={speaker.photoUrl}
              alt={speaker.name}
              fill
              className="object-cover transition duration-700 group-hover:scale-105"
              sizes="(max-width:768px) 80vw, 280px"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-surface-2 font-display text-5xl text-neon">
              {speaker.name.slice(0, 1)}
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/25 to-transparent opacity-90" />
          <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
            <p className="font-display text-2xl text-text sm:text-3xl">
              {speaker.name}
            </p>
            <p className="mt-2 text-sm text-neon">
              {speaker.title}
              {speaker.company ? ` · ${speaker.company}` : ""}
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
