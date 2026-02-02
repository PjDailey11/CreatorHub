'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BarChart3, TrendingUp, Users, DollarSign } from 'lucide-react'
import { Subscriber } from '@/types'

interface ChannelData {
  channel: string
  subscribers: number
  revenue: number
  percentage: number
}

interface TrendData {
  date: string
  newSubscribers: number
  revenue: number
}

const channelColors: Record<string, string> = {
  instagram: 'bg-pink-500',
  tiktok: 'bg-black',
  twitter: 'bg-blue-400',
  organic: 'bg-green-500',
  other: 'bg-gray-400',
}

export default function AnalyticsPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('subscribers')
        .select('*')
        .eq('user_id', user.id)

      if (data) {
        setSubscribers(data)
      }
      setLoading(false)
    }

    fetchData()
  }, [supabase])

  // Generate mock channel data based on subscribers
  const getChannelData = (): ChannelData[] => {
    const total = subscribers.length
    const totalRevenue = subscribers.reduce((acc, s) => acc + (s.total_spent || 0), 0)

    // Mock distribution
    const channels = [
      { channel: 'Instagram', percentage: 40 },
      { channel: 'TikTok', percentage: 30 },
      { channel: 'Twitter', percentage: 15 },
      { channel: 'Organic', percentage: 15 },
    ]

    return channels.map(c => ({
      channel: c.channel,
      subscribers: Math.round(total * (c.percentage / 100)),
      revenue: Math.round(totalRevenue * (c.percentage / 100) * 100) / 100,
      percentage: c.percentage,
    }))
  }

  // Generate trend data for the last 7 days
  const getTrendData = (): TrendData[] => {
    const data: TrendData[] = []
    const now = new Date()

    for (let i = 6; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)

      const subsOnDay = subscribers.filter(s => {
        if (!s.joined_at) return false
        const joinDate = new Date(s.joined_at)
        return joinDate.toDateString() === date.toDateString()
      })

      data.push({
        date: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
        newSubscribers: subsOnDay.length,
        revenue: subsOnDay.reduce((acc, s) => acc + (s.subscription_price || 0), 0),
      })
    }

    return data
  }

  const channelData = getChannelData()
  const trendData = getTrendData()
  const totalRevenue = subscribers.reduce((acc, s) => acc + (s.total_spent || 0), 0)
  const totalMRR = subscribers
    .filter(s => s.status === 'active')
    .reduce((acc, s) => acc + (s.subscription_price || 0), 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">Track your content performance and subscriber sources</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Monthly Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalMRR.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Recurring</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Subscribers</CardTitle>
            <Users className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{subscribers.length}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Avg LTV</CardTitle>
            <BarChart3 className="h-4 w-4 text-pink-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${subscribers.length > 0 ? (totalRevenue / subscribers.length).toFixed(2) : '0.00'}
            </div>
            <p className="text-xs text-muted-foreground">Per subscriber</p>
          </CardContent>
        </Card>
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
              {loading ? (
                <div className="h-64 bg-gray-100 animate-pulse rounded" />
              ) : (
                <div className="space-y-6">
                  {/* Visual bar chart */}
                  <div className="space-y-4">
                    {channelData.map((channel) => (
                      <div key={channel.channel} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">{channel.channel}</span>
                          <span className="text-muted-foreground">
                            {channel.subscribers} subs ({channel.percentage}%)
                          </span>
                        </div>
                        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${channelColors[channel.channel.toLowerCase()] || channelColors.other} transition-all duration-500`}
                            style={{ width: `${channel.percentage}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>${channel.revenue.toFixed(2)} revenue</span>
                          <span>${channel.subscribers > 0 ? (channel.revenue / channel.subscribers).toFixed(2) : '0.00'} per sub</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Legend */}
                  <div className="flex flex-wrap gap-4 pt-4 border-t">
                    {channelData.map((channel) => (
                      <div key={channel.channel} className="flex items-center gap-2">
                        <div className={`h-3 w-3 rounded-full ${channelColors[channel.channel.toLowerCase()] || channelColors.other}`} />
                        <span className="text-sm">{channel.channel}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>Last 7 Days</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="h-64 bg-gray-100 animate-pulse rounded" />
              ) : (
                <div className="space-y-4">
                  {/* Simple bar chart visualization */}
                  <div className="flex items-end justify-between h-48 gap-2">
                    {trendData.map((day, index) => {
                      const maxSubs = Math.max(...trendData.map(d => d.newSubscribers), 1)
                      const height = (day.newSubscribers / maxSubs) * 100

                      return (
                        <div key={index} className="flex-1 flex flex-col items-center gap-2">
                          <div className="flex-1 w-full flex items-end">
                            <div
                              className="w-full bg-gradient-to-t from-pink-500 to-purple-500 rounded-t transition-all duration-500"
                              style={{ height: `${Math.max(height, 5)}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground truncate w-full text-center">
                            {day.date.split(' ')[0]}
                          </span>
                        </div>
                      )
                    })}
                  </div>

                  {/* Stats table */}
                  <div className="grid grid-cols-7 gap-2 pt-4 border-t">
                    {trendData.map((day, index) => (
                      <div key={index} className="text-center">
                        <div className="text-lg font-bold">{day.newSubscribers}</div>
                        <div className="text-xs text-muted-foreground">new subs</div>
                        <div className="text-xs text-green-600">${day.revenue.toFixed(0)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Top Performing Sources</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {channelData
              .sort((a, b) => b.revenue - a.revenue)
              .map((channel, index) => (
                <div key={channel.channel} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="text-lg font-bold w-8 h-8 flex items-center justify-center">
                      {index + 1}
                    </Badge>
                    <div>
                      <p className="font-medium">{channel.channel}</p>
                      <p className="text-sm text-muted-foreground">{channel.subscribers} subscribers</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">${channel.revenue.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">
                      {channel.percentage}% of total
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
