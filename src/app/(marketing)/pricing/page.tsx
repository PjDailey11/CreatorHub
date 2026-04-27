'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Check, X, CreditCard, Sparkles, ArrowRight } from 'lucide-react'
import { PRICING_PLANS } from '@/lib/pricing'

const planOrder = ['starter', 'pro', 'agency'] as const

const comparisonFeatures = [
  { name: 'Subscribers', starter: 'Up to 500', pro: 'Up to 5,000', agency: 'Unlimited' },
  { name: 'DM Funnels', starter: '3 active', pro: 'Unlimited', agency: 'Unlimited' },
  { name: 'Analytics', starter: 'Basic', pro: 'Advanced', agency: 'White-label' },
  { name: 'PPV Recommendations', starter: true, pro: true, agency: true },
  { name: 'AI-Powered Optimization', starter: false, pro: true, agency: true },
  { name: 'Source Attribution', starter: false, pro: true, agency: true },
  { name: 'Multi-Account Management', starter: false, pro: false, agency: true },
  { name: 'API Access', starter: false, pro: false, agency: true },
  { name: 'Support', starter: 'Email', pro: 'Priority', agency: 'Dedicated Manager' },
  { name: 'Custom Integrations', starter: false, pro: false, agency: true },
]

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly')

  const getPrice = (basePrice: number) => {
    if (billingPeriod === 'yearly') {
      return Math.round(basePrice * 10) // 2 months free on yearly
    }
    return basePrice
  }

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
              Perfect Plan
            </span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
            Start with a 14-day free trial. No credit card required. 
            Upgrade, downgrade, or cancel anytime.
          </p>

          {/* Billing toggle */}
          <div className="inline-flex items-center gap-1 p-1.5 bg-gray-100 dark:bg-gray-800 rounded-xl">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                billingPeriod === 'monthly'
                  ? 'bg-white dark:bg-gray-700 shadow-md text-gray-900 dark:text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod('yearly')}
              className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center ${
                billingPeriod === 'yearly'
                  ? 'bg-white dark:bg-gray-700 shadow-md text-gray-900 dark:text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Yearly
              <Badge className="ml-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs">Save 17%</Badge>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto mb-20">
          {planOrder.map((planKey, index) => {
            const plan = PRICING_PLANS[planKey]
            const isPopular = planKey === 'pro'
            const price = getPrice(plan.price)

            return (
              <Card
                key={planKey}
                className={`relative flex flex-col transition-all duration-500 hover:-translate-y-2 ${
                  isPopular
                    ? 'border-2 border-pink-500 dark:border-pink-400 shadow-2xl shadow-pink-500/20 scale-105 z-10 bg-white dark:bg-gray-800'
                    : 'border border-gray-200 dark:border-gray-700 shadow-xl bg-white dark:bg-gray-800/50'
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-1.5 shadow-lg">
                      <Sparkles className="h-3 w-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}

                {isPopular && (
                  <div className="h-1 bg-gradient-to-r from-pink-500 to-purple-600" />
                )}

                <CardHeader className="text-center pb-2 pt-8">
                  <CardTitle className="text-2xl text-gray-900 dark:text-white">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-5xl font-bold text-gray-900 dark:text-white">${price}</span>
                    <span className="text-gray-500 dark:text-gray-400">
                      /{billingPeriod === 'yearly' ? 'year' : 'month'}
                    </span>
                  </div>
                  {billingPeriod === 'yearly' && (
                    <p className="text-sm text-green-600 dark:text-green-400 mt-1 font-medium">
                      ${plan.price * 2} savings per year
                    </p>
                  )}
                </CardHeader>

                <CardContent className="flex-1 pt-6">
                  <ul className="space-y-4">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3">
                        <div className={`flex-shrink-0 w-5 h-5 rounded-full ${isPopular ? 'bg-gradient-to-r from-pink-500 to-purple-600' : 'bg-green-500'} flex items-center justify-center mt-0.5`}>
                          <Check className="h-3 w-3 text-white" />
                        </div>
                        <span className="text-gray-600 dark:text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter className="pt-6">
                  <Link href="/signup" className="w-full">
                    <Button
                      size="lg"
                      className={`w-full py-6 font-semibold group ${
                        isPopular
                          ? 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 shadow-lg shadow-pink-500/25'
                          : 'bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-gray-900'
                      }`}
                    >
                      Start Free Trial
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
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
                {comparisonFeatures.map((feature, index) => (
                  <tr 
                    key={feature.name} 
                    className={`border-b border-gray-100 dark:border-gray-800 ${
                      index % 2 === 0 ? 'bg-white dark:bg-gray-900/50' : 'bg-gray-50/50 dark:bg-gray-800/30'
                    }`}
                  >
                    <td className="py-4 px-6 text-gray-700 dark:text-gray-300 font-medium">{feature.name}</td>
                    {['starter', 'pro', 'agency'].map((plan) => {
                      const value = feature[plan as keyof typeof feature]
                      const isPro = plan === 'pro'
                      return (
                        <td key={plan} className={`py-4 px-6 text-center ${isPro ? 'bg-pink-50/30 dark:bg-pink-900/5' : ''}`}>
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
            <Button variant="ghost" size="lg" className="dark:text-gray-300 dark:hover:bg-gray-800">
              Contact Support
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
