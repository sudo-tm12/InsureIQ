import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

const HTML_ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

/** Escape text for interpolation into HTML (emails, server-rendered pages). */
export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (ch) => HTML_ESCAPES[ch]);
}

/** Non-breaking space: keeps "R 1 234.50" on one line in HTML and the PDF. */
const NBSP = " ";

/**
 * Format integer cents as South African Rand, e.g. 123450 → "R 1 234.50".
 * Built by hand, not with toLocaleString("en-ZA"): that locale's decimal
 * separator varies by ICU version (Node prints "R 1 234,50"), and the
 * server (PDF, emails) and every browser must print the same figure.
 */
export function formatCents(cents: number): string {
  const sign = cents < 0 ? "-" : "";
  const abs = Math.abs(Math.round(cents));
  const rands = Math.floor(abs / 100)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, NBSP);
  const fraction = String(abs % 100).padStart(2, "0");
  return `${sign}R${NBSP}${rands}.${fraction}`;
}
