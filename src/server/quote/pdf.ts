/**
 * Server-side PDF quote (pdf-lib). Layout mirrors the consultant Report sheet:
 * client header, savings summary, account table, totals — WITHOUT the rate
 * columns ("the client should never see the actual rate").
 */
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from 'pdf-lib'
import type { QuoteResult } from '@/lib/quote/savings'
import { creditTypeLabel } from '@/lib/quote/savings'
import { formatCents } from '@/lib/utils'
import { REGULATORY, SITE } from '@/lib/constants'

export interface QuotePdfInput {
  firstName: string
  lastName: string
  idNumber: string
  quoteDate: string
  quote: QuoteResult
}

const NAVY = rgb(0.043, 0.176, 0.471) // #0B2D78
const INDIGO = rgb(0.027, 0.094, 0.251) // #071840
const CYAN = rgb(0.365, 0.804, 0.902) // #5DCDE6
const INK = rgb(0.11, 0.17, 0.29)
const MUTED = rgb(0.42, 0.48, 0.58)
const CLOUD = rgb(0.949, 0.965, 0.988)
const WHITE = rgb(1, 1, 1)

const PAGE_MARGIN = 40
const PAGE_W = 595.28 // A4 portrait
const PAGE_H = 841.89

interface Column {
  header: string
  width: number
  align: 'left' | 'right'
}

const COLUMNS: Column[] = [
  { header: 'Account', width: 110, align: 'left' },
  { header: 'Type', width: 78, align: 'left' },
  { header: 'Account no.', width: 52, align: 'left' },
  { header: 'Outstanding', width: 80, align: 'right' },
  { header: 'Current est./mo', width: 78, align: 'right' },
  { header: 'InsurIQ/mo', width: 62, align: 'right' },
  { header: 'Saving/mo', width: 55, align: 'right' },
]

function drawText(
  page: PDFPage,
  text: string,
  x: number,
  y: number,
  size: number,
  font: PDFFont,
  color = INK,
): void {
  page.drawText(text, { x, y, size, font, color })
}

function fit(
  text: string,
  font: PDFFont,
  size: number,
  maxWidth: number,
): string {
  if (font.widthOfTextAtSize(text, size) <= maxWidth) return text
  let trimmed = text
  while (trimmed.length > 1 && font.widthOfTextAtSize(`${trimmed}…`, size) > maxWidth) {
    trimmed = trimmed.slice(0, -1)
  }
  return `${trimmed}…`
}

export async function generateQuotePdf(input: QuotePdfInput): Promise<Uint8Array> {
  const doc = await PDFDocument.create()
  doc.setTitle(`InsurIQ savings quote — ${input.firstName} ${input.lastName}`)
  doc.setAuthor(REGULATORY.registeredName)
  const page = doc.addPage([PAGE_W, PAGE_H])
  const regular = await doc.embedFont(StandardFonts.Helvetica)
  const bold = await doc.embedFont(StandardFonts.HelveticaBold)

  /* ── Header band ── */
  page.drawRectangle({ x: 0, y: PAGE_H - 96, width: PAGE_W, height: 96, color: INDIGO })
  try {
    // Compact lockup: the master's baked strapline would print ~3pt tall here.
    const logo = readFileSync(
      path.join(process.cwd(), 'public', 'images', 'logo', 'insuriq-logo-compact-reverse.png'),
    )
    const image = await doc.embedPng(logo)
    const height = 34
    const width = (image.width / image.height) * height
    page.drawImage(image, { x: PAGE_MARGIN, y: PAGE_H - 66, width, height })
  } catch {
    drawText(page, 'InsurIQ', PAGE_MARGIN, PAGE_H - 56, 22, bold, WHITE)
  }
  drawText(page, 'Credit Life Savings Quote', PAGE_W - PAGE_MARGIN - 220, PAGE_H - 52, 15, bold, WHITE)
  drawText(page, input.quoteDate, PAGE_W - PAGE_MARGIN - 220, PAGE_H - 70, 9.5, regular, CYAN)

  /* ── Client block (mirrors the Report header) ── */
  let y = PAGE_H - 128
  drawText(page, 'Prepared for', PAGE_MARGIN, y, 8.5, regular, MUTED)
  drawText(page, `${input.firstName} ${input.lastName}`, PAGE_MARGIN, y - 15, 13, bold, INK)
  drawText(page, 'ID Number', PAGE_MARGIN + 250, y, 8.5, regular, MUTED)
  drawText(page, input.idNumber, PAGE_MARGIN + 250, y - 15, 13, bold, INK)

  /* ── Savings summary (the two highlighted figures from the Report) ── */
  y -= 52
  const boxH = 74
  page.drawRectangle({ x: PAGE_MARGIN, y: y - boxH, width: PAGE_W - PAGE_MARGIN * 2, height: boxH, color: NAVY })
  const metrics: Array<{ label: string; value: string; accent?: boolean }> = [
    { label: 'Est. Current CLI', value: formatCents(input.quote.summary.currentMonthlyCents) },
    { label: 'New CLI', value: formatCents(input.quote.summary.newMonthlyCents) },
    { label: 'Total Savings per Month', value: formatCents(input.quote.summary.savingMonthlyCents), accent: true },
    { label: 'Total Savings Per Year', value: formatCents(input.quote.summary.savingAnnualCents), accent: true },
  ]
  const colW = (PAGE_W - PAGE_MARGIN * 2) / metrics.length
  metrics.forEach((metric, i) => {
    const x = PAGE_MARGIN + i * colW + 16
    drawText(page, metric.label, x, y - 24, 8, regular, metric.accent ? CYAN : WHITE)
    drawText(page, metric.value, x, y - 50, 15, bold, metric.accent ? CYAN : WHITE)
  })

  /* ── Term saving headline ── */
  y -= boxH + 18
  const years = input.quote.summary.yearsRemaining
  drawText(
    page,
    `Estimated total saving over ${years} ${years === 1 ? 'year' : 'years'}: ${formatCents(input.quote.summary.termSavingCents)}`,
    PAGE_MARGIN,
    y,
    10.5,
    bold,
    NAVY,
  )

  /* ── Account table (no rate columns) ── */
  y -= 26
  const rowH = 20
  page.drawRectangle({ x: PAGE_MARGIN, y: y - rowH, width: PAGE_W - PAGE_MARGIN * 2, height: rowH, color: INDIGO })
  let x = PAGE_MARGIN
  for (const col of COLUMNS) {
    const textWidth = bold.widthOfTextAtSize(col.header, 8)
    const tx = col.align === 'right' ? x + col.width - textWidth - 8 : x + 8
    drawText(page, col.header, tx, y - 14, 8, bold, WHITE)
    x += col.width
  }

  y -= rowH
  for (const row of input.quote.rows) {
    const cells: string[] = [
      fit(row.provider, regular, 8.5, COLUMNS[0].width - 12),
      fit(creditTypeLabel(row.creditType), regular, 8.5, COLUMNS[1].width - 12),
      row.accountNumber ?? '—',
      formatCents(row.balanceCents),
      formatCents(row.currentMonthlyCents),
      formatCents(row.newMonthlyCents),
      formatCents(row.savingMonthlyCents),
    ]
    x = PAGE_MARGIN
    cells.forEach((cell, i) => {
      const col = COLUMNS[i]
      const textWidth = regular.widthOfTextAtSize(cell, 8.5)
      const tx = col.align === 'right' ? x + col.width - textWidth - 8 : x + 8
      drawText(page, cell, tx, y - 14, 8.5, regular, i === 6 ? NAVY : INK)
      x += col.width
    })
    page.drawLine({
      start: { x: PAGE_MARGIN, y: y - rowH },
      end: { x: PAGE_W - PAGE_MARGIN, y: y - rowH },
      thickness: 0.5,
      color: CLOUD,
    })
    y -= rowH
  }

  /* ── Totals row ── */
  page.drawRectangle({ x: PAGE_MARGIN, y: y - rowH, width: PAGE_W - PAGE_MARGIN * 2, height: rowH, color: CLOUD })
  const totals: string[] = [
    'Total',
    '',
    '',
    formatCents(input.quote.summary.totalBalanceCents),
    formatCents(input.quote.summary.currentMonthlyCents),
    formatCents(input.quote.summary.newMonthlyCents),
    formatCents(input.quote.summary.savingMonthlyCents),
  ]
  x = PAGE_MARGIN
  totals.forEach((cell, i) => {
    const col = COLUMNS[i]
    const textWidth = bold.widthOfTextAtSize(cell, 8.5)
    const tx = col.align === 'right' ? x + col.width - textWidth - 8 : x + 8
    drawText(page, cell, tx, y - 14, 8.5, bold, i === 6 ? NAVY : INK)
    x += col.width
  })

  /* ── Footer — regulatory compliance block ── */
  const footerY = 64
  page.drawLine({
    start: { x: PAGE_MARGIN, y: footerY + 40 },
    end: { x: PAGE_W - PAGE_MARGIN, y: footerY + 40 },
    thickness: 0.75,
    color: CLOUD,
  })
  drawText(
    page,
    `${SITE.name} is an Authorised Financial Services Provider · ${REGULATORY.fspNumber} · © ${new Date().getFullYear()} ${SITE.name}`,
    PAGE_MARGIN,
    footerY + 24,
    7.5,
    bold,
    MUTED,
  )
  const footerLines = [
    'This quote is an indicative estimate based on the information you provided and is not a binding offer.',
    'Your final premium is confirmed after underwriting assessment. Estimates compare your current credit life',
    'premiums against InsurIQ pricing; actual savings depend on your credit agreements. FAIS Disclosure,',
    `Privacy Policy (POPIA) and Complaints Procedure: ${SITE.url}/fais-disclosure · ${SITE.url}/privacy-policy · ${SITE.url}/complaints`,
  ]
  footerLines.forEach((line, i) => {
    drawText(page, line, PAGE_MARGIN, footerY + 10 - i * 10, 7, regular, MUTED)
  })

  return doc.save()
}
