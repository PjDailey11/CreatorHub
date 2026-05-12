'use client'

import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Search, Filter } from 'lucide-react'
import { Subscriber } from '@/types'
import { formatDistanceToNow } from 'date-fns'

interface SubscriberTableProps {
  subscribers: Subscriber[]
  loading?: boolean
  onEdit?: (subscriber: Subscriber) => void
  onDelete?: (id: string) => void
}

const tierColors: Record<string, string> = {
  standard: 'bg-zinc-500/15 text-zinc-300 ring-1 ring-inset ring-zinc-500/30',
  premium: 'bg-blue-500/15 text-blue-300 ring-1 ring-inset ring-blue-500/30',
  vip: 'bg-purple-500/15 text-purple-300 ring-1 ring-inset ring-purple-500/30',
}

const statusColors: Record<string, string> = {
  active: 'bg-green-500/15 text-green-300 ring-1 ring-inset ring-green-500/30',
  churned: 'bg-red-500/15 text-red-300 ring-1 ring-inset ring-red-500/30',
  paused: 'bg-yellow-500/15 text-yellow-300 ring-1 ring-inset ring-yellow-500/30',
}

export function SubscriberTable({ subscribers, loading, onEdit, onDelete }: SubscriberTableProps) {
  const [search, setSearch] = useState('')
  const [tierFilter, setTierFilter] = useState<string | null>(null)
  const hasFilters = search.trim().length > 0 || tierFilter !== null

  const filteredSubscribers = subscribers.filter((sub) => {
    const matchesSearch = sub.subscriber_name?.toLowerCase().includes(search.toLowerCase())
    const matchesTier = !tierFilter || sub.subscriber_tier === tierFilter
    return matchesSearch && matchesTier
  })

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-12 animate-pulse rounded bg-muted" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search subscribers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              {tierFilter ? tierFilter.charAt(0).toUpperCase() + tierFilter.slice(1) : 'All Tiers'}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setTierFilter(null)}>All Tiers</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTierFilter('standard')}>Standard</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTierFilter('premium')}>Premium</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTierFilter('vip')}>VIP</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Subscriber</TableHead>
              <TableHead>Tier</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">Total Spent</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSubscribers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  {hasFilters
                    ? 'No subscribers match your filters.'
                    : 'Your data will appear here once connected.'}
                </TableCell>
              </TableRow>
            ) : (
              filteredSubscribers.map((subscriber) => (
                <TableRow key={subscriber.id}>
                  <TableCell className="font-medium">
                    {subscriber.subscriber_name || 'Anonymous'}
                  </TableCell>
                  <TableCell>
                    <Badge className={tierColors[subscriber.subscriber_tier || 'standard'] || tierColors.standard}>
                      {subscriber.subscriber_tier || 'standard'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[subscriber.status || 'active'] || statusColors.active}>
                      {subscriber.status || 'active'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    ${subscriber.subscription_price?.toFixed(2) || '0.00'}
                  </TableCell>
                  <TableCell className="text-right">
                    ${subscriber.total_spent?.toFixed(2) || '0.00'}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {subscriber.joined_at ? formatDistanceToNow(new Date(subscriber.joined_at), { addSuffix: true }) : 'Unknown'}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit?.(subscriber)}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onDelete?.(subscriber.id)}
                          className="text-red-600"
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
