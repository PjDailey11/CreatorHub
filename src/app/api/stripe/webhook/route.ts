import { NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { createAdminClient } from '@/lib/supabase/server'
import Stripe from 'stripe'

export async function POST(request: Request) {
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
    console.error('Webhook signature verification failed:', error)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = createAdminClient()

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
          
          // Determine tier based on price ID
          let tier = 'starter'
          if (priceId === process.env.STRIPE_PRO_PRICE_ID) tier = 'pro'
          if (priceId === process.env.STRIPE_AGENCY_PRICE_ID) tier = 'agency'

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
          
          let tier = 'starter'
          if (priceId === process.env.STRIPE_PRO_PRICE_ID) tier = 'pro'
          if (priceId === process.env.STRIPE_AGENCY_PRICE_ID) tier = 'agency'

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

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook handler error:', error)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}
