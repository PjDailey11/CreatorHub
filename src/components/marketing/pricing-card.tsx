'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Check, Loader2, Sparkles } from 'lucide-react'
import { useCheckout } from '@/hooks/use-checkout'
import { PricingPlan } from '@/lib/pricing'

interface PricingCardProps {
  planKey: PricingPlan
  name: string
  price: number
  features: readonly string[]
  isPopular?: boolean
  billingLabel?: string
}

export function PricingCard({
  planKey,
  name,
  price,
  features,
  isPopular = false,
  billingLabel = '/month',
}: PricingCardProps) {
  const { checkout, loading } = useCheckout()
  const isLoading = loading === planKey

  return (
    <Card
      className={`relative flex flex-col ${
        isPopular
          ? 'border-2 border-pink-500 shadow-xl scale-105 z-10'
          : 'border shadow-lg'
      }`}
    >
      {isPopular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <Badge className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-1">
            <Sparkles className="h-3 w-3 mr-1" />
            Most Popular
          </Badge>
        </div>
      )}

      <CardHeader className="text-center pb-2 pt-8">
        <CardTitle className="text-2xl">{name}</CardTitle>
        <div className="mt-4">
          <span className="text-5xl font-bold">${price}</span>
          <span className="text-gray-500">{billingLabel}</span>
        </div>
      </CardHeader>

      <CardContent className="flex-1 pt-6">
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-gray-600">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter className="pt-6">
        <Button
          size="lg"
          className={`w-full ${
            isPopular
              ? 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700'
              : ''
          }`}
          variant={isPopular ? 'default' : 'outline'}
          onClick={() => checkout(planKey)}
          disabled={isLoading}
        >
          {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          Start Free Trial
        </Button>
      </CardFooter>
    </Card>
  )
}
