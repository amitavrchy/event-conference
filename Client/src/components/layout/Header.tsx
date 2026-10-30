"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/store/features/auth/authSlice";
import { clearAgenda } from "@/store/features/agenda/agendaSlice";
import { Button } from "@/components/ui/Button";

const links = [
  { href: "/speakers", label: "Speakers" },
  { href: "/schedule", label: "Schedule" },
  { href: "/tickets", label: "Tickets" },
  { href: "/venue", label: "Venue" },
  { href: "/sponsors", label: "Sponsors" },
  { href: "/live", label: "Live" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { user, token } = useAppSelector((s) => s.auth);
  const dispatch = useAppDispatch();
  const isStaff = user?.role === "STAFF" || user?.role === "ADMIN";

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-bg/70 backdrop-blur-xl">
      <div className="mx-auto flex h-[4.25rem] w-[90%] items-center justify-between gap-4">
        <Link
          href="/"
          className="font-display text-xl tracking-tight text-neon transition hover:brightness-110"
        >
          NEXUS
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "text-sm uppercase tracking-[0.14em] transition",
                pathname.startsWith(l.href)
                  ? "text-neon"
                  : "text-muted hover:text-text",
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {isStaff && (
            <Link
              href="/admin/check-in"
              className="text-sm uppercase tracking-[0.12em] text-warn"
            >
              Check-in
            </Link>
          )}
          {token && user ? (
            <button
              type="button"
              className="text-sm text-muted transition hover:text-text"
              onClick={() => {
                dispatch(logout());
                dispatch(clearAgenda());
              }}
            >
              {user.name.split(" ")[0]} · Out
            </button>
          ) : (
            <Button href="/register" variant="ghost" className="px-3 py-2">
              Sign in
            </Button>
          )}
          <Button href="/tickets" className="py-2.5">
            Tickets
          </Button>
        </div>

        <button
          type="button"
          className="p-2 text-text lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-white/5 bg-bg/95 px-5 py-5 backdrop-blur-xl lg:hidden">
          <nav className="flex flex-col gap-4">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="font-display text-2xl text-text"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/tickets"
              onClick={() => setOpen(false)}
              className="inline-flex items-center justify-center rounded-sm bg-neon px-6 py-3.5 text-sm font-semibold uppercase tracking-[0.12em] text-bg"
            >
              Get tickets
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
