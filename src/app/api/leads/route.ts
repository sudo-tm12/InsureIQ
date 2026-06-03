import { NextRequest, NextResponse } from 'next/server'
import { contactFormSchema } from '@/lib/validations'

// Simple in-memory rate limiter — resets on cold start, suitable for Phase 1
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
const MAX_REQUESTS = 3
const WINDOW_MS = 60 * 60 * 1000 // 1 hour

function getIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'
  )
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return true
  }

  if (entry.count >= MAX_REQUESTS) return false

  entry.count += 1
  return true
}

export async function POST(req: NextRequest) {
  const ip = getIp(req)

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 },
    )
  }

  try {
    const body = await req.json()
    const data = contactFormSchema.parse(body)

    // TODO: Wire to Resend for email notification to Eddie
    // TODO: Wire to Sanity CMS to log the lead
    console.log('New lead:', {
      name: `${data.firstName} ${data.lastName}`,
      email: data.email,
      phone: data.phone,
      loanType: data.loanType,
      loanAmount: data.loanAmount,
      source: (body as { source?: string }).source ?? 'contact-form',
      consentTimestamp: new Date().toISOString(),
    })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('Lead submission error:', error)
    return NextResponse.json({ error: 'Invalid submission' }, { status: 400 })
  }
}
