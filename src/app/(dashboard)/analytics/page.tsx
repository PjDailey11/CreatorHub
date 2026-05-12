'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { EmptyState } from '@/components/ui/empty-state'
import { BarChart3, DollarSign, TrendingUp, Users } from 'lucide-react'
import { Subscriber } from '@/types'

const analyticsMetricCards = [
  {
    title: 'Total Revenue',
    subtitle: 'No data yet',
    icon: DollarSign,
    iconClassName: 'text-green-500',
  },
  {
    title: 'Monthly Revenue',
    subtitle: 'No data yet',
    icon: TrendingUp,
    iconClassName: 'text-blue-500',
  },
  {
    title: 'Total Subscribers',
    subtitle: 'No data yet',
    icon: Users,
    iconClassName: 'text-purple-500',
  },
  {
    title: 'Avg LTV',
    subtitle: 'No data yet',
    icon: BarChart3,
    iconClassName: 'text-pink-500',
  },
] as const

function AnalyticsMetricCard({
  title,
  subtitle,
  icon: Icon,
  iconClassName,
}: (typeof analyticsMetricCards)[number]) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className={`h-4 w-4 ${iconClassName}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">—</div>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </CardContent>
    </Card>
  )
}

function AnalyticsPanelEmptyState({ description }: { description: string }) {
  return (
    <div className="flex h-56 flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border bg-muted/20 px-4 text-center">
      <BarChart3 className="h-8 w-8 text-muted-foreground" />
      <div className="space-y-1">
        <p className="text-sm font-medium">No data to display</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}

export default function AnalyticsPage() {
  const { loading: authLoading, user } = useAuth()
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [supabase] = useState(() => createClient())

  useEffect(() => {
    const fetchData = async () => {
      if (authLoading) {
        setLoading(true)
        return
      }

      if (!user) {
        setSubscribers([])
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

      if (error) {
        setSubscribers([])
        setError(error.message)
        setLoading(false)
        return
      }

      if (data) {
        setSubscribers(data)
      }
      setLoading(false)
    }

    void fetchData()
  }, [authLoading, supabase, user])

  const hasSubscriberData = subscribers.length > 0

  if (authLoading || loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <BarChart3 className="h-6 w-6 animate-pulse text-pink-500" />
      </div>
    )
  }

  if (error) {
    return (
      <EmptyState
        icon={BarChart3}
        title="Could not load analytics"
        description={error}
      />
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">
          Track your content performance and subscriber sources
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {analyticsMetricCards.map((card) => (
          <AnalyticsMetricCard key={card.title} {...card} />
        ))}
      </div>

      <Tabs defaultValue="channels" className="space-y-4">
        <TabsList>
          <TabsTrigger value="channels">Channel Breakdown</TabsTrigger>
          <TabsTrigger value="trends">Acquisition Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="channels">
          <Card>
            <CardHeader>
              <CardTitle>Traffic Sources</CardTitle>
            </CardHeader>
            <CardContent>
              <AnalyticsPanelEmptyState
                description={
                  hasSubscriberData
                    ? 'Tracking data will appear here once your analytics connection is configured.'
                    : 'Connect your account to start seeing real traffic source data.'
                }
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>Last 7 Days</CardTitle>
            </CardHeader>
            <CardContent>
              <AnalyticsPanelEmptyState
                description={
                  hasSubscriberData
                    ? 'Analytics history will appear here once real trend events are connected.'
                    : 'Connect your account to start seeing real acquisition trends.'
                }
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Top Performing Sources</CardTitle>
        </CardHeader>
        <CardContent>
          <AnalyticsPanelEmptyState
            description={
              hasSubscriberData
                ? 'Source rankings will populate here once attribution data is connected.'
                : 'Connect your account to start seeing real source rankings.'
            }
          />
        </CardContent>
      </Card>
    </div>
  )
}
