import { CTA } from '@/components/marketing/cta'
import { FAQ } from '@/components/marketing/faq'
import { Features } from '@/components/marketing/features'
import { Hero } from '@/components/marketing/hero'
import { MiniCaseStudy } from '@/components/marketing/mini-case-study'
import { PricingPreview } from '@/components/marketing/pricing-preview'

export function HomepageSections() {
  return (
    <>
      <Hero />
      <MiniCaseStudy />
      <Features />
      <PricingPreview />
      <FAQ />
      <CTA />
    </>
  )
}
