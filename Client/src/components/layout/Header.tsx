"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/store/features/auth/authSlice";
import { clearAgenda } from "@/store/features/agenda/agendaSlice";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

const links = [
  { href: "/speakers", label: "Speakers" },
  { href: "/schedule", label: "Schedule" },
  { href: "/venue", label: "The venue" },
  { href: "/sponsors", label: "Partners" },
  { href: "/live", label: "Watch live" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const { user, token } = useAppSelector((s) => s.auth);
  const dispatch = useAppDispatch();
  const isStaff = user?.role === "STAFF" || user?.role === "ADMIN";

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        menuButton.current?.focus();
      }
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  function signOut() {
    dispatch(logout());
    dispatch(clearAgenda());
    setOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-bg/95 backdrop-blur-xl">
      <Container className="flex h-[76px] items-center justify-between gap-3 sm:h-[84px] sm:gap-5">
        <Link
          href="/"
          onClick={() => setOpen(false)}
          aria-label="NEXUS Conf home"
          className="flex items-center gap-2.5"
        >
          <span className="nexus-mark text-[#ee623e]" aria-hidden="true" />
          <span className="font-display text-[28px] font-bold! tracking-[-.07em]! sm:text-[31px]">
            nexus
          </span>
          <span className="hidden border-l border-line pl-2.5 font-sans text-[11px] font-medium leading-[1.4] tracking-[.03em] text-muted sm:block">
            CONF
            <br />
            2026
          </span>
        </Link>
        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-7 lg:flex xl:gap-8"
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={pathname.startsWith(link.href) ? "page" : undefined}
              className={cn(
                "relative py-2 text-sm transition hover:text-neon",
                pathname.startsWith(link.href)
                  ? "text-neon after:absolute after:inset-x-0 after:-bottom-1 after:h-px after:bg-neon"
                  : "text-muted",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-4 lg:flex">
          {isStaff && (
            <Link href="/admin/check-in" className="text-sm text-neon">
              Check-in
            </Link>
          )}
          {token && user ? (
            <button
              type="button"
              className="text-sm text-muted hover:text-neon"
              onClick={signOut}
            >
              {user.name.split(" ")[0]} · Sign out
            </button>
          ) : (
            <Link
              href="/register"
              className="text-sm text-text hover:text-neon"
            >
              Sign in
            </Link>
          )}
          <Button href="/tickets" className="min-h-11 px-5 py-2.5">
            Get tickets <ArrowUpRight size={16} />
          </Button>
        </div>
        <div className="flex items-center gap-2 lg:hidden">
          <Button
            href="/tickets"
            className="min-h-10 gap-2 whitespace-nowrap px-3 py-2 sm:px-4"
          >
            Tickets <ArrowUpRight size={15} />
          </Button>
          <button
            ref={menuButton}
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-line"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </Container>
      {open && (
        <nav
          id="mobile-navigation"
          aria-label="Mobile navigation"
          className="max-h-[calc(100dvh-84px)] overflow-y-auto border-t border-line bg-bg px-6 py-5 lg:hidden"
        >
          {[...links, { href: "/tickets", label: "Tickets" }].map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              aria-current={pathname.startsWith(link.href) ? "page" : undefined}
              className={cn(
                "flex items-center justify-between border-b border-line py-4 font-display text-2xl",
                pathname.startsWith(link.href) && "text-neon",
              )}
            >
              <span>
                <span className="mr-4 align-middle font-mono text-sm text-muted">
                  0{i + 1}
                </span>
                {link.label}
              </span>
              <ArrowUpRight size={19} />
            </Link>
          ))}
          <div className="flex items-center justify-between pt-6">
            {token && user ? (
              <button
                type="button"
                onClick={signOut}
                className="text-sm text-muted"
              >
                {user.name.split(" ")[0]} · Sign out
              </button>
            ) : (
              <Link
                href="/register"
                onClick={() => setOpen(false)}
                className="text-sm"
              >
                Sign in / Register{" "}
                <ArrowUpRight className="ml-1 inline" size={14} />
              </Link>
            )}
            {isStaff && (
              <Link
                href="/admin/check-in"
                onClick={() => setOpen(false)}
                className="text-sm text-neon"
              >
                Staff check-in
              </Link>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
