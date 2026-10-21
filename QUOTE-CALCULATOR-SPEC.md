# Quote Calculator — Feature Specification

**Project:** InsurIQ Phase 1 Marketing Website
**Feature:** Multi-account Credit Life Insurance savings calculator on `/get-quote`
**Source of truth:** `CLI QUOTE CALCULATOR (MEDIATION) V4.0 Mar.2025.xlsx` (Eddie Greeff)
**Status:** Spec for approval — no code until approved
**Author:** TshedzaWebDev session — 2026-10-19

---

## 1. Problem & goal

Consultants currently run credit-life savings quotes by hand in an Excel workbook: one row
per credit account, an estimated current premium per provider, and the InsurIQ premium at
our actual rate. The website must reproduce this as a **public self-service calculator** on
`/get-quote` that:

1. Shows a visitor what they are likely overpaying across **all** their credit accounts
2. Shows the InsurIQ premium and monthly / annual savings — **in Rand only**
3. Produces a **PDF quote**, emailed to the client and shown on screen
4. Captures the lead (incl. **ID number**) with full POPIA handling
5. **Never exposes the rate book** — not in the repo, not in the browser bundle, not via any API

## 2. Data source — what the workbook contains

| Sheet | Content | Use |
|---|---|---|
| `MasterData` | `TableCreditProvider`: **487 providers**, each with an estimated current CLI rate (R per R1,000 outstanding per month), range 1.8–4.5 | The rate book (encrypted at rest) |
| `CLI Rate` | 28 stepped values 1.8–4.5 (0.1 steps) | Consultant tool only — **not used** in the public flow |
| `Report` | The quote document: client header, savings summary, 18-row account table, totals | Defines the **PDF + on-screen layout** and the calculation model |

### 2.1 Data-quality findings (must resolve at ingest)

| Issue | Detail | Resolution |
|---|---|---|
| Duplicate provider | `Attorneys/Prokureurs Munnik Basson Dagama Inc` appears twice with conflicting rates | Flag for Eddie to pick one before first deploy |
| Missing rate | `Vincemus Investments t/a (Kemptson Credit)` has no rate | Flag; exclude from book until Eddie supplies it |
| Legacy rates < 2.5 | Book minimum is 1.8 | Kept in the book (used for "what you pay now" estimates); the 2.5 floor only applies to the InsurIQ rate (§3) |

### 2.2 Rate-book update pipeline (future Eddie workbooks)

One command: `npm run rates:import -- <workbook.xlsx>` →

1. Parse `TableCreditProvider` from the new workbook
2. Validate: duplicate names, missing/out-of-range rates (0 < rate ≤ 4.5), row count drift
3. Print a **diff + warnings report** (human approval of conflicts)
4. Re-encrypt to `src/server/ratebook/ratebook.enc`
5. Ships with the next deploy. Eddie never touches code.

## 3. The rate model (per account)

```
estimated current rate   = rateBook[provider]                    (server-side only)
estimated current CLI    = balance ÷ 1000 × estimated current rate
new (InsurIQ) rate       = max(2.5, estimated current rate − 0.5)   (server-side only)
new CLI                  = balance ÷ 1000 × new rate
account saving / month   = estimated current CLI − new CLI
TOTAL saving / month     = Σ current CLI − Σ new CLI
TOTAL saving / year      = saving / month × 12
```

* **"R0.50 less per R1,000, floored at 2.5"** — confirmed rule. Rates differ per provider
  because they derive from each provider's own workbook rate.
* All money math in **cents (integers)**; display `R 1 234.50` (en-ZA, 2 decimals).
* **No-savings rule:** if `new rate ≥ current rate` (providers rated ≤ 2.5), the account is
  shown as *"Already below our standard rate"* with `R 0.00` saving and its new premium set
  equal to its current premium. We never quote someone **worse** off.

### 3.1 Worked example (acceptance test — workbook maths, illustrative rate)

| Account | Balance | Current est. | InsurIQ | Saving/mo |
|---|---|---|---|---|
| Example credit card | R 100 000 | 3.4 → **R 340.00** | 2.9 → **R 290.00** | **R 50.00** |
| **Totals** | R 100 000 | R 340.00 | R 290.00 | R 50.00 / mo · **R 600.00 / yr** |

Further cases: rate 2.8 → new 2.5 (save 0.3/R1,000); rate 2.3 → no-savings rule applies.

## 4. Public UX — `/get-quote` integration

The new calculator becomes the **hero tool** of the page. The existing single-loan
risk-rated wizard (`QuoteCalculator.tsx`) is **removed from the page** (code preserved in
git history; a "single loan quick estimate" can return in Phase 2). Two competing
calculators with different maths would destroy trust and conversion.

**Flow (one page, progressive):**

1. **Accounts** — dynamic rows (1–18, matching the Report):
   * Provider: search-as-you-type combobox (server-backed, names only, min 3 chars, top 8)
   * Account number (optional)
   * Outstanding balance (R, capped at R10 000 000 per account)
   * Row add / remove; live subtotal of balances
2. **"See my savings"** → `POST /api/quote/calculate` → **results panel** (§5)
3. **Lead form** (inline below results): name & surname, ID number, email, cell number,
   POPIA consent checkbox (unticked by default)
4. **"Email my quote (PDF)"** → `POST /api/quote/send` → success state:
   *"Check your inbox — your quote is on its way."*

States on every async step: loading (skeleton/disabled), error (inline, retryable),
empty (no accounts yet), success. Responsive at 375 / 768 / 1280 / 1920 px. Full ARIA on
combobox, rows, and results table (live region announces updated totals).

## 5. On-screen results (and what stays hidden)

Mirror of the `Report` sheet, **minus the rate columns**:

| Account | Account no. | Outstanding | Current est. /mo | InsurIQ /mo | Saving /mo |
|---|---|---|---|---|---|

* Summary block: **Est. Current CLI · New CLI · Total Savings per Month · Total Savings Per Year**
  (the two savings figures highlighted, as in the Report).
* **Never shown publicly:** estimated current rate, new rate — any figure from which a rate
  is directly readable. Rate maths lives only on the server.
* Disclaimer under results: indicative estimate based on information provided; actual
  premium confirmed in the personalised quote; InsurIQ is an Authorised FSP (FSP No from
  `constants.ts`).

## 6. PDF quote

* Server-side generation (pdf-lib or equivalent), branded InsurIQ lockup, layout = the
  `Report` sheet: header (**Quote Date · Client Name & Surname · ID Number**), savings
  summary, account table (no rate columns), totals.
* Footer (compliance, every copy): *"InsurIQ is an Authorised Financial Services Provider ·
  FSP No: [NUMBER]"* + links/text for FAIS disclosure, POPIA privacy policy, complaints.
* Sent to the client's own email (their own data, at their request, with consent recorded).
* On-screen results render the same content as HTML; the PDF is the artefact.

## 7. Lead capture & POPIA handling (ID number)

| Requirement | Implementation |
|---|---|
| Consent | Explicit checkbox, **unticked**, exact text: *"I consent to InsurIQ processing my personal information in accordance with their Privacy Policy and POPIA."* |
| Consent evidence | Timestamp + policy version stored with the lead, server-side |
| ID validation | Server-side: 13 digits, valid YYMMDD date, Luhn-style SA checksum. Client-side pre-check for UX only. Invalid → reject with clear message |
| Encryption | ID number AES-256-GCM encrypted at rest (field-level); key in env, separate from DB credentials |
| Masking | Notification emails show **last 4 digits only** (`•••• ••• ••• 1234`) |
| Full ID access | Only via a signed, expiring (24 h) link to the lead record in the encrypted store; access logged |
| No PII leakage | No PII in URLs, query strings, client logs, GA events, or error messages |
| Retention | Auto-purge after **24 months** (configurable; confirm with Eddie) |
| Data-subject rights | Requests route to the contact on `/privacy-policy` (already published) |

## 8. Email flows (Resend)

1. **Client** — subject *"Your personal InsurIQ savings quote"*; HTML summary + PDF attached.
2. **InsurIQ leads inbox** (`LEADS_NOTIFICATION_EMAIL`) — new-lead alert: name, contact,
   masked ID, savings totals, account list, consent timestamp, secure full-record link.

## 9. API contracts (all server-side; rate book never in responses)

| Endpoint | Purpose | Notes |
|---|---|---|
| `GET /api/quote/providers?q=` | Combobox autocomplete | ≥ 3 chars; top 8 **names only**; 20 req/min/IP |
| `POST /api/quote/calculate` | Compute quote | Body: `accounts: [{provider, accountNumber?, balance}]` (1–18 rows). Zod-validated. Returns rows + totals in Rand — **no rate fields** |
| `POST /api/quote/send` | Lead + PDF + emails | Body: quote request + client details + consent. Validates ID & email server-side; generates PDF; stores lead; sends both emails. 5 req/hour/IP + honeypot field |

All endpoints: strict Zod schemas, generic error messages (no stack traces), structured
logs **without PII**.

## 10. Rate-book security

* `ratebook.enc`: AES-256-GCM encrypted provider→rate JSON, committed to the (public) repo
  as ciphertext. **The key exists only in `RATEBOOK_KEY` env var** — never in the repo.
* Decrypted in memory on the server only, in a `*.server.ts` module (never importable from
  client components); no endpoint returns rate values.
* Threat model — what we guarantee and what we don't:
  * ✅ Nobody can download, dump, or extract the rate book (repo, bundle, or API).
  * ✅ No bulk harvesting: autocomplete is rate-limited, names-only; no endpoint lists the book.
  * ⚠️ Accepted residual risk: provider **names** must be visible for the combobox (usability),
    and a scripted user querying many accounts could infer individual rates from returned
    Rand amounts. Mitigated by rate limits + anomaly logging; fully closing this would break
    the product (any quote reveals its own rows' maths).

## 11. Lead storage

* Managed Postgres (Vercel Postgres / Neon) — serverless-friendly, persistent.
  Dev fallback: local encrypted JSONL file (gitignored).
* Schema: `leads` (id, created_at, name, surname, id_number_encrypted, email, cell,
  consent_at, policy_version, quote_json_encrypted, pdf_generated bool, emails_sent bool).
* **Note:** the site deploys to Vercel — server filesystem is ephemeral, so a DB is
  required for any stored lead (a plain file store would silently lose data).

## 12. Edge cases

| Case | Behaviour |
|---|---|
| Provider typed but not in book | Combobox forces a valid selection (no free text through) |
| Provider rate ≤ 2.5 | No-savings rule (§3), labelled honestly |
| Same provider twice | Allowed (distinct account numbers, as in the Report) |
| 0 / negative / > cap balance | Field-level validation; calculate disabled until valid |
| Email send failure after lead stored | Retry with backoff; user sees "saved — we'll email shortly" state, not a lie |
| Rate book fails to decrypt | `/api/quote/*` returns friendly "estimator temporarily unavailable"; alert logged |

## 13. Acceptance criteria (Definition of Done)

- [ ] Worked example (§3.1) reproduced to the cent
- [ ] No-savings rule tested (rate ≤ 2.5 providers)
- [ ] `tsc --noEmit` zero errors; ESLint zero warnings
- [ ] Rate columns absent from every client payload (asserted in tests) and from the PDF
- [ ] ID number: valid/invalid/Luhn cases tested; appears masked in all emails
- [ ] Consent cannot be pre-ticked; consent evidence stored
- [ ] Responsive 375 / 768 / 1280 / 1920; keyboard-complete; ARIA-compliant
- [ ] Loading / error / empty states for every async interaction
- [ ] Rate limits enforced on all three endpoints
- [ ] `ratebook.enc` present, plaintext rate data **nowhere** in repo or bundle (checked)

## 14. Out of scope (Phase 2 backlog)

- Consultant-facing internal quote tool (rate columns visible, per-deal rate override)
- Authenticated `/admin/leads` CRM view
- Sanity CMS for rate-book management UI
- Single-loan quick estimator revival
- WhatsApp quote delivery

## 15. Decisions needed (defaults proposed)

| # | Question | Proposed default |
|---|---|---|
| 1 | Lead retention period | 24 months |
| 2 | Confirm `Munnik Basson` rate (two conflicting values) & `Vincemus` rate | Eddie supplies before launch |
| 3 | Lead DB provider | Vercel Postgres (Neon) |
| 4 | Old wizard removal vs. keeping both calculators | Remove from page (git history keeps it) |
