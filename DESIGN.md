# DESIGN.md — InsurIQ Design System

**Version:** 1.0  
**Date:** 14 May 2026  
**Status:** Active — reference this file for every design and implementation decision

---

## 1. Design Philosophy

InsurIQ operates at the intersection of two things South Africans rarely experience together in financial services: **intelligence and warmth**. The design system must communicate both simultaneously.

**The brand promise in visual language:**
- Navy and deep blues → authority, trust, stability
- Bright cyan accent → intelligence, clarity, the answer
- Generous white space → transparency, nothing to hide
- Bold confident typography → we speak plainly, no jargon

**The benchmark:** This site should look like it belongs in the same category as Discovery Health, Lemonade Insurance, and Wise — brands that are simultaneously premium, accessible, and digitally native. Not a traditional bank. Not a startup landing page. A confident, grown-up fintech brand.

**What we are NOT:**
- Not corporate-heavy (no stock photos of handshakes or smiling families with houses)
- Not startup-playful (no cartoon illustrations, no loud gradients, no confetti)
- Not bureaucratic (no dense text walls, no acronym soup)

---

## 2. Color System

### 2.1 Brand Palette

```css
/* core-colors.css */
:root {
  /* Primary */
  --color-navy:        #0B2D78;   /* Primary text, headings, nav */
  --color-blue:        #1A5FBF;   /* Links, secondary emphasis */
  --color-mid:         #2D84D8;   /* Gradient midpoint, hover states */
  --color-bright:      #4BAEF0;   /* Gradient endpoint, icon fills */
  --color-cyan:        #5DCDE6;   /* THE accent — used sparingly */

  /* Dark */
  --color-indigo:      #071840;   /* Footer, dark section backgrounds */
  --color-ink:         #0A1B2E;   /* Darkest text */

  /* Neutral */
  --color-white:       #FFFFFF;   /* Primary background */
  --color-cloud:       #F4F8FB;   /* Alternate section background */
  --color-border:      #E2EAF4;   /* Dividers, card borders */
  --color-muted:       #6B7A8F;   /* Secondary text, labels */
  --color-body:        #3A4655;   /* Body text */

  /* Semantic */
  --color-success:     #27AE60;
  --color-warning:     #F39C12;
  --color-error:       #E74C3C;
  --color-info:        #2D84D8;
}
```

### 2.2 Gradient Definitions

```css
/* Used on hero backgrounds and dark sections — never on text or buttons */
--gradient-brand: linear-gradient(135deg, #0B2D78 0%, #1A5FBF 55%, #4BAEF0 100%);
--gradient-dark:  linear-gradient(145deg, #071840 0%, #0B2D78 100%);
--gradient-subtle: linear-gradient(180deg, #F4F8FB 0%, #FFFFFF 100%);
```

### 2.3 Color Usage Rules

| Color | Use for | Never use for |
|---|---|---|
| `--color-navy` | Headings, primary buttons, nav links | Body text (too dark) |
| `--color-blue` | Links, secondary buttons, hover states | Backgrounds |
| `--color-cyan` | One accent per section max, Q-tail in logo, active states | Text below 18px |
| `--color-cloud` | Alternate section backgrounds | Primary backgrounds |
| `--color-muted` | Labels, captions, secondary info | Headings |
| Gradient | Hero sections, footer, CTA banners | Cards, buttons, body |

### 2.4 Accessible Combinations

All text/background combinations must meet WCAG AA (4.5:1 for normal text, 3:1 for large text):

| Text | Background | Contrast | Pass? |
|---|---|---|---|
| `#0B2D78` (navy) | `#FFFFFF` (white) | 10.4:1 | ✅ |
| `#3A4655` (body) | `#FFFFFF` (white) | 8.2:1 | ✅ |
| `#FFFFFF` (white) | `#0B2D78` (navy) | 10.4:1 | ✅ |
| `#FFFFFF` (white) | `#071840` (indigo) | 16.8:1 | ✅ |
| `#6B7A8F` (muted) | `#FFFFFF` (white) | 4.6:1 | ✅ |
| `#5DCDE6` (cyan) | `#0B2D78` (navy) | 4.8:1 | ✅ |

❌ **Never** use cyan text on a white background (contrast: 2.8:1 — fails AA)

---

## 3. Typography

### 3.1 Type Scale

```typescript
// next/font setup in app/layout.tsx
import { Syne, DM_Sans } from 'next/font/google'

export const syne = Syne({
  subsets: ['latin'],
  weight: ['700', '800'],
  variable: '--font-display',
  display: 'swap',
  preload: true,
})

export const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-body',
  display: 'swap',
  preload: true,
})
```

### 3.2 Type Tokens

```css
/* Heading sizes — mobile first, desktop in media queries */
--text-display:  clamp(48px, 7vw, 96px);   /* Hero headline */
--text-h1:       clamp(36px, 5vw, 64px);    /* Page title */
--text-h2:       clamp(28px, 4vw, 48px);    /* Section heading */
--text-h3:       clamp(22px, 3vw, 32px);    /* Sub-section heading */
--text-h4:       clamp(18px, 2vw, 24px);    /* Card title */
--text-body-lg:  18px;                       /* Large body (intro paragraphs) */
--text-body:     16px;                       /* Default body */
--text-body-sm:  14px;                       /* Secondary body */
--text-label:    12px;                       /* Eyebrow labels, captions */
--text-micro:    11px;                       /* Footer links, legal */
```

### 3.3 Font Application Rules

| Element | Font | Weight | Transform |
|---|---|---|---|
| Hero headline | Syne | 800 | None |
| Section headings (H2–H3) | Syne | 700 | None |
| Card titles (H4) | Syne | 700 | None |
| Eyebrow labels | DM Sans | 500 | UPPERCASE + letter-spacing 3–4px |
| Body text | DM Sans | 400 | None |
| Navigation links | DM Sans | 500 | None |
| Button text | DM Sans | 600 | None |
| Footer links | DM Sans | 400 | None |
| Legal / captions | DM Sans | 400 | None |

### 3.4 Letter Spacing

```css
--tracking-tight:  -0.02em;  /* Large display text ≥ 48px */
--tracking-normal:  0em;      /* Body and nav */
--tracking-wide:    0.05em;   /* Buttons */
--tracking-wider:   0.1em;    /* Labels (eyebrow text) */
--tracking-widest:  0.2em;    /* Footer nav links */
```

### 3.5 Line Height

```css
--leading-tight:    1.1;   /* Display headlines */
--leading-snug:     1.2;   /* H2–H3 */
--leading-normal:   1.5;   /* H4, UI elements */
--leading-relaxed:  1.7;   /* Body text */
--leading-loose:    2.0;   /* Legal text, footnotes */
```

---

## 4. Spacing System

**Base unit: 4px.** All spacing values are multiples of 4px. When in doubt, use multiples of 8px.

```css
/* Tailwind custom spacing additions */
--space-1:    4px;
--space-2:    8px;
--space-3:    12px;
--space-4:    16px;
--space-6:    24px;
--space-8:    32px;
--space-10:   40px;
--space-12:   48px;
--space-16:   64px;
--space-20:   80px;
--space-24:   96px;
--space-32:   128px;
--space-40:   160px;
--space-48:   192px;
```

### Section Spacing

```css
/* Vertical padding on major page sections */
--section-padding-mobile:  64px 0;    /* py-16 */
--section-padding-tablet:  96px 0;    /* py-24 */
--section-padding-desktop: 128px 0;   /* py-32 */

/* Max content width */
--container-max:    1280px;
--container-narrow: 768px;   /* For blog, legal pages */
--container-wide:   1440px;  /* For full-bleed hero areas */
```

---

## 5. Component Library

### 5.1 Buttons

```tsx
// Three variants. Sizes: sm | md | lg

// PRIMARY — Navy with subtle inner glow on hover
<Button variant="primary" size="md">Get Your Quote</Button>
// bg-brand-navy text-white
// hover: bg-[#0d3590] shadow-[0_0_20px_rgba(11,45,120,0.3)]
// Padding: py-3 px-6 (md) | py-4 px-8 (lg) | py-2 px-4 (sm)
// Border radius: rounded-lg (8px)
// Font: DM Sans 600, 15px, tracking-wide

// SECONDARY — White with navy border
<Button variant="secondary" size="md">Learn More</Button>
// bg-white text-brand-navy border border-brand-navy
// hover: bg-brand-navy text-white

// GHOST — Transparent, cyan text, cyan underline on hover
<Button variant="ghost" size="md">How It Works →</Button>
// text-brand-cyan hover:underline
```

### 5.2 Cards

```tsx
// Base card — white bg, 1px border, 12px radius, 32px padding
// hover: translateY(-4px), shadow-lg, border-brand-cyan

// Product card
interface ProductCardProps {
  icon: React.ReactNode
  title: string
  description: string
  href: string
}

// shadow: 0 2px 24px rgba(11,45,120,0.06)
// hover shadow: 0 12px 40px rgba(11,45,120,0.12)
// transition: all 0.25s ease
```

### 5.3 Form Inputs

```css
/* Base input styles */
.input-base {
  background: white;
  border: 1.5px solid var(--color-border);
  border-radius: 8px;
  padding: 14px 16px;
  font-size: 16px; /* Prevents iOS zoom */
  color: var(--color-ink);
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.input-base:focus {
  border-color: var(--color-cyan);
  box-shadow: 0 0 0 3px rgba(93, 205, 230, 0.15);
  outline: none;
}

.input-error {
  border-color: var(--color-error);
  box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.1);
}

.input-success {
  border-color: var(--color-success);
}
```

### 5.4 Navigation

```tsx
// Sticky top nav
// Default: bg-white, no shadow
// Scrolled (> 60px): bg-white/95 backdrop-blur-sm shadow-sm
// Mobile: fixed bottom-right WhatsApp FAB
// Logo: 160px wide, auto height
// Links: 15px DM Sans 500, text-brand-body, hover:text-brand-navy
// CTA: Primary button, size="sm"

// Mobile nav (< 768px)
// Hamburger → full-screen overlay, bg-white
// Links stacked vertically, 24px, Syne 700
// Close button top-right
// CTA at bottom of overlay
```

### 5.5 Icons

- Library: **Lucide React** (consistent stroke width 1.5px, matches brand style)
- Size tokens: 16px (inline), 20px (UI), 24px (feature), 32px (product cards), 48px (hero features)
- Color: `text-brand-navy` for structural icons, `text-brand-cyan` for accent/feature icons
- Always in circular container for product/feature highlights:

```tsx
<div className="w-12 h-12 rounded-full bg-brand-cyan/10 flex items-center justify-center">
  <ShieldCheck className="w-6 h-6 text-brand-cyan" />
</div>
```

---

## 6. Layout System

### 6.1 Grid

```tsx
// 12-column grid, used at section level
<div className="grid grid-cols-12 gap-6 lg:gap-8">
  {/* Full width */}
  <div className="col-span-12">...</div>

  {/* 60/40 split (hero) */}
  <div className="col-span-12 lg:col-span-7">...</div>
  <div className="col-span-12 lg:col-span-5">...</div>

  {/* Three-column (products, features) */}
  <div className="col-span-12 md:col-span-6 lg:col-span-4">...</div>

  {/* Two-column (comparison) */}
  <div className="col-span-12 md:col-span-6">...</div>
</div>
```

### 6.2 Container

```tsx
// Use this wrapper for all section content
export function Container({ children, className, narrow, wide }: ContainerProps) {
  return (
    <div className={cn(
      "mx-auto px-4 sm:px-6 lg:px-8",
      narrow ? "max-w-3xl" : wide ? "max-w-7xl" : "max-w-6xl",
      className
    )}>
      {children}
    </div>
  )
}
```

### 6.3 Section Anatomy

Every major section follows this structure:
```tsx
<section className="py-16 md:py-24 lg:py-32 bg-white">
  <Container>
    {/* Eyebrow */}
    <p className="text-xs font-medium tracking-widest uppercase text-brand-cyan mb-3">
      {eyebrow}
    </p>
    {/* Heading */}
    <h2 className="font-display text-4xl lg:text-5xl font-bold text-brand-navy tracking-tight mb-4">
      {heading}
    </h2>
    {/* Subheading */}
    <p className="text-lg text-brand-muted max-w-2xl mb-12">
      {subheading}
    </p>
    {/* Content */}
    {children}
  </Container>
</section>
```

---

## 7. Motion & Animation

### 7.1 Principles

- **Purposeful:** Animation communicates state change or guides attention. Never decorative.
- **Fast:** Duration 150–400ms. Users wait for content, not animations.
- **Eased:** Always use ease-out for elements entering the screen.
- **Respects preference:** Honour `prefers-reduced-motion` — wrap all animations.

### 7.2 Standard Transitions

```css
/* Micro interactions (buttons, links, icons) */
--transition-fast: all 150ms ease-out;

/* Component state changes (card hover, menu open) */
--transition-base: all 250ms ease-out;

/* Page-level reveals (section fade-in on scroll) */
--transition-slow: all 400ms ease-out;
```

### 7.3 Scroll Animations (Framer Motion)

```tsx
// Section reveal — use on every major section
const sectionVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' }
  }
}

// Stagger children (feature grids, testimonials)
const containerVariants = {
  visible: {
    transition: { staggerChildren: 0.1 }
  }
}

// Always wrap in reduced motion check
const prefersReduced = useReducedMotion()
```

### 7.4 Hover States

```css
/* Card lift */
.card { transition: transform 250ms ease-out, box-shadow 250ms ease-out; }
.card:hover { transform: translateY(-4px); }

/* Button */
.btn-primary:hover { background: #0d3590; box-shadow: 0 4px 16px rgba(11,45,120,0.3); }

/* Nav links */
.nav-link { position: relative; }
.nav-link::after {
  content: '';
  position: absolute;
  bottom: -2px; left: 0;
  width: 0; height: 2px;
  background: var(--color-cyan);
  transition: width 200ms ease-out;
}
.nav-link:hover::after { width: 100%; }
```

---

## 8. Imagery & Media

### 8.1 Photography Direction

**Use:** Abstract, geometric imagery. Data visualisations. Clean office environments. South African cityscapes. Technology contexts.

**Avoid:** Stock photo families in front of houses. Handshakes. People holding cheques. Anything that looks like a 2010 insurance ad.

**Hero visual:** The phone mockup showing the InsurIQ quote calculator. This should be a clean product shot — either a real screenshot in a device frame, or a Figma-generated device mockup. Updated via Sanity CMS.

### 8.2 Image Implementation

```tsx
// Always use next/image
import Image from 'next/image'

// Hero image
<Image
  src="/images/hero-mockup.png"
  alt="InsurIQ quote calculator on mobile"
  width={600}
  height={700}
  priority  // Above the fold — always priority
  sizes="(max-width: 768px) 100vw, 50vw"
  className="object-contain"
/>

// Below-fold images (lazy load)
<Image
  src={post.coverImage}
  alt={post.coverImageAlt}  // Required field in Sanity schema
  width={800}
  height={450}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>
```

### 8.3 Image Formats

- Source: JPG or PNG from client
- Output: Vercel/Next.js auto-converts to WebP with AVIF fallback
- No manual WebP conversion required
- Minimum quality: 85 (Next.js default)

---

## 9. Responsive Design

### 9.1 Breakpoints

```typescript
// tailwind.config.ts
screens: {
  'sm':  '375px',   // Small phones
  'md':  '768px',   // Tablets / large phones
  'lg':  '1024px',  // Small laptops
  'xl':  '1280px',  // Desktop
  '2xl': '1920px',  // Wide screens
}
```

### 9.2 Mobile-First Rules

```tsx
// Always mobile first, scale up
<div className="
  flex flex-col        // Mobile: stacked
  md:flex-row          // Tablet: side by side
  gap-6
  md:gap-10
">

// Typography scales up
<h1 className="
  text-4xl             // Mobile: 36px
  md:text-5xl          // Tablet: 48px
  lg:text-6xl          // Desktop: 60px
  xl:text-7xl          // Wide: 72px
">

// Sections pad out
<section className="
  py-16               // Mobile: 64px
  md:py-24            // Tablet: 96px
  lg:py-32            // Desktop: 128px
">
```

### 9.3 Navigation — Mobile Specifics

- Hamburger menu at `< md` (768px)
- WhatsApp FAB fixed bottom-right on mobile only
- CTA button in mobile nav (full width)
- Touch targets minimum 44×44px
- No hover-dependent interactions on mobile

---

## 10. Compliance Design Requirements

These are not optional. They are legal requirements for an FSCA-licensed FSP.

### 10.1 Footer — Required Elements

```tsx
// MUST appear in footer on every page
<footer>
  {/* ... other footer content ... */}
  <div className="border-t border-white/10 pt-8 text-xs text-white/50">
    <p>
      InsurIQ is an Authorised Financial Services Provider.{' '}
      FSP No: {FSCA_LICENSE_NUMBER}.
    </p>
    <p>
      Registered in South Africa. POPIA Compliance Officer: {POPIA_OFFICER_EMAIL}.
    </p>
    <div className="flex gap-4 mt-2">
      <Link href="/privacy-policy">Privacy Policy</Link>
      <Link href="/fais-disclosure">FAIS Disclosure</Link>
      <Link href="/complaints">Complaints</Link>
      <Link href="/terms">Terms</Link>
    </div>
    <p className="mt-2">© {new Date().getFullYear()} InsurIQ. All rights reserved.</p>
  </div>
</footer>
```

### 10.2 Lead Forms — POPIA Consent

```tsx
// POPIA consent — required on every form that collects personal data
<div className="flex items-start gap-3">
  <input
    type="checkbox"
    id="popia-consent"
    defaultChecked={false}  // NEVER pre-checked
    required
    aria-required="true"
    className="mt-1 w-4 h-4 accent-brand-cyan"
  />
  <label htmlFor="popia-consent" className="text-sm text-brand-muted">
    I consent to InsurIQ collecting and processing my personal information
    in accordance with their{' '}
    <Link href="/privacy-policy" className="text-brand-blue underline">
      Privacy Policy
    </Link>{' '}
    and in compliance with POPIA.
  </label>
</div>
```

### 10.3 FAIS Disclosure Banner (Product Pages)

```tsx
// Display on all product pages
<div className="bg-brand-cloud border border-brand-border rounded-lg p-4 text-sm text-brand-muted">
  <strong className="text-brand-navy">FAIS Disclosure:</strong>{' '}
  InsurIQ is an Authorised Financial Services Provider (FSP No: [NUMBER]).
  Please read our{' '}
  <Link href="/fais-disclosure">Full FAIS Disclosure</Link>{' '}
  before making any financial decisions.
</div>
```

---

## 11. Sanity CMS Schema — Design-Relevant Fields

Every CMS type must include these fields for design consistency:

```typescript
// Shared fields across all document types
{
  name: 'seo',
  type: 'object',
  fields: [
    { name: 'metaTitle', type: 'string', validation: Rule => Rule.max(60) },
    { name: 'metaDescription', type: 'string', validation: Rule => Rule.max(160) },
    { name: 'ogImage', type: 'image', options: { hotspot: true } },
  ]
}

// Image fields MUST have alt text
{
  name: 'image',
  type: 'image',
  options: { hotspot: true },
  fields: [
    {
      name: 'alt',
      type: 'string',
      title: 'Alt text (describe the image for screen readers)',
      validation: Rule => Rule.required().error('Alt text is required for accessibility'),
    }
  ]
}
```

---

## 12. Design Review Checklist

Before submitting any component or page for client review:

### Visual
- [ ] Matches approved Figma mockup at all breakpoints
- [ ] Colors are from the design token system (no raw hex values)
- [ ] Typography uses only Syne or DM Sans, from the scale
- [ ] Spacing follows the 4px base unit
- [ ] All interactive states designed: default, hover, focus, active, disabled

### Responsive
- [ ] Tested at 375px (iPhone SE)
- [ ] Tested at 768px (iPad)
- [ ] Tested at 1280px (laptop)
- [ ] Tested at 1920px (wide monitor)
- [ ] No horizontal scroll at any breakpoint
- [ ] Touch targets ≥ 44px on mobile

### Accessibility
- [ ] Color contrast passes WCAG AA
- [ ] All images have alt text
- [ ] All form fields have labels
- [ ] Focus states visible and logical
- [ ] Keyboard navigation works for all interactive elements
- [ ] Runs without errors through axe DevTools

### Performance
- [ ] All images use `next/image`
- [ ] No layout shift from image loading (width/height specified)
- [ ] Animations respect `prefers-reduced-motion`
- [ ] No render-blocking third-party scripts added

### Compliance
- [ ] POPIA consent present on any form collecting personal data
- [ ] FAIS disclosure on product pages
- [ ] FSP license number in footer
- [ ] All compliance page links in footer

---

*This design system evolves with the project. Any proposed changes to core tokens (colors, typography, spacing) must be discussed and documented here before implementation.*