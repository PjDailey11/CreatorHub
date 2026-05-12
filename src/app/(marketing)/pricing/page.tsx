import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PricingCard } from '@/components/marketing/pricing-card'
import {
  POPULAR_PRICING_PLAN,
  PRICING_COMPARISON_ROWS,
  PRICING_COPY,
  PRICING_PLAN_ORDER,
  PRICING_PLANS,
} from '@/lib/pricing'
import { Check, CreditCard, X } from 'lucide-react'

export default function PricingPage() {
  return (
    <div className="py-20 min-h-screen bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="mb-5 bg-gradient-to-r from-pink-500/10 to-purple-500/10 dark:from-pink-500/20 dark:to-purple-500/20 text-pink-600 dark:text-pink-400 border-pink-200/50 dark:border-pink-800/50 px-5 py-2 text-sm font-medium">
            <CreditCard className="h-4 w-4 mr-2" />
            Simple, Transparent Pricing
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-5 text-gray-900 dark:text-white">
            Choose the{' '}
            <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              plan that fits
            </span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
            {PRICING_COPY.pricingPageSummary}
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto mb-20">
          {PRICING_PLAN_ORDER.map((planKey) => {
            const plan = PRICING_PLANS[planKey]
            return (
              <PricingCard
                key={planKey}
                planKey={planKey}
                name={plan.name}
                description={plan.description}
                price={plan.price}
                features={plan.features}
                isPopular={planKey === POPULAR_PRICING_PLAN}
              />
            )
          })}
        </div>

        {/* Feature Comparison Table */}
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8 text-gray-900 dark:text-white">Compare All Features</h2>

          <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                  <th className="py-5 px-6 text-left font-bold text-gray-900 dark:text-white">Feature</th>
                  <th className="py-5 px-6 text-center font-bold text-gray-900 dark:text-white">Starter</th>
                  <th className="py-5 px-6 text-center font-bold text-pink-600 dark:text-pink-400 bg-pink-50/50 dark:bg-pink-900/10">Pro</th>
                  <th className="py-5 px-6 text-center font-bold text-gray-900 dark:text-white">Agency</th>
                </tr>
              </thead>
              <tbody>
                {PRICING_COMPARISON_ROWS.map((feature, index) => (
                  <tr 
                    key={feature.key} 
                    className={`border-b border-gray-100 dark:border-gray-800 ${
                      index % 2 === 0 ? 'bg-white dark:bg-gray-900/50' : 'bg-gray-50/50 dark:bg-gray-800/30'
                    }`}
                  >
                    <td className="py-4 px-6 text-gray-700 dark:text-gray-300 font-medium">{feature.label}</td>
                    {PRICING_PLAN_ORDER.map((planKey) => {
                      const value = PRICING_PLANS[planKey].comparison[feature.key]
                      const isPro = planKey === POPULAR_PRICING_PLAN
                      return (
                        <td key={planKey} className={`py-4 px-6 text-center ${isPro ? 'bg-pink-50/30 dark:bg-pink-900/5' : ''}`}>
                          {typeof value === 'boolean' ? (
                            value ? (
                              <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto">
                                <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                              </div>
                            ) : (
                              <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto">
                                <X className="h-4 w-4 text-gray-400 dark:text-gray-600" />
                              </div>
                            )
                          ) : (
                            <span className="text-gray-700 dark:text-gray-300 font-medium">{value}</span>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ CTA */}
        <div className="max-w-2xl mx-auto mt-20 text-center">
          <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Still have questions?</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Check out our FAQ or reach out to our support team. 
            We&apos;re here to help you choose the right plan.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/#faq">
              <Button variant="outline" size="lg" className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">
                View FAQ
              </Button>
            </Link>
            <Button asChild variant="ghost" size="lg" className="dark:text-gray-300 dark:hover:bg-gray-800">
              <Link href="/contact">
                Contact Support
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
