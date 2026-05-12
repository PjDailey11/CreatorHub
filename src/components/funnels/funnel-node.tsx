'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MessageSquare, Clock, GitBranch, Trash2, GripVertical } from 'lucide-react'
import { FunnelStepWithDetails } from '@/types'

interface FunnelNodeProps {
  step: FunnelStepWithDetails
  index: number
  onDelete: () => void
  onEdit: () => void
}

const stepIcons = {
  message: MessageSquare,
  delay: Clock,
  condition: GitBranch,
}

const stepColors = {
  message: 'from-blue-500 to-blue-600',
  delay: 'from-orange-500 to-orange-600',
  condition: 'from-purple-500 to-purple-600',
}

export function FunnelNode({ step, index, onDelete, onEdit }: FunnelNodeProps) {
  const Icon = stepIcons[step.step_type] || MessageSquare
  const color = stepColors[step.step_type] || stepColors.message

  const getStepDescription = () => {
    switch (step.step_type) {
      case 'message':
        return step.content?.message || 'No message set'
      case 'delay':
        const mins = step.content?.delay_minutes || 0
        if (mins >= 1440) return `Wait ${Math.floor(mins / 1440)} day(s)`
        if (mins >= 60) return `Wait ${Math.floor(mins / 60)} hour(s)`
        return `Wait ${mins} minute(s)`
      case 'condition':
        const cond = step.content?.condition
        if (!cond) return 'No condition set'
        return `If ${cond.field} ${cond.operator} ${cond.value}`
      default:
        return 'Unknown step'
    }
  }

  return (
    <Card className="relative group cursor-pointer hover:shadow-md transition-shadow" onClick={onEdit}>
      <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`h-8 w-8 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center`}>
            <Icon className="h-4 w-4 text-white" />
          </div>
          <div>
            <CardTitle className="text-sm font-medium capitalize">
              {step.step_type}
            </CardTitle>
            <Badge variant="outline" className="text-xs">
              Step {index + 1}
            </Badge>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
        >
          <Trash2 className="h-4 w-4 text-red-500" />
        </Button>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground truncate">
          {getStepDescription()}
        </p>
      </CardContent>
    </Card>
  )
}
