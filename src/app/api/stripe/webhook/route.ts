import { NextResponse } from 'next/server'
import * as Sentry from '@sentry/nextjs'
import { getStripe } from '@/lib/stripe'
import { createAdminClient } from '@/lib/supabase/server'
import { logError, logInfo } from '@/lib/logger'
import Stripe from 'stripe'

type WebhookEventStatus = 'processing' | 'succeeded' | 'failed'

function resolveTier(priceId: string): 'starter' | 'pro' | 'agency' {
  if (priceId === process.env.STRIPE_PRO_PRICE_ID) return 'pro'
  if (priceId === process.env.STRIPE_AGENCY_PRICE_ID) return 'agency'
  return 'starter'
}

export async function POST(request: Request) {
  const requestId = crypto.randomUUID()
  const stripe = getStripe()
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) {
    return NextResponse.json({ error: 'STRIPE_WEBHOOK_SECRET is not configured' }, { status: 500 })
  }

  const body = await request.text()
  const signature = request.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (error) {
    logError({
      scope: 'stripe.webhook',
      event: 'signature_verification_failed',
      requestId,
      error: error instanceof Error ? error.message : 'unknown error',
    })
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = createAdminClient()
  const nowIso = new Date().toISOString()
  const { data: existingEvent } = await supabase
    .from('stripe_webhook_events')
    .select('id, status, attempts')
    .eq('stripe_event_id', event.id)
    .maybeSingle()

  if (existingEvent?.status === 'succeeded') {
    logInfo({
      scope: 'stripe.webhook',
      event: 'duplicate_event_skipped',
      requestId,
      eventId: event.id,
      eventType: event.type,
    })
    return NextResponse.json({ received: true, duplicate: true })
  }

  const attempts = (existingEvent?.attempts ?? 0) + 1
  const statusPayload: {
    stripe_event_id: string
    event_type: string
    status: WebhookEventStatus
    attempts: number
    last_error: string | null
    updated_at: string
  } = {
    stripe_event_id: event.id,
    event_type: event.type,
    status: 'processing',
    attempts,
    last_error: null,
    updated_at: nowIso,
  }

  if (existingEvent?.id) {
    await supabase
      .from('stripe_webhook_events')
      .update(statusPayload)
      .eq('id', existingEvent.id)
  } else {
    await supabase
      .from('stripe_webhook_events')
      .insert({
        ...statusPayload,
        processed_at: null,
      })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.subscription
          ? (await stripe.subscriptions.retrieve(session.subscription as string)).metadata.supabase_user_id
          : session.metadata?.supabase_user_id

        if (userId) {
          // Get the subscription to determine the plan
          const subscription = await stripe.subscriptions.retrieve(session.subscription as string)
          const priceId = subscription.items.data[0].price.id
          const tier = resolveTier(priceId)

          await supabase
            .from('profiles')
            .update({
              subscription_tier: tier,
              stripe_subscription_id: subscription.id,
            })
            .eq('id', userId)
        }
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const userId = subscription.metadata.supabase_user_id

        if (userId) {
          const priceId = subscription.items.data[0].price.id
          const tier = resolveTier(priceId)

          // Handle cancelled subscriptions
          if (subscription.cancel_at_period_end) {
            // Subscription will be cancelled at period end, keep current tier
          } else if (subscription.status === 'active') {
            await supabase
              .from('profiles')
              .update({ subscription_tier: tier })
              .eq('id', userId)
          }
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const userId = subscription.metadata.supabase_user_id

        if (userId) {
          await supabase
            .from('profiles')
            .update({
              subscription_tier: 'free',
              stripe_subscription_id: null,
            })
            .eq('id', userId)
        }
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        // Optionally send an email or notification about failed payment
        console.log('Payment failed for invoice:', invoice.id)
        break
      }
    }

    await supabase
      .from('stripe_webhook_events')
      .update({
        status: 'succeeded',
        processed_at: new Date().toISOString(),
        last_error: null,
        updated_at: new Date().toISOString(),
      })
      .eq('stripe_event_id', event.id)

    logInfo({
      scope: 'stripe.webhook',
      event: 'event_processed',
      requestId,
      eventId: event.id,
      eventType: event.type,
      attempts,
    })

    return NextResponse.json({ received: true })
  } catch (error) {
    Sentry.captureException(error, {
      tags: {
        scope: 'stripe.webhook',
        eventType: event.type,
      },
      extra: {
        eventId: event.id,
        requestId,
      },
    })

    const errorMessage =
      error instanceof Error ? error.message : 'unknown webhook error'

    await supabase
      .from('stripe_webhook_events')
      .update({
        status: 'failed',
        last_error: errorMessage,
        updated_at: new Date().toISOString(),
      })
      .eq('stripe_event_id', event.id)

    logError({
      scope: 'stripe.webhook',
      event: 'event_processing_failed',
      requestId,
      eventId: event.id,
      eventType: event.type,
      error: errorMessage,
    })
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}
