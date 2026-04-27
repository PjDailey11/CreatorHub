export * from './database'
import type { Tables } from './database'

// Table types
export type Profile = Tables<'profiles'>
export type Subscriber = Tables<'subscribers'>
export type Funnel = Tables<'funnels'>
export type FunnelStep = Tables<'funnel_steps'>

export interface SubscriberStats {
  totalSubscribers: number
  activeSubscribers: number
  mrr: number
  churnRate: number
  avgLtv: number
}

export interface FunnelWithSteps {
  id: string
  user_id: string
  name: string
  trigger_type: string | null
  status: string
  created_at: string
  steps: FunnelStepWithDetails[]
}

export interface FunnelStepWithDetails {
  id: string
  funnel_id: string
  step_order: number
  step_type: 'message' | 'delay' | 'condition'
  content: {
    message?: string
    delay_minutes?: number
    condition?: {
      field: string
      operator: 'equals' | 'greater_than' | 'less_than' | 'contains'
      value: string | number
    }
  }
  created_at: string
}

export interface PPVPricingFactors {
  subscriberTier: string
  engagementScore: number
  previousPurchases: number
  avgPurchaseValue: number
  daysSubscribed: number
}

export interface AnalyticsData {
  channelBreakdown: {
    channel: string
    subscribers: number
    revenue: number
  }[]
  acquisitionTrends: {
    date: string
    newSubscribers: number
    revenue: number
  }[]
  topSources: {
    source: string
    subscribers: number
    conversionRate: number
  }[]
}
