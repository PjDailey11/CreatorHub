'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { MessageSquare, ShieldCheck, Sparkles, Users } from 'lucide-react'

const trustSignals = [
  {
    icon: Users,
    eyebrow: 'Who it is for',
    title: 'Built for creators and managers',
    description:
      'Solo creators, assistants, and agency teams can keep subscriber context, follow-up, and offer testing in one operating view.',
  },
  {
    icon: Sparkles,
    eyebrow: 'Product posture',
    title: 'Independent workflow software',
    description:
      'The product promise is cleaner operations and clearer signal, not invented scale claims or placeholder social proof.',
  },
  {
    icon: MessageSquare,
    eyebrow: 'Feedback loop',
    title: 'Shaped by real workflow pain',
    description:
      'The roadmap focuses on cleaner onboarding, better segmentation, and less spreadsheet handoff across the subscriber lifecycle.',
  },
  {
    icon: ShieldCheck,
    eyebrow: 'Support model',
    title: 'Real routes and support',
    description:
      'Questions, onboarding friction, and trust details now route to real legal and contact pages instead of placeholders.',
  },
]

export function Stats() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600 py-20">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 h-64 w-64 rounded-full bg-white/10 blur-3xl animate-pulse" />
        <div
          className="absolute right-1/4 bottom-0 h-64 w-64 rounded-full bg-white/10 blur-3xl animate-pulse"
          style={{ animationDelay: '1s' }}
        />
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="mx-auto mb-12 max-w-3xl text-center text-white">
          <Badge className="mb-5 border-white/20 bg-white/15 px-5 py-2 text-sm font-medium text-white backdrop-blur-sm">
            <ShieldCheck className="mr-2 h-4 w-4" />
            Trust signals
          </Badge>
          <h2 className="text-4xl font-bold tracking-tight md:text-5xl">
            Credibility matters more than invented scale
          </h2>
          <p className="mt-5 text-lg font-medium leading-relaxed text-white/80">
            This section explains what CreatorHub is, who it is for, and how the
            workflow is being shaped without pretending we have proof we do not.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {trustSignals.map((signal) => {
            const Icon = signal.icon

            return (
              <Card
                key={signal.title}
                className="border-white/15 bg-white/10 text-white shadow-2xl backdrop-blur-sm"
              >
                <CardContent className="p-6">
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 shadow-lg">
                    <Icon className="h-7 w-7" />
                  </div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
                    {signal.eyebrow}
                  </p>
                  <h3 className="mt-3 text-2xl font-bold tracking-tight">{signal.title}</h3>
                  <p className="mt-4 text-sm leading-relaxed text-white/75">
                    {signal.description}
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
