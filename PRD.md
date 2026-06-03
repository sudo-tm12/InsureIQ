# PRD.md — InsurIQ Phase 1: Marketing Website

**Version:** 1.0  
**Date:** 14 May 2026  
**Author:** TshedzaWebDev  
**Status:** Approved — Development Active  

---

## 1. Overview

### 1.1 Purpose

This document defines the complete product requirements for the InsurIQ Phase 1 marketing website. It is the single source of truth for what is being built, why, and how success is measured. Every feature, every page, every integration described here has been agreed with the client.

Anything not in this document is **out of scope for Phase 1.**

### 1.2 Background

InsurIQ is an FSCA-licensed South African insurtech company offering credit life insurance, financial advisory, and debt management services. They are entering the market with a digital-first model targeting the gap between overpriced traditional credit life insurance and the underserved middle-income South African consumer.

InsurIQ has no existing web presence. Phase 1 establishes their digital foundation: a professional, conversion-optimised, fully compliant marketing website that supports FSP licensing credibility, partner conversations, and early lead generation — all before the self-onboarding portal (Phase 2) is built.

### 1.3 Strategic Goals

| Goal | Why It Matters |
|---|---|
| Establish credibility with FSCA, underwriters, and partners | FSP conversations happen before licensing is finalised — a professional site signals operational readiness |
| Generate qualified leads from day one | Multi-channel acquisition starts as soon as the site is live |
| Educate the market | Credit life insurance is misunderstood — education reduces sales friction |
| Lay the technical foundation for Phase 2 | Architecture decisions now must not create rework when the portal is added |
| Be fully POPIA and FSCA/FAIS compliant | Non-compliance exposes InsurIQ to regulatory risk before they've earned a single rand |

---

## 2. Target Users

### 2.1 Primary — The Debt-Carrying South African

- **Age:** 25–55
- **Income:** R 8,000 – R 45,000 / month
- **Situation:** Has a vehicle loan, home loan, or personal loan. Currently paying for credit life insurance bundled into their repayment — but doesn't know it, doesn't understand it, or suspects they're being overcharged
- **Pain points:** Confusion, opacity, distrust of financial institutions, fear of debt
- **What they need from this site:** Clarity, trust, simple explanation of what credit life insurance is, proof that InsurIQ is legitimate and regulated, an easy way to get a quote

### 2.2 Secondary — The Informed Switcher

- Already has credit life insurance elsewhere
- Actively comparing alternatives
- Higher intent, lower education needed
- Needs: clear value proposition, cost comparison, fast path to quote

### 2.3 Tertiary — The B2B Partner / Underwriter

- Evaluating InsurIQ as a distribution or underwriting partner
- Needs: professional brand impression, FSP credentials, about/team section, contact form

---

## 3. Pages & Content Requirements

### 3.1 Home (`/`)

**Purpose:** Convert first-time visitors into leads. Educate, build trust, create urgency.

#### Sections (in order):

**[NAV]** Sticky navigation  
- Logo (left)  
- Links: Products · How It Works · About · Blog · Contact  
- CTA button: "Get a Quote" (primary, navy)  
- WhatsApp floating button (mobile only, fixed bottom-right)  
- Mobile: hamburger menu, full-screen overlay  

**[HERO]** Full viewport  
- Eyebrow: `FSCA LICENSED · TRANSPARENT · DIGITAL-FIRST` (small caps, cyan)  
- H1: `Credit life insurance that finally makes sense.`  
- Subheading: `Affordable cover. Transparent pricing. Built for South Africans who deserve better.`  
- CTA 1: `Get Your Quote in 60 Seconds` (primary button, navy)  
- CTA 2: `How It Works` (secondary button, outlined)  
- Visual: Phone mockup showing InsurIQ quote calculator (Sanity-managed image)  
- Background: Subtle navy-to-white gradient, geometric accent shapes in low-opacity cyan  
- Trust bar below fold: `Trusted by South Africans across [X] provinces` + underwriter logos (grayscale)  

**[PROBLEM/SOLUTION]** Two-column comparison  
- Left: "The Old Way" — hidden fees, paper forms, weeks to process, generic cover  
- Right: "The InsurIQ Way" — transparent pricing, digital onboarding, minutes to apply, intelligent matching  
- All rows CMS-managed  

**[PRODUCTS]** Three-card grid  
- Credit Life Insurance  
- Financial Advisory  
- Debt Management  
- Each card: icon, title, short description, "Learn More →" link  
- CMS-managed content  

**[HOW IT WORKS]** Four-step horizontal timeline  
- Step 01: Get a Quote  
- Step 02: Choose Your Cover  
- Step 03: Sign Digitally  
- Step 04: You're Covered  
- CMS-managed steps  

**[WHY INSURIQ]** Three-column icon grid  
- Up to 40% cheaper  
- Fully transparent  
- FSCA licensed  
- CMS-managed  

**[TESTIMONIALS]** Carousel  
- 3+ testimonials  
- Name, initial, location  
- Star rating (1–5)  
- Quote text  
- CMS-managed  

**[BLOG PREVIEW]** Latest 3 articles  
- Auto-populated from CMS  
- Category tag, headline, read time, excerpt  

**[FINAL CTA]** Dark banner  
- Headline: `Ready to insure smarter?`  
- Subhead: `Get your personalised quote in under 60 seconds.`  
- Button: `Start Your Quote`  
- Reassurance: `No spam. No pressure. Just clarity.`  

**[FOOTER]** Four-column  
- Logo + tagline  
- Products links  
- Company links (About, Blog, Contact, Careers)  
- Legal (Privacy Policy, T&Cs, FAIS Disclosure, Complaints Procedure)  
- FSCA license number, FSP number, registered office  
- POPIA officer contact  
- Social icons  
- Copyright  

---

### 3.2 Products (`/products`)

Overview of all three products with expandable detail sections.

**Sub-pages (each its own URL):**
- `/products/credit-life-insurance`
- `/products/financial-advisory`
- `/products/debt-management`

Each product page:
- Hero with product-specific headline and CTA
- What it covers (bullet list, CMS)
- Who it's for (target customer description)
- How it works (simplified steps)
- Cost comparison table (CMS-managed, optional)
- FAQ accordion (CMS-managed)
- Lead capture CTA at bottom

---

### 3.3 How It Works (`/how-it-works`)

Expanded explanation of the full InsurIQ journey from discovery to active policy.

Sections:
- The application process (step by step)
- What happens after you apply
- How your cover is managed
- Claims process
- FAQ accordion

---

### 3.4 About (`/about`)

- Company mission and origin story
- Why InsurIQ exists (the market problem)
- The team (CMS-managed: photo, name, title, short bio)
- FSCA credentials and compliance commitment
- Values section

---

### 3.5 Blog (`/blog`)

- Grid of all articles (paginated, 9 per page)
- Category filter: Credit Life, Advisory, Debt, News
- Each article: cover image, category, headline, excerpt, read time, date, author
- Search (future — log for Phase 2)

**Individual article (`/blog/[slug]`):**
- Full article content from Sanity Portable Text
- Author bio
- Related articles (auto-populated by category)
- Social share buttons
- CTA block at end of every article

---

### 3.6 Contact (`/contact`)

- Contact form: Name, Email, Phone, Subject (dropdown), Message, POPIA consent
- WhatsApp link
- Office address (if applicable)
- Google Maps embed (optional)
- Form submits to Eddie's email + logs to CMS

---

### 3.7 Compliance Pages (all required by FSCA/FAIS)

| Page | URL | Description |
|---|---|---|
| Privacy Policy | `/privacy-policy` | Full POPIA-compliant privacy policy |
| Terms & Conditions | `/terms` | Website usage T&Cs |
| FAIS Disclosure | `/fais-disclosure` | FSP details, service scope, conflict of interest |
| Complaints Procedure | `/complaints` | How to submit a complaint, timelines, escalation |
| POPIA Consent | Referenced in forms | Inline consent with link to Privacy Policy |

All compliance pages are **static content** managed in Sanity. A compliance officer (Eddie or his KI) must review and approve all text before launch.

---

## 4. Functional Requirements

### 4.1 Lead Capture

| ID | Requirement | Priority |
|---|---|---|
| F1.1 | Multi-step quote request form on homepage and product pages | Must Have |
| F1.2 | Form fields: First Name, Last Name, Email, Phone, Loan Type, Loan Amount, POPIA consent | Must Have |
| F1.3 | Client-side and server-side validation with Zod | Must Have |
| F1.4 | Submission sends email notification to Eddie's inbox | Must Have |
| F1.5 | Submission confirmation page or toast message | Must Have |
| F1.6 | Consent timestamp logged server-side with each submission | Must Have |
| F1.7 | Integration with CRM or email marketing tool (Mailchimp or similar) | Should Have |
| F1.8 | Duplicate submission detection by email address | Should Have |
| F1.9 | Form analytics — track abandonment rate per step | Could Have |

### 4.2 Content Management (Sanity CMS)

| ID | Requirement | Priority |
|---|---|---|
| F2.1 | All marketing copy editable by Eddie without developer involvement | Must Have |
| F2.2 | Blog articles: create, edit, publish, schedule, unpublish | Must Have |
| F2.3 | Team members: add, edit, reorder, remove | Must Have |
| F2.4 | Testimonials: add, edit, reorder, remove | Must Have |
| F2.5 | Products: description, features list, FAQs | Must Have |
| F2.6 | Homepage sections: headlines, subheadings, CTAs | Must Have |
| F2.7 | Image management with automatic optimisation | Must Have |
| F2.8 | Preview mode — Eddie can preview changes before publishing | Should Have |
| F2.9 | Revision history | Could Have |

### 4.3 WhatsApp Integration

| ID | Requirement | Priority |
|---|---|---|
| F3.1 | Click-to-chat button linking to InsurIQ WhatsApp Business number | Must Have |
| F3.2 | Pre-filled message: "Hi InsurIQ, I'd like to find out more about your products." | Must Have |
| F3.3 | Fixed floating button on mobile | Must Have |
| F3.4 | Inline buttons on contact page and product CTAs | Must Have |

### 4.4 Analytics & Tracking

| ID | Requirement | Priority |
|---|---|---|
| F4.1 | Google Analytics 4 installed and verified | Must Have |
| F4.2 | Google Search Console verified | Must Have |
| F4.3 | Lead form submission tracked as GA4 conversion event | Must Have |
| F4.4 | WhatsApp click tracked as GA4 event | Must Have |
| F4.5 | Page views, session duration, bounce rate configured | Must Have |
| F4.6 | Google Tag Manager container (for future pixel additions) | Should Have |

### 4.5 SEO

| ID | Requirement | Priority |
|---|---|---|
| F5.1 | Unique meta title and description for every page (CMS-managed) | Must Have |
| F5.2 | Open Graph tags for social sharing | Must Have |
| F5.3 | Twitter/X Card tags | Should Have |
| F5.4 | Canonical URLs on all pages | Must Have |
| F5.5 | XML sitemap auto-generated at `/sitemap.xml` | Must Have |
| F5.6 | `robots.txt` correctly configured | Must Have |
| F5.7 | JSON-LD structured data: Organization, Product, FAQ, Article | Must Have |
| F5.8 | Image alt text on all images (CMS field required) | Must Have |
| F5.9 | Heading hierarchy validated (one H1 per page) | Must Have |

---

## 5. Non-Functional Requirements

### 5.1 Performance

| Metric | Target | Measurement Tool |
|---|---|---|
| Lighthouse Performance | ≥ 90 | Chrome Lighthouse |
| Largest Contentful Paint | < 2.5s | Core Web Vitals |
| First Input Delay | < 100ms | Core Web Vitals |
| Cumulative Layout Shift | < 0.1 | Core Web Vitals |
| Time to First Byte | < 800ms | PageSpeed Insights |
| Total page weight (homepage) | < 1MB | Network tab |

### 5.2 Accessibility

- WCAG 2.1 AA compliance minimum
- All images have descriptive alt text
- All form fields have associated labels
- Colour contrast ratio ≥ 4.5:1 for body text
- All interactive elements keyboard-navigable
- Focus states visible on all focusable elements
- Skip to main content link present

### 5.3 Browser & Device Support

| Browser | Version |
|---|---|
| Chrome | Last 2 versions |
| Safari | Last 2 versions |
| Firefox | Last 2 versions |
| Edge | Last 2 versions |
| Samsung Internet | Last 2 versions |

| Device | Breakpoint |
|---|---|
| Mobile | 375px – 767px |
| Tablet | 768px – 1279px |
| Desktop | 1280px – 1919px |
| Wide | 1920px+ |

### 5.4 Security

- HTTPS enforced (Vercel default)
- Content Security Policy headers configured
- No sensitive data in client-side code or URL parameters
- Form submissions processed server-side via API route
- Rate limiting on API routes (max 10 requests / minute / IP)
- Input sanitisation on all form fields
- POPIA: no PII in error logs or analytics events

### 5.5 Availability

- Target uptime: 99.9% (Vercel SLA)
- No scheduled maintenance windows (Vercel handles deploys with zero downtime)
- Error monitoring: Vercel error tracking or Sentry (basic tier)

---

## 6. Integrations

| Integration | Purpose | Phase |
|---|---|---|
| Sanity CMS | Content management | Phase 1 |
| Resend / Nodemailer | Form submission emails | Phase 1 |
| Google Analytics 4 | Traffic and conversion tracking | Phase 1 |
| Google Search Console | SEO monitoring | Phase 1 |
| WhatsApp Business API | Click-to-chat lead routing | Phase 1 |
| Mailchimp (or similar) | Email list capture | Phase 1 |
| Google Tag Manager | Tag management container | Phase 1 |
| Vercel Analytics | Performance monitoring | Phase 1 |
| PayFast / Peach Payments | Payment processing | Phase 2 |
| Policy Admin System API | Application submission | Phase 2 |
| Credit Bureau API | KYC verification | Phase 2 |

---

## 7. Content Requirements

The following content must be provided by Eddie before development of each section begins:

| Content Item | Owner | Required By |
|---|---|---|
| Company mission and value proposition | Eddie | Week 1 |
| Product descriptions (all 3 products) | Eddie | Week 1 |
| FSP license number and registration details | Eddie | Week 1 |
| FAIS disclosure text (reviewed by KI) | Eddie / KI | Week 2 |
| Compliance officer contact details | Eddie | Week 2 |
| Team member photos and bios | Eddie | Week 2 |
| Logo files (AI or EPS source) | Eddie | Week 1 |
| Underwriter / partner logos | Eddie | Week 2 |
| Testimonials (minimum 3) | Eddie | Week 3 |
| Initial blog articles (minimum 2) | Eddie / TshedzaWebDev | Week 5 |
| WhatsApp Business number | Eddie | Week 1 |
| Office address (if applicable) | Eddie | Week 2 |

If content is not received by the specified week, that section will launch with placeholder content and be updated post-launch. This does not delay the launch date.

---

## 8. Out of Scope — Phase 1

The following are explicitly **not** included in Phase 1. They will be addressed in Phase 2 or logged for future consideration:

- ❌ Client self-onboarding portal
- ❌ Policy admin system API integration
- ❌ Client login / dashboard
- ❌ Quote engine with real-time pricing calculations
- ❌ Credit bureau integration
- ❌ Payment gateway integration
- ❌ Record of Advice (ROA) generation
- ❌ Admin dashboard for Eddie's team
- ❌ Chatbot / live chat automation
- ❌ Claims submission portal
- ❌ Multi-language support (English only for Phase 1)
- ❌ Native mobile app
- ❌ Blog search functionality

---

## 9. Launch Criteria

The site will not go live until all of the following are met:

- [ ] All Must Have functional requirements implemented and tested
- [ ] Lighthouse score ≥ 90 on all four categories (mobile)
- [ ] Zero WCAG 2.1 AA violations (automated scan + manual review)
- [ ] All compliance pages reviewed and approved by Eddie / KI
- [ ] FSCA license number confirmed and displayed in footer
- [ ] POPIA consent mechanism tested and working
- [ ] Form submissions tested end-to-end (submission → email receipt → CMS log)
- [ ] GA4 tracking verified with live test events
- [ ] Cross-browser testing completed on all supported browsers
- [ ] Mobile testing on real device (not just DevTools)
- [ ] Eddie has completed final review and given written sign-off
- [ ] Domain DNS pointed to Vercel production
- [ ] SSL certificate active
- [ ] 30-day post-launch support period started

---

## 10. Success Metrics (30 Days Post-Launch)

| Metric | Target |
|---|---|
| Organic search impressions | > 500 |
| Monthly unique visitors | > 200 |
| Lead form submissions | > 20 |
| WhatsApp click-to-chat initiations | > 15 |
| Bounce rate | < 60% |
| Average session duration | > 1:30 |
| Lighthouse Performance score | ≥ 90 (maintained) |
| Uptime | 99.9% |

---

## 11. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Content not delivered on time by Eddie | Medium | High | Content brief sent Week 1; launch with placeholder if needed |
| FSP license number not yet issued | Medium | Medium | Footer shows "FSP application in progress" until confirmed |
| FAIS disclosure requires legal review | Low | High | Flag in Week 2; Eddie to engage KI early |
| Underwriter logos unavailable | Low | Low | Launch without partner strip; add post-launch |
| Domain transfer delays | Low | High | Confirm domain ownership in Week 1 discovery call |
| Policy admin system API not ready | N/A | N/A | Not in Phase 1 scope |

---

## 12. Approval & Sign-Off

| Role | Name | Sign-Off Required For |
|---|---|---|
| Client | Eddie (InsurIQ) | Sitemap, design mockups, compliance copy, full site pre-launch |
| KI / Compliance | TBD | FAIS disclosure, T&Cs, complaints procedure |
| Developer | Tshedza (TshedzaWebDev) | Technical architecture, launch readiness |

---

*This document is version-controlled. Changes require written agreement from both parties before implementation.*