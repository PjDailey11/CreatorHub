import 'server-only'
import Stripe from 'stripe'
import type { PricingPlan } from './pricing'

let stripeClient: Stripe | null = null

export function getStripe(): Stripe {
  if (stripeClient) return stripeClient

  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey) {
    throw new Error('STRIPE_SECRET_KEY is not configured')
  }

  stripeClient = new Stripe(secretKey, {
    apiVersion: '2026-01-28.clover',
    typescript: true,
  })

  return stripeClient
}

export function getPriceId(plan: PricingPlan): string | undefined {
  const ids: Record<PricingPlan, string | undefined> = {
    starter: process.env.STRIPE_STARTER_PRICE_ID,
    pro: process.env.STRIPE_PRO_PRICE_ID,
    agency: process.env.STRIPE_AGENCY_PRICE_ID,
  }
  return ids[plan]
}
