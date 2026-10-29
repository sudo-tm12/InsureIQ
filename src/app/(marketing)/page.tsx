import type { Metadata } from 'next'
import { SITE } from '@/lib/constants'
import { HeroSection } from '@/components/sections/HeroSection'
import { StatsBar } from '@/components/sections/StatsBar'
import { ProblemSolution } from '@/components/sections/ProblemSolution'
import { ProductsSection } from '@/components/sections/ProductsSection'
import { HowItWorksSection } from '@/components/sections/HowItWorksSection'
import { WhyInsurIQ } from '@/components/sections/WhyInsurIQ'
import { BlogPreviewSection } from '@/components/sections/BlogPreviewSection'
import { CTABanner } from '@/components/sections/CTABanner'

export const revalidate = 60

export const metadata: Metadata = {
  alternates: { canonical: '/' },
  title: { absolute: 'InsurIQ — Intelligent Insurance Solutions' },
  description:
    'Affordable, transparent credit life insurance for South Africans. FSCA licensed. Get your quote in 60 seconds.',
  openGraph: {
    type: 'website',
    locale: 'en_ZA',
    url: SITE.url,
    siteName: SITE.name,
    title: 'InsurIQ — Intelligent Insurance Solutions',
    description:
      'Affordable, transparent credit life insurance for South Africans. FSCA licensed. Get your quote in 60 seconds.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'InsurIQ — Intelligent Insurance Solutions',
    description:
      'Affordable, transparent credit life insurance for South Africans. FSCA licensed. Get your quote in 60 seconds.',
  },
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsBar />
      <ProblemSolution />
      <ProductsSection />
      <HowItWorksSection />
      <WhyInsurIQ />
      <BlogPreviewSection />
      <CTABanner />
    </>
  )
}
