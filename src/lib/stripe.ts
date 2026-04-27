import 'server-only'
import Stripe from 'stripe'
import type { PricingPlan } from './pricing'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-01-28.clover',
  typescript: true,
})

export function getPriceId(plan: PricingPlan): string | undefined {
  const ids: Record<PricingPlan, string | undefined> = {
    starter: process.env.STRIPE_STARTER_PRICE_ID,
    pro: process.env.STRIPE_PRO_PRICE_ID,
    agency: process.env.STRIPE_AGENCY_PRICE_ID,
  }
  return ids[plan]
}
