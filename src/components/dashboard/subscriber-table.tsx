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
  standard: 'bg-gray-100 text-gray-800',
  premium: 'bg-blue-100 text-blue-800',
  vip: 'bg-purple-100 text-purple-800',
}

const statusColors: Record<string, string> = {
  active: 'bg-green-100 text-green-800',
  churned: 'bg-red-100 text-red-800',
  paused: 'bg-yellow-100 text-yellow-800',
}

export function SubscriberTable({ subscribers, loading, onEdit, onDelete }: SubscriberTableProps) {
  const [search, setSearch] = useState('')
  const [tierFilter, setTierFilter] = useState<string | null>(null)

  const filteredSubscribers = subscribers.filter((sub) => {
    const matchesSearch = sub.subscriber_name?.toLowerCase().includes(search.toLowerCase())
    const matchesTier = !tierFilter || sub.subscriber_tier === tierFilter
    return matchesSearch && matchesTier
  })

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-12 bg-gray-100 animate-pulse rounded" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
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
                  No subscribers found
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
