import { NextResponse, type NextRequest } from 'next/server'

/**
 * Per-request nonce-based Content Security Policy for every page.
 *
 * Scripts: only those carrying this request's nonce may run ('strict-dynamic'
 * lets them load Next's chunks), so an injected <script> or inline handler
 * is blocked even if markup injection ever slips through.
 * Styles: 'unsafe-inline' is required for React style attributes and Framer
 * Motion, which nonces cannot cover; style injection cannot execute code.
 * Next.js reads the nonce from the request's CSP header during rendering —
 * the root layout opts every page into per-request rendering for this.
 */
function contentSecurityPolicy(nonce: string): string {
  const isDev = process.env.NODE_ENV === 'development'
  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ''}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https://cdn.sanity.io",
    "font-src 'self'",
    "connect-src 'self'",
    "frame-src 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    ...(isDev ? [] : ['upgrade-insecure-requests']),
  ].join('; ')
}

export function proxy(request: NextRequest) {
  const nonce = btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(16))))
  const csp = contentSecurityPolicy(nonce)

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-nonce', nonce)
  requestHeaders.set('Content-Security-Policy', csp)

  const response = NextResponse.next({ request: { headers: requestHeaders } })
  response.headers.set('Content-Security-Policy', csp)
  return response
}

export const config = {
  matcher: [
    {
      // Pages only: API routes, build assets, public files and metadata routes
      // (robots, sitemap, share image) don't render HTML.
      source:
        '/((?!api/|_next/static|_next/image|images/|favicon.ico|robots.txt|sitemap.xml|opengraph-image).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
}
