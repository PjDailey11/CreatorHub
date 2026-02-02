// Client-safe pricing plan data (no Stripe/env imports)

export const PRICING_PLANS = {
  starter: {
    name: 'Starter',
    price: 49,
    features: [
      'Up to 500 subscribers',
      '3 active DM funnels',
      'Basic analytics',
      'PPV price recommendations',
      'Email support',
    ],
  },
  pro: {
    name: 'Pro',
    price: 149,
    features: [
      'Up to 5,000 subscribers',
      'Unlimited DM funnels',
      'Advanced analytics',
      'AI-powered PPV optimization',
      'Content source tracking',
      'Priority support',
    ],
  },
  agency: {
    name: 'Agency',
    price: 499,
    features: [
      'Unlimited subscribers',
      'Unlimited DM funnels',
      'White-label analytics',
      'Multi-account management',
      'API access',
      'Dedicated account manager',
    ],
  },
} as const

export type PricingPlan = keyof typeof PRICING_PLANS
