'use client'

import { useSubscribers } from '@/hooks/use-subscribers'
import { StatsCards } from '@/components/dashboard/stats-cards'
import { SubscriberTable } from '@/components/dashboard/subscriber-table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, TrendingUp, Zap, Target } from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  const { subscribers, stats, loading } = useSubscribers()

  const recentSubscribers = subscribers.slice(0, 5)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here&apos;s your overview.</p>
        </div>
        <Link href="/subscribers">
          <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Subscriber
          </Button>
        </Link>
      </div>

      <StatsCards stats={stats} loading={loading} />

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Subscribers</CardTitle>
            <Link href="/subscribers">
              <Button variant="ghost" size="sm">View all</Button>
            </Link>
          </CardHeader>
          <CardContent>
            <SubscriberTable
              subscribers={recentSubscribers}
              loading={loading}
            />
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/funnels/new" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <Zap className="h-4 w-4 mr-2 text-yellow-500" />
                  Create DM Funnel
                </Button>
              </Link>
              <Link href="/ppv" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <Target className="h-4 w-4 mr-2 text-green-500" />
                  Get PPV Pricing
                </Button>
              </Link>
              <Link href="/analytics" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <TrendingUp className="h-4 w-4 mr-2 text-blue-500" />
                  View Analytics
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Growth Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 rounded-lg bg-gradient-to-r from-pink-50 to-purple-50">
                <p className="text-sm font-medium">Boost Engagement</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Set up automated welcome DMs to greet new subscribers
                </p>
              </div>
              <div className="p-3 rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50">
                <p className="text-sm font-medium">Optimize PPV</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Use AI pricing to maximize your PPV revenue
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
