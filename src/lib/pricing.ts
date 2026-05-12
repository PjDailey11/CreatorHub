// Client-safe pricing plan data and copy (no Stripe/env imports)

export type PricingPlan = 'starter' | 'pro' | 'agency'

interface PricingPlanComparison {
  subscribers: string
  dmFunnels: string
  analytics: string
  ppvRecommendations: boolean
  aiPoweredOptimization: boolean
  sourceAttribution: boolean
  multiAccountManagement: boolean
  apiAccess: boolean
  support: string
  customIntegrations: boolean
}

export interface PricingPlanDetails {
  name: string
  price: number
  description: string
  features: readonly string[]
  comparison: PricingPlanComparison
}

type PricingComparisonKey = keyof PricingPlanComparison

export const PRICING_PLAN_ORDER = ['starter', 'pro', 'agency'] as const satisfies readonly PricingPlan[]
export const POPULAR_PRICING_PLAN: PricingPlan = 'pro'
export const PRICING_TRIAL_DAYS = 14
export const PRICING_TRIAL_PLAN_NAME = 'Pro'
export const PRICING_TRIAL_LABEL = `${PRICING_TRIAL_DAYS}-day ${PRICING_TRIAL_PLAN_NAME} trial`

export const PRICING_COPY = {
  primaryCtaLabel: 'Start 14-Day Pro Trial',
  secondaryCtaLabel: 'View Pricing',
  pricingPreviewSummary:
    `Every account starts with a ${PRICING_TRIAL_LABEL}, so you can test automation, pricing, and reporting before you choose the paid plan that fits.`,
  pricingPageSummary:
    `Every new account starts with a ${PRICING_TRIAL_LABEL}. No credit card required. Choose the paid plan that fits once you know your subscriber volume.`,
  pricingFooterSummary:
    `Start with a ${PRICING_TRIAL_LABEL}, then choose Starter, Pro, or Agency once you know what volume and automation you need.`,
  noCardRequiredLabel: 'No credit card required',
  cancelAnytimeLabel: 'Cancel anytime',
  chooseWhenReadyLabel: 'Choose your paid plan when the trial ends',
  importHelpLabel: 'Import help included',
} as const

export const PRICING_COMPARISON_ROWS = [
  { label: 'Subscribers', key: 'subscribers' },
  { label: 'DM Funnels', key: 'dmFunnels' },
  { label: 'Analytics', key: 'analytics' },
  { label: 'PPV Recommendations', key: 'ppvRecommendations' },
  { label: 'AI-Powered Optimization', key: 'aiPoweredOptimization' },
  { label: 'Source Attribution', key: 'sourceAttribution' },
  { label: 'Multi-Account Management', key: 'multiAccountManagement' },
  { label: 'API Access', key: 'apiAccess' },
  { label: 'Support', key: 'support' },
  { label: 'Custom Integrations', key: 'customIntegrations' },
] as const satisfies readonly { label: string; key: PricingComparisonKey }[]

const starterSubscriberLimit = 'Up to 500'
const proSubscriberLimit = 'Up to 5,000'
const agencySubscriberLimit = 'Unlimited'

export const PRICING_PLANS: Record<PricingPlan, PricingPlanDetails> = {
  starter: {
    name: 'Starter',
    price: 49,
    description: 'For solo creators getting organized before complexity piles up.',
    features: [
      `${starterSubscriberLimit} subscribers`,
      '3 active DM funnels',
      'Basic analytics',
      'PPV price recommendations',
      'Email support',
    ],
    comparison: {
      subscribers: starterSubscriberLimit,
      dmFunnels: '3 active',
      analytics: 'Basic',
      ppvRecommendations: true,
      aiPoweredOptimization: false,
      sourceAttribution: false,
      multiAccountManagement: false,
      apiAccess: false,
      support: 'Email',
      customIntegrations: false,
    },
  },
  pro: {
    name: 'Pro',
    price: 149,
    description: 'For growing creators who want funnels, pricing signals, and better retention.',
    features: [
      `${proSubscriberLimit} subscribers`,
      'Unlimited DM funnels',
      'Advanced analytics',
      'AI-powered PPV optimization',
      'Content source tracking',
      'Priority support',
    ],
    comparison: {
      subscribers: proSubscriberLimit,
      dmFunnels: 'Unlimited',
      analytics: 'Advanced',
      ppvRecommendations: true,
      aiPoweredOptimization: true,
      sourceAttribution: true,
      multiAccountManagement: false,
      apiAccess: false,
      support: 'Priority',
      customIntegrations: false,
    },
  },
  agency: {
    name: 'Agency',
    price: 499,
    description: 'For managers running multiple creator accounts with shared visibility.',
    features: [
      `${agencySubscriberLimit} subscribers`,
      'Unlimited DM funnels',
      'White-label analytics',
      'Multi-account management',
      'API access',
      'Dedicated account manager',
    ],
    comparison: {
      subscribers: agencySubscriberLimit,
      dmFunnels: 'Unlimited',
      analytics: 'White-label',
      ppvRecommendations: true,
      aiPoweredOptimization: true,
      sourceAttribution: true,
      multiAccountManagement: true,
      apiAccess: true,
      support: 'Dedicated manager',
      customIntegrations: true,
    },
  },
}
