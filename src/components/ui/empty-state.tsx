import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  action?: React.ReactNode
  className?: string
}

/**
 * Polished empty state for dashboard pages.
 * Spec: subtle 32px lucide icon (zinc-600), clear "what goes here" headline,
 * one-sentence value description, and a primary CTA.
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <Card className={cn("border-dashed", className)}>
      <CardContent className="flex flex-col items-center justify-center gap-3 py-16 text-center">
        <Icon className="h-8 w-8 text-zinc-600" strokeWidth={1.5} />
        <div className="space-y-1">
          <h3 className="text-base font-semibold text-zinc-200">{title}</h3>
          <p className="mx-auto max-w-sm text-sm text-zinc-500 leading-relaxed">
            {description}
          </p>
        </div>
        {action && <div className="mt-2">{action}</div>}
      </CardContent>
    </Card>
  )
}
