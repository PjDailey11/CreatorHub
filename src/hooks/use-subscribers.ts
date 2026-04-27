'use client'

import { useCallback, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Subscriber, SubscriberStats } from '@/types'

export function useSubscribers() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [stats, setStats] = useState<SubscriberStats | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const calculateStats = (subs: Subscriber[]) => {
    const active = subs.filter(s => s.status === 'active')
    const totalRevenue = subs.reduce((acc, s) => acc + (s.total_spent || 0), 0)
    const mrr = active.reduce((acc, s) => acc + (s.subscription_price || 0), 0)
    const churned = subs.filter(s => s.status === 'churned').length
    const churnRate = subs.length > 0 ? (churned / subs.length) * 100 : 0
    const avgLtv = subs.length > 0 ? totalRevenue / subs.length : 0

    setStats({
      totalSubscribers: subs.length,
      activeSubscribers: active.length,
      mrr,
      churnRate,
      avgLtv,
    })
  }

  const fetchSubscribers = useCallback(async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      setLoading(false)
      return
    }

    const { data, error } = await supabase
      .from('subscribers')
      .select('*')
      .eq('user_id', user.id)
      .order('joined_at', { ascending: false })

    if (!error && data) {
      setSubscribers(data)
      calculateStats(data)
    }
    setLoading(false)
  }, [supabase])

  const addSubscriber = async (subscriber: Omit<Subscriber, 'id' | 'user_id' | 'joined_at'>) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data, error } = await supabase
      .from('subscribers')
      .insert({
        ...subscriber,
        user_id: user.id,
      })
      .select()
      .single()

    if (!error && data) {
      await fetchSubscribers()
    }
    return data
  }

  const updateSubscriber = async (id: string, updates: Partial<Subscriber>) => {
    const { data, error } = await supabase
      .from('subscribers')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (!error && data) {
      await fetchSubscribers()
    }
    return data
  }

  const deleteSubscriber = async (id: string) => {
    const { error } = await supabase
      .from('subscribers')
      .delete()
      .eq('id', id)

    if (!error) {
      await fetchSubscribers()
    }
    return !error
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      void fetchSubscribers()
    }, 0)

    return () => clearTimeout(timer)
  }, [fetchSubscribers])

  return {
    subscribers,
    stats,
    loading,
    fetchSubscribers,
    addSubscriber,
    updateSubscriber,
    deleteSubscriber,
  }
}
