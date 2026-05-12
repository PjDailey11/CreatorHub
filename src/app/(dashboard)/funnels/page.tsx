'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Plus, MoreHorizontal, Play, Pause, Copy, Trash2, GitBranch, Loader2 } from 'lucide-react'
import { Funnel } from '@/types'
import { formatDistanceToNow } from 'date-fns'
import { EmptyState } from '@/components/ui/empty-state'

const statusColors: Record<string, string> = {
  draft: 'bg-zinc-500/15 text-zinc-300 ring-1 ring-inset ring-zinc-500/30',
  active: 'bg-green-500/15 text-green-300 ring-1 ring-inset ring-green-500/30',
  paused: 'bg-yellow-500/15 text-yellow-300 ring-1 ring-inset ring-yellow-500/30',
}

const triggerLabels: Record<string, string> = {
  dm_received: 'DM Received',
  bio_click: 'Bio Link Click',
  new_follower: 'New Follower',
}

export default function FunnelsPage() {
  const { loading: authLoading, user } = useAuth()
  const [funnels, setFunnels] = useState<Funnel[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [supabase] = useState(() => createClient())

  const fetchFunnels = useCallback(async () => {
    if (authLoading) {
      setLoading(true)
      return
    }

    if (!user) {
      setFunnels([])
      setError(null)
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    const { data, error } = await supabase
      .from('funnels')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      setFunnels([])
      setError(error.message)
      setLoading(false)
      return
    }

    if (data) {
      setFunnels(data)
    }
    setLoading(false)
  }, [authLoading, supabase, user])

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchFunnels()
    }, 0)

    return () => window.clearTimeout(timeoutId)
  }, [fetchFunnels])

  const toggleFunnelStatus = async (funnel: Funnel) => {
    const newStatus = funnel.status === 'active' ? 'paused' : 'active'
    await supabase
      .from('funnels')
      .update({ status: newStatus })
      .eq('id', funnel.id)
    fetchFunnels()
  }

  const duplicateFunnel = async (funnel: Funnel) => {
    if (!user) return

    // Create duplicate funnel
    const { data: newFunnel } = await supabase
      .from('funnels')
      .insert({
        user_id: user.id,
        name: `${funnel.name} (Copy)`,
        trigger_type: funnel.trigger_type,
        status: 'draft',
      })
      .select()
      .single()

    if (newFunnel) {
      // Copy steps
      const { data: steps } = await supabase
        .from('funnel_steps')
        .select('*')
        .eq('funnel_id', funnel.id)

      if (steps && steps.length > 0) {
        await supabase
          .from('funnel_steps')
          .insert(steps.map(step => ({
            funnel_id: newFunnel.id,
            step_order: step.step_order,
            step_type: step.step_type,
            content: step.content,
          })))
      }
    }
    fetchFunnels()
  }

  const deleteFunnel = async (id: string) => {
    if (!confirm('Are you sure you want to delete this funnel?')) return
    await supabase.from('funnels').delete().eq('id', id)
    fetchFunnels()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">DM Funnels</h1>
          <p className="text-muted-foreground">Automate your subscriber engagement with DM funnels</p>
        </div>
        <Link href="/funnels/new">
          <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">
            <Plus className="h-4 w-4 mr-2" />
            New Funnel
          </Button>
        </Link>
      </div>

      {authLoading || loading ? (
        <div className="flex h-48 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-pink-500" />
        </div>
      ) : error ? (
        <EmptyState
          icon={GitBranch}
          title="Could not load funnels"
          description={error}
        />
      ) : (
        <>
          {funnels.length === 0 ? (
            <EmptyState
              icon={GitBranch}
              title="No funnels yet"
              description="Automate subscriber engagement with DM funnels that send the right message at the right moment."
              action={
                <Link href="/funnels/new">
                  <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Create your first funnel
                  </Button>
                </Link>
              }
            />
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {funnels.map((funnel) => (
                <Card key={funnel.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-start justify-between space-y-0">
                    <div>
                      <Link href={`/funnels/${funnel.id}`}>
                        <CardTitle className="text-base hover:text-pink-600 transition-colors">
                          {funnel.name}
                        </CardTitle>
                      </Link>
                      <Badge className={`mt-2 ${statusColors[funnel.status || 'draft']}`}>
                        {funnel.status || 'draft'}
                      </Badge>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => toggleFunnelStatus(funnel)}>
                          {funnel.status === 'active' ? (
                            <>
                              <Pause className="h-4 w-4 mr-2" />
                              Pause
                            </>
                          ) : (
                            <>
                              <Play className="h-4 w-4 mr-2" />
                              Activate
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => duplicateFunnel(funnel)}>
                          <Copy className="h-4 w-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => deleteFunnel(funnel.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Trigger:</span>
                        <span>{triggerLabels[funnel.trigger_type || ''] || 'Manual'}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Created:</span>
                        <span>{funnel.created_at ? formatDistanceToNow(new Date(funnel.created_at), { addSuffix: true }) : 'Unknown'}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
