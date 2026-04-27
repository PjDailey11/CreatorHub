import { NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'
import { logError, logInfo } from '@/lib/logger'

export async function POST(request: Request) {
  const requestId = crypto.randomUUID()
  try {
    const stripe = getStripe()
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single()

    if (!profile?.stripe_customer_id) {
      return NextResponse.json({ error: 'No subscription found' }, { status: 400 })
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: profile.stripe_customer_id,
      return_url: `${request.headers.get('origin')}/settings`,
    })

    logInfo({
      scope: 'stripe.portal',
      event: 'billing_portal_session_created',
      requestId,
      userId: user.id,
      customerId: profile.stripe_customer_id,
    })

    return NextResponse.json({ url: portalSession.url })
  } catch (error) {
    logError({
      scope: 'stripe.portal',
      event: 'billing_portal_session_failed',
      requestId,
      error: error instanceof Error ? error.message : 'unknown error',
    })
    return NextResponse.json(
      { error: 'Failed to create portal session' },
      { status: 500 }
    )
  }
}
