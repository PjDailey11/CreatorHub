'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FunnelBuilder } from '@/components/funnels/funnel-builder'
import { FunnelPreview } from '@/components/funnels/funnel-preview'
import { ArrowLeft, Save, Play, Pause } from 'lucide-react'
import Link from 'next/link'
import { Funnel, FunnelStepWithDetails } from '@/types'

export default function EditFunnelPage() {
  const router = useRouter()
  const params = useParams()
  const funnelId = params.id as string
  const { loading: authLoading, user } = useAuth()

  const [funnel, setFunnel] = useState<Funnel | null>(null)
  const [name, setName] = useState('')
  const [triggerType, setTriggerType] = useState('dm_received')
  const [status, setStatus] = useState('draft')
  const [steps, setSteps] = useState<FunnelStepWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [supabase] = useState(() => createClient())

  useEffect(() => {
    const fetchFunnel = async () => {
      if (authLoading) {
        setLoading(true)
        return
      }

      if (!user) {
        setFunnel(null)
        setError(null)
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)

      const { data: funnelData, error: funnelError } = await supabase
        .from('funnels')
        .select('*')
        .eq('id', funnelId)
        .eq('user_id', user.id)
        .single()

      if (funnelError) {
        setFunnel(null)
        setError(funnelError.message)
        setLoading(false)
        return
      }

      if (funnelData) {
        const funnel = funnelData as Funnel
        setFunnel(funnel)
        setName(funnel.name)
        setTriggerType(funnel.trigger_type || 'dm_received')
        setStatus(funnel.status || 'draft')

        const { data: stepsData, error: stepsError } = await supabase
          .from('funnel_steps')
          .select('*')
          .eq('funnel_id', funnelId)
          .order('step_order', { ascending: true })

        if (stepsError) {
          setError(stepsError.message)
          setLoading(false)
          return
        }

        if (stepsData) {
          setSteps(stepsData as FunnelStepWithDetails[])
        }
      }
      setLoading(false)
    }

    void fetchFunnel()
  }, [authLoading, funnelId, supabase, user])

  const handleSave = async () => {
    if (!name.trim()) {
      alert('Please enter a funnel name')
      return
    }

    setSaving(true)

    // Update funnel
    const { error: funnelError } = await supabase
      .from('funnels')
      .update({
        name,
        trigger_type: triggerType,
        status,
      })
      .eq('id', funnelId)
      .eq('user_id', user?.id ?? '')

    if (funnelError) {
      alert('Error updating funnel')
      setSaving(false)
      return
    }

    // Delete existing steps
    await supabase
      .from('funnel_steps')
      .delete()
      .eq('funnel_id', funnelId)

    // Create new steps
    if (steps.length > 0) {
      const { error: stepsError } = await supabase
        .from('funnel_steps')
        .insert(
          steps.map((step, index) => ({
            funnel_id: funnelId,
            step_order: index,
            step_type: step.step_type,
            content: step.content,
          }))
        )

      if (stepsError) {
        alert('Error updating funnel steps')
        setSaving(false)
        return
      }
    }

    setSaving(false)
    router.push('/funnels')
  }

  const toggleStatus = async () => {
    const newStatus = status === 'active' ? 'paused' : 'active'
    setStatus(newStatus)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 animate-pulse rounded bg-muted" />
        <div className="h-64 animate-pulse rounded bg-muted" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
        Redirecting to sign in...
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">{error}</p>
        <Link href="/funnels">
          <Button variant="link">Go back to funnels</Button>
        </Link>
      </div>
    )
  }

  if (!funnel) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Funnel not found</p>
        <Link href="/funnels">
          <Button variant="link">Go back to funnels</Button>
        </Link>
      </div>
    )
  }

  const statusColors: Record<string, string> = {
    draft: 'bg-zinc-500/15 text-zinc-300 ring-1 ring-inset ring-zinc-500/30',
    active: 'bg-green-500/15 text-green-300 ring-1 ring-inset ring-green-500/30',
    paused: 'bg-yellow-500/15 text-yellow-300 ring-1 ring-inset ring-yellow-500/30',
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/funnels">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">Edit Funnel</h1>
              <Badge className={statusColors[status]}>{status}</Badge>
            </div>
            <p className="text-muted-foreground">Modify your DM sequence</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={toggleStatus}>
            {status === 'active' ? (
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
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving || !name.trim()}
            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
          >
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Funnel Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Funnel Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Welcome Sequence"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="trigger">Trigger Type</Label>
                <Select value={triggerType} onValueChange={setTriggerType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dm_received">DM Received</SelectItem>
                    <SelectItem value="bio_click">Bio Link Click</SelectItem>
                    <SelectItem value="new_follower">New Follower</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Funnel Steps</CardTitle>
            </CardHeader>
            <CardContent>
              <FunnelBuilder steps={steps} onStepsChange={setSteps} />
            </CardContent>
          </Card>
        </div>

        <div>
          <FunnelPreview name={name} triggerType={triggerType} steps={steps} />
        </div>
      </div>
    </div>
  )
}
