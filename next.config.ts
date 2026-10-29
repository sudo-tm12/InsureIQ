import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Files read from disk at runtime are not traced into the serverless
  // function automatically; without this the PDF quote silently loses its logo.
  outputFileTracingIncludes: {
    '/api/quote/send': ['./public/images/logo/insuriq-logo-compact-reverse.png'],
  },
}

export default nextConfig
