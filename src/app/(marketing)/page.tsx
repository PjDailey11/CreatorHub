import { Hero } from '@/components/marketing/hero'
import { Stats } from '@/components/marketing/stats'
import { Features } from '@/components/marketing/features'
import { Testimonials } from '@/components/marketing/testimonials'
import { PricingPreview } from '@/components/marketing/pricing-preview'
import { FAQ } from '@/components/marketing/faq'
import { CTA } from '@/components/marketing/cta'

export default function HomePage() {
  return (
    <>
      <Hero />
      <Stats />
      <Features />
      <Testimonials />
      <PricingPreview />
      <FAQ />
      <CTA />
    </>
  )
}
