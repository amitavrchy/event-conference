import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function trackColor(name: string) {
  const colors: Record<string, string> = {
    "Design Systems": "#c84625",
    "Product Craft": "#526b51",
    "AI & Interfaces": "#78608d",
    Mainstage: "#8e6836",
  };
  return colors[name] ?? "#70716a";
}

export function formatCurrency(amount: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export const EVENT = {
  name: "NEXUS Conf 2026",
  shortName: "NEXUS",
  promise: "Three days that reshape how you build.",
  // Keep schedule day keys matching seeded sessions; countdown uses a nearby future for live demos.
  start: new Date("2026-12-12T09:00:00.000Z"),
  end: new Date("2026-12-14T18:00:00.000Z"),
  days: ["2026-09-18", "2026-09-19", "2026-09-20"] as const,
} as const;
