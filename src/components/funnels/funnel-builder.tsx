'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { FunnelNode } from './funnel-node'
import { MessageSquare, Clock, GitBranch, ArrowDown, Zap } from 'lucide-react'
import { FunnelStepWithDetails } from '@/types'

interface FunnelBuilderProps {
  steps: FunnelStepWithDetails[]
  onStepsChange: (steps: FunnelStepWithDetails[]) => void
}

type StepType = 'message' | 'delay' | 'condition'

const stepOptions = [
  { type: 'message' as StepType, label: 'Send Message', icon: MessageSquare, color: 'text-blue-500' },
  { type: 'delay' as StepType, label: 'Wait/Delay', icon: Clock, color: 'text-orange-500' },
  { type: 'condition' as StepType, label: 'Condition', icon: GitBranch, color: 'text-purple-500' },
]

export function FunnelBuilder({ steps, onStepsChange }: FunnelBuilderProps) {
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [newStepType, setNewStepType] = useState<StepType | null>(null)
  const [stepContent, setStepContent] = useState<FunnelStepWithDetails['content']>({})

  const handleAddStep = (type: StepType) => {
    setNewStepType(type)
    setStepContent({})
    setIsAddOpen(true)
  }

  const handleSaveNewStep = () => {
    if (!newStepType) return

    const newStep: FunnelStepWithDetails = {
      id: `temp-${Date.now()}`,
      funnel_id: '',
      step_order: steps.length,
      step_type: newStepType,
      content: stepContent,
      created_at: new Date().toISOString(),
    }

    onStepsChange([...steps, newStep])
    setIsAddOpen(false)
    setNewStepType(null)
    setStepContent({})
  }

  const handleEditStep = (index: number) => {
    setEditingIndex(index)
    setStepContent(steps[index].content)
    setIsEditOpen(true)
  }

  const handleSaveEdit = () => {
    if (editingIndex === null) return

    const updatedSteps = [...steps]
    updatedSteps[editingIndex] = {
      ...updatedSteps[editingIndex],
      content: stepContent,
    }

    onStepsChange(updatedSteps)
    setIsEditOpen(false)
    setEditingIndex(null)
    setStepContent({})
  }

  const handleDeleteStep = (index: number) => {
    const updatedSteps = steps.filter((_, i) => i !== index)
    onStepsChange(updatedSteps)
  }

  const renderStepForm = (type: StepType) => {
    switch (type) {
      case 'message':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Message Content</Label>
              <Textarea
                value={stepContent.message || ''}
                onChange={(e) => setStepContent({ ...stepContent, message: e.target.value })}
                placeholder="Hey! Thanks for subscribing..."
                rows={4}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Tip: Use {'{name}'} to personalize with subscriber&apos;s name
            </p>
          </div>
        )

      case 'delay':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Delay Duration (minutes)</Label>
              <Input
                type="number"
                value={stepContent.delay_minutes || ''}
                onChange={(e) => setStepContent({ ...stepContent, delay_minutes: parseInt(e.target.value) || 0 })}
                placeholder="30"
              />
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setStepContent({ delay_minutes: 30 })}>
                30 min
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={() => setStepContent({ delay_minutes: 60 })}>
                1 hour
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={() => setStepContent({ delay_minutes: 1440 })}>
                1 day
              </Button>
            </div>
          </div>
        )

      case 'condition':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Field</Label>
              <Select
                value={stepContent.condition?.field || ''}
                onValueChange={(value) => setStepContent({
                  ...stepContent,
                  condition: { ...stepContent.condition, field: value, operator: stepContent.condition?.operator || 'equals', value: stepContent.condition?.value || '' }
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select field" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="subscriber_tier">Subscriber Tier</SelectItem>
                  <SelectItem value="total_spent">Total Spent</SelectItem>
                  <SelectItem value="days_subscribed">Days Subscribed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Operator</Label>
              <Select
                value={stepContent.condition?.operator || 'equals'}
                onValueChange={(value) => setStepContent({
                  ...stepContent,
                  condition: { ...stepContent.condition, operator: value as 'equals' | 'greater_than' | 'less_than' | 'contains', field: stepContent.condition?.field || '', value: stepContent.condition?.value || '' }
                })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="equals">Equals</SelectItem>
                  <SelectItem value="greater_than">Greater Than</SelectItem>
                  <SelectItem value="less_than">Less Than</SelectItem>
                  <SelectItem value="contains">Contains</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Value</Label>
              <Input
                value={stepContent.condition?.value?.toString() || ''}
                onChange={(e) => setStepContent({
                  ...stepContent,
                  condition: { ...stepContent.condition, value: e.target.value, field: stepContent.condition?.field || '', operator: stepContent.condition?.operator || 'equals' }
                })}
                placeholder="Enter value"
              />
            </div>
          </div>
        )
    }
  }

  return (
    <div className="space-y-6">
      {/* Trigger node */}
      <Card className="border-2 border-dashed border-pink-500/20 bg-pink-500/5">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-base">Trigger</CardTitle>
              <p className="text-sm text-muted-foreground">Funnel starts when triggered</p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Steps */}
      {steps.map((step, index) => (
        <div key={step.id} className="relative">
          <div className="absolute left-1/2 -translate-x-1/2 -top-3">
            <ArrowDown className="h-6 w-6 text-border" />
          </div>
          <FunnelNode
            step={step}
            index={index}
            onDelete={() => handleDeleteStep(index)}
            onEdit={() => handleEditStep(index)}
          />
        </div>
      ))}

      {/* Add step button */}
      <div className="relative">
        {steps.length > 0 && (
          <div className="absolute left-1/2 -translate-x-1/2 -top-3">
            <ArrowDown className="h-6 w-6 text-border" />
          </div>
        )}
        <Card className="border-2 border-dashed">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-2 justify-center">
              {stepOptions.map((option) => (
                <Button
                  key={option.type}
                  variant="outline"
                  onClick={() => handleAddStep(option.type)}
                  className="gap-2"
                >
                  <option.icon className={`h-4 w-4 ${option.color}`} />
                  {option.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add step dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="capitalize">Add {newStepType} Step</DialogTitle>
            <DialogDescription>
              Configure the step settings below.
            </DialogDescription>
          </DialogHeader>
          {newStepType && renderStepForm(newStepType)}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveNewStep} className="bg-gradient-to-r from-pink-500 to-purple-600">
              Add Step
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit step dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="capitalize">
              Edit {editingIndex !== null ? steps[editingIndex]?.step_type : ''} Step
            </DialogTitle>
            <DialogDescription>
              Update the step settings below.
            </DialogDescription>
          </DialogHeader>
          {editingIndex !== null && steps[editingIndex] && renderStepForm(steps[editingIndex].step_type)}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveEdit} className="bg-gradient-to-r from-pink-500 to-purple-600">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
