'use client'

import { useMemo, useState } from 'react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { format, subDays } from 'date-fns'
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
import { TrendingDown, TrendingUp } from 'lucide-react'

type Tier = 'standard' | 'premium' | 'vip'
type TierFilter = 'all' | Tier
type RangeKey = '7d' | '30d' | '90d'

interface RevenuePoint {
  date: string
  mrr: number
  tier: Tier
}

const TIERS: Tier[] = ['standard', 'premium', 'vip']
const TIER_BASE: Record<Tier, number> = {
  standard: 1200,
  premium: 2400,
  vip: 3800,
}
const TIER_LABEL: Record<Tier, string> = {
  standard: 'Standard',
  premium: 'Premium',
  vip: 'VIP',
}

// Deterministic pseudo-random so SSR/CSR match
function seeded(seed: number) {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

function generateMockData(): RevenuePoint[] {
  const today = new Date()
  const points: RevenuePoint[] = []
  for (let i = 89; i >= 0; i--) {
    const date = subDays(today, i)
    const iso = date.toISOString().slice(0, 10)
    TIERS.forEach((tier, tIdx) => {
      const base = TIER_BASE[tier]
      // Upward trend + weekly oscillation + noise
      const trend = base * (1 + (89 - i) * 0.004)
      const wave = Math.sin((89 - i) / 6 + tIdx) * base * 0.08
      const noise = (seeded(i * 7 + tIdx * 13) - 0.5) * base * 0.12
      const mrr = Math.max(0, Math.round(trend + wave + noise))
      points.push({ date: iso, mrr, tier })
    })
  }
  return points
}

const MOCK_DATA = generateMockData()

const RANGE_DAYS: Record<RangeKey, number> = {
  '7d': 7,
  '30d': 30,
  '90d': 90,
}

function formatCurrencyShort(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}m`
  if (value >= 1_000) {
    const k = value / 1_000
    return `$${k >= 100 ? Math.round(k) : k.toFixed(1)}k`
  }
  return `$${Math.round(value)}`
}

function formatCurrencyFull(value: number): string {
  return `$${Math.round(value).toLocaleString()}`
}

interface AggregatedPoint {
  date: string
  mrr: number
  tierBreakdown: Record<Tier, number>
}

function aggregate(
  data: RevenuePoint[],
  tierFilter: TierFilter,
): AggregatedPoint[] {
  const byDate = new Map<string, AggregatedPoint>()
  for (const p of data) {
    if (tierFilter !== 'all' && p.tier !== tierFilter) continue
    let bucket = byDate.get(p.date)
    if (!bucket) {
      bucket = {
        date: p.date,
        mrr: 0,
        tierBreakdown: { standard: 0, premium: 0, vip: 0 },
      }
      byDate.set(p.date, bucket)
    }
    bucket.mrr += p.mrr
    bucket.tierBreakdown[p.tier] += p.mrr
  }
  return Array.from(byDate.values()).sort((a, b) =>
    a.date.localeCompare(b.date),
  )
}

interface TooltipPayloadItem {
  payload: AggregatedPoint
  value: number
}

function ChartTooltip({
  active,
  payload,
  tierFilter,
}: {
  active?: boolean
  payload?: TooltipPayloadItem[]
  tierFilter: TierFilter
}) {
  if (!active || !payload || payload.length === 0) return null
  const point = payload[0].payload
  const dateLabel = format(new Date(`${point.date}T00:00:00`), 'MMM d, yyyy')
  return (
    <div className="rounded-lg border border-zinc-200 bg-white/95 p-3 shadow-lg backdrop-blur-sm">
      <p className="text-xs font-medium text-zinc-500">{dateLabel}</p>
      <p className="mt-1 text-lg font-semibold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
        {formatCurrencyFull(point.mrr)}
      </p>
      <p className="mt-0.5 text-xs text-zinc-600">
        {tierFilter === 'all' ? (
          <>
            <span className="font-medium">All tiers</span>
            <span className="ml-1 text-zinc-400">
              · S {formatCurrencyShort(point.tierBreakdown.standard)} · P{' '}
              {formatCurrencyShort(point.tierBreakdown.premium)} · V{' '}
              {formatCurrencyShort(point.tierBreakdown.vip)}
            </span>
          </>
        ) : (
          <span className="font-medium">{TIER_LABEL[tierFilter]} tier</span>
        )}
      </p>
    </div>
  )
}

export function RevenueTrend() {
  const [tierFilter, setTierFilter] = useState<TierFilter>('all')
  const [range, setRange] = useState<RangeKey>('30d')

  const chartData = useMemo(() => {
    const all = aggregate(MOCK_DATA, tierFilter)
    const days = RANGE_DAYS[range]
    return all.slice(-days)
  }, [tierFilter, range])

  const kpis = useMemo(() => {
    const days = RANGE_DAYS[range]
    const all = aggregate(MOCK_DATA, tierFilter)
    const current = all.slice(-days)
    const prior = all.slice(-days * 2, -days)

    const total = current.reduce((sum, p) => sum + p.mrr, 0)
    const priorTotal = prior.reduce((sum, p) => sum + p.mrr, 0)
    const deltaPct =
      priorTotal > 0 ? ((total - priorTotal) / priorTotal) * 100 : 0

    const peak = current.reduce<AggregatedPoint | null>((best, p) => {
      if (!best || p.mrr > best.mrr) return p
      return best
    }, null)

    return {
      total,
      deltaPct,
      hasPriorComparison: priorTotal > 0,
      peakDate: peak ? peak.date : null,
      peakValue: peak ? peak.mrr : 0,
    }
  }, [tierFilter, range])

  const deltaPositive = kpis.deltaPct >= 0
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
            <SelectTrigger className="h-9 w-[140px]">
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
              <TabsTrigger value="7d" className="px-3 text-xs">
                7d
              </TabsTrigger>
              <TabsTrigger value="30d" className="px-3 text-xs">
                30d
              </TabsTrigger>
              <TabsTrigger value="90d" className="px-3 text-xs">
                90d
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>

      <CardContent>
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ec4899" stopOpacity={0.45} />
                  <stop offset="55%" stopColor="#a855f7" stopOpacity={0.18} />
                  <stop offset="100%" stopColor="#a855f7" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="revenueStroke" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#ec4899" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e4e4e7"
                vertical={false}
              />
              <XAxis
                dataKey="date"
                tickFormatter={(value: string) =>
                  format(new Date(`${value}T00:00:00`), 'MMM d')
                }
                stroke="#a1a1aa"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                minTickGap={24}
              />
              <YAxis
                tickFormatter={(value: number) => formatCurrencyShort(value)}
                stroke="#a1a1aa"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                width={56}
              />
              <Tooltip
                cursor={{
                  stroke: '#a855f7',
                  strokeWidth: 1,
                  strokeDasharray: '4 4',
                }}
                content={<ChartTooltip tierFilter={tierFilter} />}
              />
              <Area
                type="monotone"
                dataKey="mrr"
                stroke="url(#revenueStroke)"
                strokeWidth={2.5}
                fill="url(#revenueFill)"
                dot={false}
                activeDot={{
                  r: 5,
                  fill: '#ec4899',
                  stroke: '#fff',
                  strokeWidth: 2,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>

      <CardFooter className="border-t pt-6">
        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="flex flex-col gap-1">
            <span className="text-xs uppercase tracking-wide text-muted-foreground">
              {rangeLabel} total
            </span>
            <span className="text-lg font-semibold">
              {formatCurrencyFull(kpis.total)}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs uppercase tracking-wide text-muted-foreground">
              vs prior period
            </span>
            <span
              className={`inline-flex items-center gap-1 text-lg font-semibold ${
                kpis.hasPriorComparison
                  ? deltaPositive
                    ? 'text-emerald-600'
                    : 'text-rose-600'
                  : 'text-muted-foreground'
              }`}
            >
              {kpis.hasPriorComparison ? (
                <>
                  {deltaPositive ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  {deltaPositive ? '+' : ''}
                  {kpis.deltaPct.toFixed(1)}%
                </>
              ) : (
                'N/A'
              )}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs uppercase tracking-wide text-muted-foreground">
              Peak day
            </span>
            <span className="text-lg font-semibold">
              {kpis.peakDate
                ? `${format(
                    new Date(`${kpis.peakDate}T00:00:00`),
                    'MMM d',
                  )} · ${formatCurrencyShort(kpis.peakValue)}`
                : '—'}
            </span>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
