'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BarChart3, MessageSquare, Sparkles, Users } from 'lucide-react'

const useCases = [
  {
    icon: MessageSquare,
    title: 'Welcome and re-engagement flows',
    description:
      'Set up subscriber follow-up that fires when someone joins, cools off, or needs a second touch.',
    outcome: 'Designed to improve response consistency',
    gradient: 'from-pink-400 to-rose-500',
  },
  {
    icon: Users,
    title: 'Subscriber context in one place',
    description:
      'Keep notes, segment status, and buying signals visible for creators or managers without juggling separate sheets.',
    outcome: 'Designed to cut spreadsheet sprawl',
    gradient: 'from-purple-400 to-indigo-500',
  },
  {
    icon: Sparkles,
    title: 'PPV and offer testing',
    description:
      'Compare different offers by segment so pricing decisions come from patterns instead of memory.',
    outcome: 'Designed to sharpen offer decisions',
    gradient: 'from-blue-400 to-cyan-500',
  },
  {
    icon: BarChart3,
    title: 'Acquisition and retention visibility',
    description:
      'See which channels bring in paying subscribers and where churn risk starts to show up.',
    outcome: 'Designed to focus the next follow-up',
    gradient: 'from-green-400 to-emerald-500',
  },
]

export function Testimonials() {
  return (
    <section className="relative overflow-hidden py-24">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/3 h-96 w-96 rounded-full bg-pink-200/20 blur-3xl dark:bg-pink-900/10" />
        <div className="absolute right-1/3 bottom-0 h-96 w-96 rounded-full bg-purple-200/20 blur-3xl dark:bg-purple-900/10" />
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="mb-16 text-center">
          <Badge className="mb-5 border-pink-200/50 bg-gradient-to-r from-pink-500/10 to-purple-500/10 px-5 py-2 text-sm font-medium text-pink-600 dark:border-pink-800/50 dark:from-pink-500/20 dark:to-purple-500/20 dark:text-pink-400">
            <Sparkles className="mr-2 h-4 w-4" />
            What creators use it for
          </Badge>
          <h2 className="mb-5 text-4xl font-bold tracking-tight text-gray-900 dark:text-white md:text-5xl">
            Real workflows, not invented testimonials
          </h2>
          <p className="mx-auto max-w-2xl text-lg font-medium text-gray-600 dark:text-gray-400">
            Until we have permission to publish named stories, we would rather show
            the jobs CreatorHub is built to handle and the outcomes the product is
            designed to support.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {useCases.map((useCase) => {
            const Icon = useCase.icon

            return (
            <Card
              key={useCase.title}
              className="group overflow-hidden border-0 bg-white shadow-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl dark:bg-gray-800/50 dark:backdrop-blur-sm"
            >
              <div className={`h-1 bg-gradient-to-r ${useCase.gradient}`} />
              <CardContent className="p-6">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-50 shadow-sm dark:bg-gray-900">
                  <Icon className="h-6 w-6 text-pink-500" />
                </div>
                <h3 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  {useCase.title}
                </h3>
                <p className="mt-4 text-base leading-relaxed text-gray-600 dark:text-gray-300">
                  {useCase.description}
                </p>
                <div className="mt-6 border-t border-gray-100 pt-4 dark:border-gray-700">
                  <Badge className="border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                    {useCase.outcome}
                  </Badge>
                </div>
              </CardContent>
            </Card>
            )
          })}
        </div>

        <div className="mx-auto mt-10 max-w-4xl rounded-[2rem] border border-dashed border-pink-300/70 bg-pink-50/70 p-8 text-center shadow-lg shadow-pink-500/5 dark:border-pink-800/70 dark:bg-pink-950/20">
          <Badge className="mb-4 border-pink-200/60 bg-white text-pink-600 dark:border-pink-800/60 dark:bg-gray-900 dark:text-pink-400">
            Future case studies
          </Badge>
          <h3 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Case studies can live here later
          </h3>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-gray-600 dark:text-gray-300">
            We will publish named creator stories here once customers approve quotes,
            screenshots, and outcome data for public use.
          </p>
        </div>
      </div>
    </section>
  )
}
