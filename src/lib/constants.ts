/**
 * Site-wide configuration.
 * Values marked TODO must be confirmed with Eddie before launch.
 */

export const SITE = {
  name: "InsurIQ",
  tagline: "Credit life insurance that finally makes sense.",
  description:
    "Affordable, transparent credit life insurance built for South Africans who deserve better. FSCA licensed and POPIA compliant.",
  url:
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.insuriq.co.za",
  locale: "en_ZA",
  region: "ZA",
} as const;

/**
 * FSCA / FAIS regulatory details.
 * TODO: Replace placeholders with confirmed values before launch (see PRD §7).
 */
export const REGULATORY = {
  /**
   * FSCA FSP licence number, from NEXT_PUBLIC_FSP_NUMBER (digits only).
   * Null until configured: every "FSP No" mention is omitted, never faked.
   */
  fspNumber: process.env.NEXT_PUBLIC_FSP_NUMBER?.trim() || null,
  registeredName: "InsurIQ (Pty) Ltd",
  registeredOffice: "TBC — South Africa",
  popiaOfficerEmail: "privacy@insuriq.co.za",
  complianceOfficerEmail: "compliance@insuriq.co.za",
  complaintsEmail: "complaints@insuriq.co.za",
} as const;

/** "FSP No: 12345", or null while the licence number is not configured. */
export const FSP_LABEL = REGULATORY.fspNumber ? `FSP No: ${REGULATORY.fspNumber}` : null;

/**
 * Contact channels.
 * NEXT_PUBLIC_WHATSAPP_NUMBER must be set in .env.local — international format,
 * digits only (e.g. 27821234567).
 */
export const CONTACT = {
  email: "hello@insuriq.co.za",
  whatsappNumber:
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "27000000000",
  whatsappDefaultMessage:
    "Hi InsurIQ, I'd like to find out more about your products.",
} as const;

export const WHATSAPP_URL = `https://wa.me/${CONTACT.whatsappNumber}?text=${encodeURIComponent(
  CONTACT.whatsappDefaultMessage,
)}`;

export const NAV_LINKS = [
  { label: "Products", href: "/products" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
] as const;

export const PRODUCT_LINKS = [
  { label: "Credit Life Insurance", href: "/products/credit-life-insurance" },
  { label: "Financial Advisory", href: "/products/financial-advisory" },
  { label: "Debt Management", href: "/products/debt-management" },
] as const;

export const COMPANY_LINKS = [
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
] as const;

export const LEGAL_LINKS = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms" },
  { label: "FAIS Disclosure", href: "/fais-disclosure" },
  { label: "Conflict of Interest Policy", href: "/conflict-of-interest" },
  { label: "Complaints Procedure", href: "/complaints" },
] as const;

export const SOCIAL_LINKS = [
  { label: "LinkedIn", href: "https://www.linkedin.com/company/insuriq" },
  { label: "Facebook", href: "https://www.facebook.com/insuriq" },
  { label: "Instagram", href: "https://www.instagram.com/insuriq" },
  { label: "X", href: "https://x.com/insuriq" },
] as const;
