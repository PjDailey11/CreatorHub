'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FunnelBuilder } from '@/components/funnels/funnel-builder'
import { FunnelPreview } from '@/components/funnels/funnel-preview'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'
import { FunnelStepWithDetails } from '@/types'

export default function NewFunnelPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [triggerType, setTriggerType] = useState('dm_received')
  const [steps, setSteps] = useState<FunnelStepWithDetails[]>([])
  const [saving, setSaving] = useState(false)
  const supabase = createClient()

  const handleSave = async () => {
    if (!name.trim()) {
      alert('Please enter a funnel name')
      return
    }

    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setSaving(false)
      return
    }

    // Create funnel
    const { data: funnel, error: funnelError } = await supabase
      .from('funnels')
      .insert({
        user_id: user.id,
        name,
        trigger_type: triggerType,
        status: 'draft',
      })
      .select()
      .single()

    if (funnelError || !funnel) {
      alert('Error creating funnel')
      setSaving(false)
      return
    }

    // Create steps
    if (steps.length > 0) {
      const { error: stepsError } = await supabase
        .from('funnel_steps')
        .insert(
          steps.map((step, index) => ({
            funnel_id: funnel.id,
            step_order: index,
            step_type: step.step_type,
            content: step.content,
          }))
        )

      if (stepsError) {
        alert('Error creating funnel steps')
        setSaving(false)
        return
      }
    }

    router.push('/funnels')
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
            <h1 className="text-2xl font-bold">Create Funnel</h1>
            <p className="text-muted-foreground">Build an automated DM sequence</p>
          </div>
        </div>
        <Button
          onClick={handleSave}
          disabled={saving || !name.trim()}
          className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
        >
          <Save className="h-4 w-4 mr-2" />
          {saving ? 'Saving...' : 'Save Funnel'}
        </Button>
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
