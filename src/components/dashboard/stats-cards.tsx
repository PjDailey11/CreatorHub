'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, DollarSign, TrendingDown, Heart } from 'lucide-react'
import { SubscriberStats } from '@/types'

interface StatsCardsProps {
  stats: SubscriberStats | null
  loading?: boolean
}

export function StatsCards({ stats, loading }: StatsCardsProps) {
  const cards = [
    {
      title: 'Total Subscribers',
      value: stats?.totalSubscribers ?? 0,
      icon: Users,
      format: (v: number) => v.toLocaleString(),
      subtitle: `${stats?.activeSubscribers ?? 0} active`,
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Monthly Revenue',
      value: stats?.mrr ?? 0,
      icon: DollarSign,
      format: (v: number) => `$${v.toLocaleString()}`,
      subtitle: 'Recurring revenue',
      color: 'from-green-500 to-green-600',
    },
    {
      title: 'Churn Rate',
      value: stats?.churnRate ?? 0,
      icon: TrendingDown,
      format: (v: number) => `${v.toFixed(1)}%`,
      subtitle: 'Last 30 days',
      color: 'from-orange-500 to-orange-600',
    },
    {
      title: 'Avg Lifetime Value',
      value: stats?.avgLtv ?? 0,
      icon: Heart,
      format: (v: number) => `$${v.toFixed(2)}`,
      subtitle: 'Per subscriber',
      color: 'from-pink-500 to-purple-600',
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title} className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {card.title}
            </CardTitle>
            <div className={`h-8 w-8 rounded-lg bg-gradient-to-br ${card.color} flex items-center justify-center`}>
              <card.icon className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-8 w-24 bg-gray-200 animate-pulse rounded" />
            ) : (
              <>
                <div className="text-2xl font-bold">{card.format(card.value)}</div>
                <p className="text-xs text-muted-foreground">{card.subtitle}</p>
              </>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
