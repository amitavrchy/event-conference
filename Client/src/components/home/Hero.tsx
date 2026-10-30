"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export function Hero() {
  return (
    <section className="relative isolate min-h-[100svh] overflow-hidden">
      <div className="absolute inset-0 -z-20 overflow-hidden">
        <div className="hero-drift absolute inset-[-5%]">
          <Image
            src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=2400&q=80"
            alt=""
            fill
            priority
            className="object-cover object-[center_30%]"
            sizes="100vw"
          />
        </div>
      </div>

      <div className="absolute inset-0 -z-10 bg-[linear-gradient(100deg,rgba(10,8,16,0.94)_8%,rgba(10,8,16,0.55)_48%,rgba(10,8,16,0.75)_100%)]" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-bg via-bg/20 to-bg/60" />
      <div className="pointer-events-none absolute -left-32 top-[20%] -z-10 h-[32rem] w-[32rem] rounded-full bg-magenta/30 blur-[120px]" />
      <div className="pointer-events-none absolute right-[-10%] bottom-[-10%] -z-10 h-[26rem] w-[26rem] rounded-full bg-neon/25 blur-[110px]" />

      <Container className="relative flex min-h-[100svh] flex-col justify-end pb-14 pt-28 sm:pb-20 md:pb-24">
        <motion.p
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="font-display w-full max-w-[100%] overflow-hidden text-neon"
          style={{
            fontSize: "min(15.5vw, 7.75rem)",
            lineHeight: 0.82,
            letterSpacing: "-0.04em",
          }}
        >
          NEXUS
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 max-w-3xl font-display text-[clamp(1.6rem,3.8vw,3rem)] leading-[0.95] text-text"
        >
          Three days that reshape how you build.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.58, duration: 0.5 }}
          className="mt-4 max-w-lg text-base text-[#d5cee8] sm:text-lg"
        >
          Design × tech festival · Sep 18–20, 2026 · Dhaka
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.45 }}
          className="mt-9 flex flex-col gap-3 sm:flex-row"
        >
          <Button href="/tickets" className="sm:min-w-[11rem]">
            Get tickets
          </Button>
          <Button href="/schedule" variant="secondary">
            View schedule
          </Button>
        </motion.div>
      </Container>
    </section>
  );
}
