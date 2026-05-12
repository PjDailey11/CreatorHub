'use client'

import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import {
  POPULAR_PRICING_PLAN,
  PRICING_COPY,
  PRICING_PLAN_ORDER,
  PRICING_PLANS,
} from '@/lib/pricing'
import { ArrowRight, Check, CreditCard, Sparkles } from 'lucide-react'

export function PricingPreview() {
  return (
    <section id="pricing" className="py-24 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-pink-200/30 to-purple-200/30 dark:from-pink-900/20 dark:to-purple-900/20 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-16">
          <Badge className="mb-5 bg-gradient-to-r from-pink-500/10 to-purple-500/10 dark:from-pink-500/20 dark:to-purple-500/20 text-pink-600 dark:text-pink-400 border-pink-200/50 dark:border-pink-800/50 px-5 py-2 text-sm font-medium">
            <CreditCard className="h-4 w-4 mr-2" />
            Pricing
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-5 tracking-tight text-gray-900 dark:text-white">
            Start small. Upgrade when the workflow{' '}
            <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              feels worth keeping
            </span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-medium">
            {PRICING_COPY.pricingPreviewSummary}
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
          {PRICING_PLAN_ORDER.map((planKey, index) => {
            const plan = PRICING_PLANS[planKey]
            const isPopular = planKey === POPULAR_PRICING_PLAN

            return (
              <Card
                key={planKey}
                className={`relative flex flex-col overflow-hidden transition-all duration-500 hover:-translate-y-2 ${
                  isPopular
                    ? 'border-2 border-pink-500 dark:border-pink-400 shadow-2xl shadow-pink-500/20 scale-105 z-10 bg-white dark:bg-gray-800'
                    : 'border border-gray-200 dark:border-gray-700 shadow-xl bg-white dark:bg-gray-800/50 hover:border-pink-300 dark:hover:border-pink-700'
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-1.5 shadow-lg">
                      <Sparkles className="h-3 w-3 mr-1" />
                      Recommended starting point
                    </Badge>
                  </div>
                )}

                {/* Top gradient accent for popular plan */}
                {isPopular && (
                  <div className="h-1 bg-gradient-to-r from-pink-500 to-purple-600" />
                )}

                <CardHeader className="text-center pb-2 pt-8">
                  <CardTitle className="text-2xl text-gray-900 dark:text-white">{plan.name}</CardTitle>
                  <p className="mt-3 min-h-12 text-sm leading-6 text-gray-500 dark:text-gray-400">
                    {plan.description}
                  </p>
                  <div className="mt-4">
                    <span className="text-5xl font-bold text-gray-900 dark:text-white">${plan.price}</span>
                    <span className="text-gray-500 dark:text-gray-400 font-medium">/month</span>
                  </div>
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
                  <div className="w-full">
                    <Link href="/signup" className="w-full">
                      <Button
                        className={`w-full py-6 text-lg font-semibold group ${
                          isPopular
                            ? 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40'
                            : 'bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-gray-900'
                        }`}
                      >
                        {PRICING_COPY.primaryCtaLabel}
                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                    <p className="mt-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400">
                      {PRICING_COPY.noCardRequiredLabel}
                    </p>
                  </div>
                </CardFooter>
              </Card>
            )
          })}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-500 dark:text-gray-400 font-medium">
            {PRICING_COPY.pricingFooterSummary}
          </p>
          <div className="flex items-center justify-center gap-6 mt-4 text-sm text-gray-400 dark:text-gray-500">
            <span className="flex items-center gap-1">
              <Check className="h-4 w-4 text-green-500" />
              14-day Pro trial
            </span>
            <span className="flex items-center gap-1">
              <Check className="h-4 w-4 text-green-500" />
              {PRICING_COPY.cancelAnytimeLabel}
            </span>
            <span className="flex items-center gap-1">
              <Check className="h-4 w-4 text-green-500" />
              {PRICING_COPY.chooseWhenReadyLabel}
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
