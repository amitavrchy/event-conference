"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { checkInApi } from "@/lib/api";
import { useAppSelector } from "@/store/hooks";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";

function parseInput(raw: string): { code: string; payload?: string } {
  const trimmed = raw.trim();
  if (trimmed.startsWith("nexus:")) {
    const parts = trimmed.split(":");
    const code = parts[1] ?? "";
    return { code, payload: trimmed };
  }
  return { code: trimmed };
}

export default function CheckInPage() {
  const user = useAppSelector((s) => s.auth.user);
  const token = useAppSelector((s) => s.auth.token);
  const [input, setInput] = useState("");
  const [lastMessage, setLastMessage] = useState<string | null>(null);

  const isStaff = user?.role === "STAFF" || user?.role === "ADMIN";

  const checkIn = useMutation({
    mutationFn: async (raw: string) => {
      const { code, payload } = parseInput(raw);
      if (!code) throw new Error("Enter a ticket code or QR payload");
      return checkInApi.checkIn(code, payload);
    },
    onSuccess: (ticket) => {
      setLastMessage(
        `Checked in ${ticket.name} (${ticket.code}) — status ${ticket.status}`,
      );
      setInput("");
    },
    onError: () => {
      setLastMessage("Check-in failed. Invalid code, payload, or permissions.");
    },
  });

  if (!token) {
    return (
      <Section title="Check-in" className="pt-12">
        <p className="text-lg text-muted">Staff sign-in required.</p>
        <Button href="/register" className="mt-6">
          Sign in
        </Button>
      </Section>
    );
  }

  if (!isStaff) {
    return (
      <Section title="Check-in" className="pt-12">
        <p className="text-lg text-warn">
          This desk is for STAFF / ADMIN only. Demo: staff@nexusconf.dev /
          nexus2026
        </p>
      </Section>
    );
  }

  return (
    <Section
      eyebrow="Staff"
      title="Check-in desk"
      description="Scan or paste QR payload (nexus:code:sig) or enter the ticket code."
      className="pt-12"
    >
      <form
        className="mx-auto max-w-lg space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          checkIn.mutate(input);
        }}
      >
        <label className="block text-sm text-muted" htmlFor="scan">
          Code or payload
        </label>
        <textarea
          id="scan"
          rows={3}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="nexus:clxxxx:abcdef… or paste code"
          className="w-full rounded-md border border-violet/30 bg-bg px-4 py-3 font-mono text-base text-text outline-none focus:border-neon"
        />
        <Button type="submit" className="w-full" disabled={checkIn.isPending}>
          {checkIn.isPending ? "Checking in…" : "Check in"}
        </Button>
      </form>
      {lastMessage && (
        <p
          className={`mx-auto mt-6 max-w-lg text-base ${
            checkIn.isError ? "text-warn" : "text-neon"
          }`}
          role="status"
        >
          {lastMessage}
        </p>
      )}
    </Section>
  );
}
