'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { DollarSign, Sparkles, TrendingUp, Info, Users, Plus } from 'lucide-react'
import { Subscriber } from '@/types'
import { EmptyState } from '@/components/ui/empty-state'
import Link from 'next/link'

interface PricingRecommendation {
  subscriberId: string
  subscriberName: string
  tier: string
  recommendedPrice: number
  confidence: number
  factors: {
    tierBonus: number
    engagementBonus: number
    spendingBonus: number
  }
  customPrice: number | null
}

const tierMultipliers: Record<string, number> = {
  standard: 1,
  premium: 1.5,
  vip: 2,
}

function calculateRecommendedPrice(subscriber: Subscriber): PricingRecommendation {
  const basePrice = 15 // Base PPV price
  const tier = subscriber.subscriber_tier || 'basic'
  const totalSpent = subscriber.total_spent || 0

  // Tier bonus (0-50%)
  const tierBonus = (tierMultipliers[tier] - 1) * 0.5

  // Engagement bonus based on total spent (0-30%)
  const spentBonus = Math.min((totalSpent / 500) * 0.3, 0.3)

  // Recent engagement bonus (0-20%)
  const daysSinceEngagement = subscriber.last_engaged_at
    ? Math.floor((Date.now() - new Date(subscriber.last_engaged_at).getTime()) / (1000 * 60 * 60 * 24))
    : 30
  const engagementBonus = daysSinceEngagement < 7 ? 0.2 : daysSinceEngagement < 14 ? 0.1 : 0

  const totalMultiplier = 1 + tierBonus + spentBonus + engagementBonus
  const recommendedPrice = Math.round(basePrice * totalMultiplier * 100) / 100

  // Confidence based on data quality
  const confidence = totalSpent > 0 || subscriber.last_engaged_at ? 85 : 60

  return {
    subscriberId: subscriber.id,
    subscriberName: subscriber.subscriber_name || 'Anonymous',
    tier: tier,
    recommendedPrice,
    confidence,
    factors: {
      tierBonus: Math.round(tierBonus * 100),
      engagementBonus: Math.round(engagementBonus * 100),
      spendingBonus: Math.round(spentBonus * 100),
    },
    customPrice: null,
  }
}

export default function PPVPage() {
  const { loading: authLoading, user } = useAuth()
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [recommendations, setRecommendations] = useState<PricingRecommendation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [supabase] = useState(() => createClient())

  useEffect(() => {
    const fetchSubscribers = async () => {
      if (authLoading) {
        setLoading(true)
        return
      }

      if (!user) {
        setSubscribers([])
        setRecommendations([])
        setError(null)
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('subscribers')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .order('total_spent', { ascending: false })

      if (error) {
        setSubscribers([])
        setRecommendations([])
        setError(error.message)
        setLoading(false)
        return
      }

      if (data) {
        setSubscribers(data)
        setRecommendations(data.map(calculateRecommendedPrice))
      }
      setLoading(false)
    }

    void fetchSubscribers()
  }, [authLoading, supabase, user])

  const updateCustomPrice = (subscriberId: string, price: string) => {
    setRecommendations(recs =>
      recs.map(rec =>
        rec.subscriberId === subscriberId
          ? { ...rec, customPrice: price ? parseFloat(price) : null }
          : rec
      )
    )
  }

  const getAverageRecommendedPrice = () => {
    if (recommendations.length === 0) return 0
    const sum = recommendations.reduce((acc, rec) => acc + rec.recommendedPrice, 0)
    return Math.round((sum / recommendations.length) * 100) / 100
  }

  const getTotalPotentialRevenue = () => {
    return recommendations.reduce((acc, rec) =>
      acc + (rec.customPrice ?? rec.recommendedPrice), 0
    )
  }

  const tierColors: Record<string, string> = {
    standard: 'bg-zinc-500/15 text-zinc-300 ring-1 ring-inset ring-zinc-500/30',
    premium: 'bg-blue-500/15 text-blue-300 ring-1 ring-inset ring-blue-500/30',
    vip: 'bg-purple-500/15 text-purple-300 ring-1 ring-inset ring-purple-500/30',
  }

  if (authLoading || loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Sparkles className="h-6 w-6 animate-pulse text-pink-500" />
      </div>
    )
  }

  if (error) {
    return (
      <EmptyState
        icon={Sparkles}
        title="Could not load PPV pricing"
        description={error}
      />
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">PPV Pricing</h1>
        <p className="text-muted-foreground">AI-powered price recommendations for your PPV content</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg Recommended Price
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
              <DollarSign className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${getAverageRecommendedPrice().toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Per subscriber</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Potential Revenue
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${getTotalPotentialRevenue().toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">If sent to all active subscribers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Subscribers
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{subscribers.length}</div>
            <p className="text-xs text-muted-foreground">Eligible for PPV</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Price Recommendations</CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Info className="h-4 w-4" />
              <span>Prices based on tier, engagement, and spending history</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {recommendations.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No active subscribers yet"
              description="PPV pricing tunes itself to each fan's tier, engagement, and spend. Add active subscribers to start getting recommendations."
              action={
                <Link href="/subscribers">
                  <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add subscribers
                  </Button>
                </Link>
              }
            />
          ) : (
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subscriber</TableHead>
                    <TableHead>Tier</TableHead>
                    <TableHead>Recommended</TableHead>
                    <TableHead>Confidence</TableHead>
                    <TableHead>Factors</TableHead>
                    <TableHead>Custom Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recommendations.map((rec) => (
                    <TableRow key={rec.subscriberId}>
                      <TableCell className="font-medium">{rec.subscriberName}</TableCell>
                      <TableCell>
                        <Badge className={tierColors[rec.tier]}>{rec.tier}</Badge>
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold text-green-600">
                          ${rec.recommendedPrice.toFixed(2)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-16 overflow-hidden rounded-full bg-muted">
                            <div
                              className="h-full bg-gradient-to-r from-pink-500 to-purple-600"
                              style={{ width: `${rec.confidence}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground">{rec.confidence}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1 flex-wrap">
                          {rec.factors.tierBonus > 0 && (
                            <Badge variant="outline" className="text-xs">
                              +{rec.factors.tierBonus}% tier
                            </Badge>
                          )}
                          {rec.factors.engagementBonus > 0 && (
                            <Badge variant="outline" className="text-xs">
                              +{rec.factors.engagementBonus}% engaged
                            </Badge>
                          )}
                          {rec.factors.spendingBonus > 0 && (
                            <Badge variant="outline" className="text-xs">
                              +{rec.factors.spendingBonus}% spender
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          step="0.01"
                          className="w-24"
                          placeholder={rec.recommendedPrice.toFixed(2)}
                          value={rec.customPrice?.toString() || ''}
                          onChange={(e) => updateCustomPrice(rec.subscriberId, e.target.value)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
