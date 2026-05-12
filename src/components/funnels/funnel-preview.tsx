'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { MessageSquare, Clock, GitBranch, ArrowRight } from 'lucide-react'
import { FunnelStepWithDetails } from '@/types'

interface FunnelPreviewProps {
  name: string
  triggerType: string
  steps: FunnelStepWithDetails[]
}

const stepIcons = {
  message: MessageSquare,
  delay: Clock,
  condition: GitBranch,
}

export function FunnelPreview({ name, triggerType, steps }: FunnelPreviewProps) {
  void name
  const getTriggerLabel = (type: string) => {
    switch (type) {
      case 'dm_received':
        return 'When a DM is received'
      case 'bio_click':
        return 'When bio link is clicked'
      case 'new_follower':
        return 'When someone follows'
      default:
        return 'Manual trigger'
    }
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-between">
          Preview
          <Badge variant="outline">{steps.length} steps</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {/* Trigger */}
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-pink-500/15">
                <ArrowRight className="h-4 w-4 text-pink-400" />
              </div>
              <div>
                <p className="text-sm font-medium">Trigger</p>
                <p className="text-xs text-muted-foreground">{getTriggerLabel(triggerType)}</p>
              </div>
            </div>

            {/* Steps */}
            {steps.map((step, index) => {
              const Icon = stepIcons[step.step_type] || MessageSquare

              return (
                <div key={step.id} className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <div className="h-4 w-px bg-border" />
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-muted">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                  <div className="pt-4">
                    <p className="text-sm font-medium capitalize">
                      {index + 1}. {step.step_type}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {step.step_type === 'message' && (
                        step.content?.message?.slice(0, 50) + ((step.content?.message?.length ?? 0) > 50 ? '...' : '')
                      )}
                      {step.step_type === 'delay' && (
                        `Wait ${step.content?.delay_minutes || 0} minutes`
                      )}
                      {step.step_type === 'condition' && step.content?.condition && (
                        `If ${step.content.condition.field} ${step.content.condition.operator} ${step.content.condition.value}`
                      )}
                    </p>
                  </div>
                </div>
              )
            })}

            {steps.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p className="text-sm">No steps added yet</p>
                <p className="text-xs">Add steps to build your funnel</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
