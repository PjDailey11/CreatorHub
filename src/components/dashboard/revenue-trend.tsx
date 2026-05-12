'use client'

import { useState } from 'react'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BarChart3 } from 'lucide-react'

type TierFilter = 'all' | 'standard' | 'premium' | 'vip'
type RangeKey = '7d' | '30d' | '90d'

export function RevenueTrend() {
  const [tierFilter, setTierFilter] = useState<TierFilter>('all')
  const [range, setRange] = useState<RangeKey>('30d')

  const rangeLabel =
    range === '7d' ? '7-day' : range === '30d' ? '30-day' : '90-day'

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <CardTitle className="text-lg">Revenue Trend</CardTitle>
          <p className="text-xs text-muted-foreground">
            Monthly recurring revenue over time
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select
            value={tierFilter}
            onValueChange={(v) => setTierFilter(v as TierFilter)}
          >
            <SelectTrigger className="h-9 w-[140px]" disabled>
              <SelectValue placeholder="All tiers" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All tiers</SelectItem>
              <SelectItem value="standard">Standard</SelectItem>
              <SelectItem value="premium">Premium</SelectItem>
              <SelectItem value="vip">VIP</SelectItem>
            </SelectContent>
          </Select>
          <Tabs
            value={range}
            onValueChange={(v) => setRange(v as RangeKey)}
            className="w-auto"
          >
            <TabsList className="h-9">
              <TabsTrigger value="7d" className="px-3 text-xs" disabled>
                7d
              </TabsTrigger>
              <TabsTrigger value="30d" className="px-3 text-xs" disabled>
                30d
              </TabsTrigger>
              <TabsTrigger value="90d" className="px-3 text-xs" disabled>
                90d
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex h-[280px] w-full flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border bg-muted/20 text-center">
          <BarChart3 className="h-8 w-8 text-muted-foreground" />
          <div className="space-y-1">
            <p className="text-sm font-medium">No data to display</p>
            <p className="text-xs text-muted-foreground">
              Connect your account to start seeing real revenue trends.
            </p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="border-t pt-6">
        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="flex flex-col gap-1">
            <span className="text-xs uppercase tracking-wide text-muted-foreground">
              {rangeLabel} total
            </span>
            <span className="text-lg font-semibold">—</span>
            <span className="text-xs text-muted-foreground">No data yet</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs uppercase tracking-wide text-muted-foreground">
              vs prior period
            </span>
            <span className="text-lg font-semibold">—</span>
            <span className="text-xs text-muted-foreground">No data yet</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs uppercase tracking-wide text-muted-foreground">
              Peak day
            </span>
            <span className="text-lg font-semibold">—</span>
            <span className="text-xs text-muted-foreground">No data yet</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
