import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { BarChart3, Clock3, DollarSign, MessageSquareMore } from 'lucide-react'

const workflow = [
  {
    title: 'Before CreatorHub',
    description:
      'Subscriber notes lived in spreadsheets, welcome messages were manual, and PPV pricing was mostly guesswork.',
  },
  {
    title: 'Week 1',
    description:
      'The team imported subscribers, launched one welcome funnel, and created simple spend-based segments for follow-up.',
  },
  {
    title: 'By day 30',
    description:
      'Instead of chasing admin work, they could see who was warming up, what offers were converting, and where repeat spend came from.',
  },
]

const outcomes = [
  {
    icon: Clock3,
    label: 'Manual follow-up reduced',
    value: '10+ hrs/week saved',
  },
  {
    icon: DollarSign,
    label: 'PPV revenue lifted',
    value: '+$2,400/month',
  },
  {
    icon: MessageSquareMore,
    label: 'Welcome flow retention',
    value: '-32% churn',
  },
]

export function MiniCaseStudy() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-6xl rounded-[2rem] border border-gray-200/70 bg-white/90 p-8 shadow-2xl shadow-pink-500/10 backdrop-blur-sm dark:border-gray-800/80 dark:bg-gray-900/80 md:p-12">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
            <div>
              <Badge className="mb-5 bg-gradient-to-r from-pink-500/10 to-purple-500/10 text-pink-600 dark:from-pink-500/20 dark:to-purple-500/20 dark:text-pink-400 border-pink-200/50 dark:border-pink-800/50 px-5 py-2 text-sm font-medium">
                <BarChart3 className="mr-2 h-4 w-4" />
                Mini case study
              </Badge>

              <h2 className="max-w-3xl text-4xl font-bold tracking-tight text-gray-900 dark:text-white md:text-5xl">
                What switching from spreadsheets can look like in 30 days
              </h2>

              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-gray-600 dark:text-gray-400">
                The first win is usually not a bigger dashboard. It&apos;s a tighter operating loop:
                less manual follow-up, cleaner subscriber context, and pricing decisions that come from
                segments instead of guesswork.
              </p>

              <div className="mt-8 space-y-4">
                {workflow.map((step, index) => (
                  <div
                    key={step.title}
                    className="rounded-2xl border border-gray-200/70 bg-gray-50/80 p-5 dark:border-gray-800 dark:bg-gray-950/60"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-sm font-bold text-white">
                        {index + 1}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{step.title}</h3>
                    </div>
                    <p className="mt-3 pl-12 text-gray-600 dark:text-gray-400">{step.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {outcomes.map((outcome) => {
                const Icon = outcome.icon

                return (
                  <Card
                    key={outcome.label}
                    className="border border-gray-200/70 bg-white dark:border-gray-800 dark:bg-gray-950/70"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 shadow-lg shadow-pink-500/20">
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium uppercase tracking-[0.16em] text-gray-500 dark:text-gray-400">
                            {outcome.label}
                          </p>
                          <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">{outcome.value}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}

              <div className="rounded-2xl border border-dashed border-pink-300/70 bg-pink-50/70 p-6 text-sm leading-relaxed text-gray-600 dark:border-pink-800/70 dark:bg-pink-950/20 dark:text-gray-300">
                Creator-reported outcomes vary by audience size, pricing strategy, and offer quality, but
                the pattern is consistent: better follow-up beats more manual hustle.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
