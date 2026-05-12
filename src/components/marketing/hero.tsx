'use client'

import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PRICING_COPY } from '@/lib/pricing'
import {
  ArrowRight,
  DollarSign,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
} from 'lucide-react'

const trustChips = [
  'Built for creators and managers',
  'CSV import supported',
  'Independent workflow workspace',
]

const previewCards = [
  {
    icon: Users,
    label: 'Subscriber segments',
    value: 'VIP, warm, and at-risk fans',
    detail: 'Prioritize follow-up without guesswork',
    bg: 'from-emerald-500/10 to-green-500/5 dark:from-emerald-500/20 dark:to-green-500/10',
  },
  {
    icon: MessageSquare,
    label: 'DM workflows',
    value: 'Welcome, re-engage, and upsell flows',
    detail: 'Automate the moments that usually slip',
    bg: 'from-pink-500/10 to-rose-500/5 dark:from-pink-500/20 dark:to-rose-500/10',
  },
  {
    icon: DollarSign,
    label: 'PPV testing',
    value: 'Compare offers by segment',
    detail: 'See which sends deserve another round',
    bg: 'from-purple-500/10 to-violet-500/5 dark:from-purple-500/20 dark:to-violet-500/10',
  },
  {
    icon: TrendingUp,
    label: 'Source attribution',
    value: 'Know which channels convert',
    detail: 'Keep your best acquisition loops visible',
    bg: 'from-amber-500/10 to-yellow-500/5 dark:from-amber-500/20 dark:to-yellow-500/10',
  },
]

const previewQueue = [
  {
    title: 'New subscriber',
    status: 'Welcome workflow ready',
  },
  {
    title: 'High-intent fan',
    status: 'PPV test queued',
  },
  {
    title: 'Cooling off',
    status: 'Re-engagement follow-up ready',
  },
]

export function Hero() {
  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      {/* Animated background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-pink-200/60 to-purple-200/60 dark:from-pink-900/30 dark:to-purple-900/30 blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-purple-200/60 to-pink-200/60 dark:from-purple-900/30 dark:to-pink-900/30 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gradient-to-br from-pink-100/40 to-purple-100/40 dark:from-pink-950/20 dark:to-purple-950/20 blur-3xl" />
        
        {/* Floating elements */}
        <div className="absolute top-32 left-[10%] animate-float hidden md:block" style={{ animationDuration: '6s' }}>
          <div className="w-16 h-16 rounded-2xl bg-white dark:bg-gray-800 shadow-xl flex items-center justify-center rotate-12 border border-pink-100 dark:border-pink-900/50">
            <TrendingUp className="h-8 w-8 text-green-500" />
          </div>
        </div>
        <div className="absolute top-48 right-[12%] animate-float hidden md:block" style={{ animationDuration: '8s', animationDelay: '0.5s' }}>
          <div className="w-14 h-14 rounded-xl bg-white dark:bg-gray-800 shadow-xl flex items-center justify-center -rotate-6 border border-purple-100 dark:border-purple-900/50">
            <Users className="h-7 w-7 text-purple-500" />
          </div>
        </div>
        <div className="absolute bottom-48 left-[15%] animate-float hidden md:block" style={{ animationDuration: '7s', animationDelay: '1s' }}>
          <div className="w-12 h-12 rounded-lg bg-white dark:bg-gray-800 shadow-xl flex items-center justify-center rotate-6 border border-pink-100 dark:border-pink-900/50">
            <DollarSign className="h-6 w-6 text-pink-500" />
          </div>
        </div>
        <div className="absolute bottom-32 right-[18%] animate-float hidden md:block" style={{ animationDuration: '9s', animationDelay: '0.3s' }}>
          <div className="w-12 h-12 rounded-lg bg-white dark:bg-gray-800 shadow-xl flex items-center justify-center -rotate-12 border border-purple-100 dark:border-purple-900/50">
            <MessageSquare className="h-6 w-6 text-blue-500" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="mb-6 bg-gradient-to-r from-pink-500/10 to-purple-500/10 dark:from-pink-500/20 dark:to-purple-500/20 text-pink-600 dark:text-pink-400 border-pink-200/50 dark:border-pink-800/50 px-5 py-2 text-sm font-medium backdrop-blur-sm">
            <Sparkles className="h-4 w-4 mr-2 text-yellow-500" />
            Built for creators who need more than spreadsheets
          </Badge>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-[1.1] tracking-tight text-gray-900 dark:text-white">
            Run your creator business with{' '}
            <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 bg-[length:200%_auto] animate-gradient bg-clip-text text-transparent">
              less manual work
            </span>{' '}
            and clearer subscriber signal
          </h1>

          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
            CreatorHub helps subscription creators and managers organize subscriber
            context, plan follow-up workflows, test PPV pricing, and see which
            operating moves are worth repeating.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button
                size="lg"
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-lg px-10 py-7 shadow-2xl shadow-pink-500/30 hover:shadow-pink-500/50 transition-all duration-300 hover:scale-105 group font-semibold rounded-full"
              >
                {PRICING_COPY.primaryCtaLabel}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="#pricing">
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-10 py-7 rounded-full border-gray-300 bg-white/80 hover:bg-white dark:border-gray-700 dark:bg-gray-900/70 dark:hover:bg-gray-900"
              >
                {PRICING_COPY.secondaryCtaLabel}
              </Button>
            </Link>
          </div>

          <p className="mx-auto mt-5 max-w-3xl text-xs leading-relaxed text-gray-500 dark:text-gray-400">
            CreatorHub is an independent workspace, not an official OnlyFans
            integration. Teams typically work from CSV imports plus manual
            platform-side execution.
          </p>

          <p className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm font-medium text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-green-500" />
              14-day Pro trial
            </span>
            <span className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-green-500" />
              {PRICING_COPY.noCardRequiredLabel}
            </span>
            <span className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-green-500" />
              {PRICING_COPY.importHelpLabel}
            </span>
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-3 text-sm">
            {trustChips.map((chip) => (
              <div
                key={chip}
                className="flex items-center gap-2 rounded-full border border-gray-200/70 bg-white/90 px-5 py-2.5 shadow-lg dark:border-gray-700/70 dark:bg-gray-800/90"
              >
                <span className="font-semibold text-gray-700 dark:text-gray-300">{chip}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Dashboard preview */}
        <div className="mt-20 relative">
          <p className="mb-2 text-center text-sm font-medium uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">
            Illustrative product preview
          </p>
          <p className="mb-4 text-center text-sm text-gray-500 dark:text-gray-400">
            Example workflow view only, not live customer data.
          </p>
          <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-gray-950 via-transparent to-transparent z-10 pointer-events-none h-full" />
          <div className="rounded-3xl border-2 border-gray-200/50 dark:border-gray-800/50 shadow-2xl overflow-hidden bg-white dark:bg-gray-900 mx-auto max-w-5xl">
            <div className="bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-850 px-5 py-3.5 flex items-center gap-3 border-b border-gray-200/50 dark:border-gray-700/50">
              <div className="flex gap-2">
                <div className="w-3.5 h-3.5 rounded-full bg-red-400" />
                <div className="w-3.5 h-3.5 rounded-full bg-yellow-400" />
                <div className="w-3.5 h-3.5 rounded-full bg-green-400" />
              </div>
              <div className="flex-1 text-center">
                <div className="inline-flex items-center gap-2 bg-white dark:bg-gray-900 rounded-lg px-4 py-1.5 text-sm text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                  app.creatorhub.com/dashboard
                </div>
              </div>
            </div>
            <div className="p-8 bg-gradient-to-br from-gray-50/50 to-white dark:from-gray-900 dark:to-gray-950">
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4 mb-6">
                {previewCards.map((card) => {
                  const Icon = card.icon
                  return (
                    <div key={card.label} className={`bg-gradient-to-br ${card.bg} rounded-2xl p-5 border border-gray-100 dark:border-gray-800`}>
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{card.label}</p>
                        <div className="w-10 h-10 rounded-xl bg-white dark:bg-gray-800 shadow-sm flex items-center justify-center">
                          <Icon className="h-5 w-5 text-gray-400" />
                        </div>
                      </div>
                      <p className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">{card.value}</p>
                      <p className="mt-1 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                        {card.detail}
                      </p>
                    </div>
                  )
                })}
              </div>
              <div className="grid gap-5 md:grid-cols-3">
                <div className="md:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 h-48">
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-base font-bold text-gray-800 dark:text-white">Workflow coverage</span>
                    <span className="text-sm text-gray-400 font-medium">Illustrative view</span>
                  </div>
                  <div className="flex items-end justify-between h-28 px-2">
                    {[72, 54, 65, 48, 58, 43, 62].map((height, index) => (
                      <div key={index} className="flex flex-col items-center gap-2">
                        <div 
                          className="w-8 bg-gradient-to-t from-pink-500 to-purple-400 rounded-lg shadow-sm"
                          style={{ height: `${height}%` }}
                        />
                        <span className="text-xs text-gray-400 font-medium">
                          {['DM', 'Seg', 'PPV', 'Src', 'CRM', 'Ret', 'Ops'][index]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 h-48">
                  <span className="text-base font-bold text-gray-800 dark:text-white">Priority queue</span>
                  <div className="mt-4 space-y-3">
                    {previewQueue.map((item) => (
                      <div key={item.title} className="flex items-center gap-3 p-2.5 rounded-xl bg-gradient-to-r from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 border border-gray-100 dark:border-gray-600">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white text-sm font-bold shadow-md">
                          <MessageSquare className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">{item.title}</p>
                          <p className="text-xs text-gray-400">{item.status}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
