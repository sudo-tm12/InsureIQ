import type { NextConfig } from 'next'

/**
 * Baseline security headers for every response. The Content-Security-Policy
 * is set per request (with a nonce) in src/proxy.ts.
 */
const SECURITY_HEADERS = [
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()',
  },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
]

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Files read from disk at runtime are not traced into the serverless
  // function automatically; without this the PDF quote silently loses its logo.
  outputFileTracingIncludes: {
    '/api/quote/send': ['./public/images/logo/insuriq-logo-compact-reverse.png'],
  },
  images: {
    // Blog cover images from the CMS.
    remotePatterns: [{ protocol: 'https', hostname: 'cdn.sanity.io' }],
  },
  async headers() {
    return [
      { source: '/:path*', headers: SECURITY_HEADERS },
      {
        // API responses carry personal data or quotes: never cache or index them.
        source: '/api/:path*',
        headers: [
          { key: 'Cache-Control', value: 'no-store' },
          { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
        ],
      },
    ]
  },
}

export default nextConfig
