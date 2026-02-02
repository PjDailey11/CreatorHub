'use client'

import { useState } from 'react'
import { PricingPlan } from '@/lib/pricing'

export function useCheckout() {
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const checkout = async (plan: PricingPlan) => {
    setLoading(plan)
    setError(null)

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      })

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      } else if (data.error === 'Unauthorized') {
        // Redirect to signup if not logged in
        window.location.href = '/signup?redirect=pricing'
      } else {
        setError(data.error || 'Failed to start checkout')
      }
    } catch {
      setError('Failed to start checkout')
    } finally {
      setLoading(null)
    }
  }

  return { checkout, loading, error }
}
