'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Users,
  DollarSign,
  BarChart3,
  Zap,
  Shield,
  TrendingUp,
  GitBranch,
} from 'lucide-react'

const features = [
  {
    icon: Users,
    title: 'Subscriber Management',
    description: 'Track and manage all your subscribers in one place. Monitor tiers, spending habits, and engagement levels.',
    badge: 'Core',
    color: 'from-pink-500 to-rose-500',
    shadowColor: 'shadow-pink-500/20',
  },
  {
    icon: GitBranch,
    title: 'DM Funnels',
    description: 'Automate your welcome messages and engagement sequences. Set triggers and let the funnels work 24/7.',
    badge: 'Popular',
    color: 'from-purple-500 to-indigo-500',
    shadowColor: 'shadow-purple-500/20',
  },
  {
    icon: DollarSign,
    title: 'PPV Price Optimizer',
    description: 'AI-powered pricing recommendations based on subscriber tier, engagement, and spending history.',
    badge: 'AI Powered',
    color: 'from-green-500 to-emerald-500',
    shadowColor: 'shadow-green-500/20',
  },
  {
    icon: BarChart3,
    title: 'Advanced Analytics',
    description: 'Track revenue, growth trends, and content performance. Know where your best subscribers come from.',
    badge: 'Insights',
    color: 'from-blue-500 to-cyan-500',
    shadowColor: 'shadow-blue-500/20',
  },
  {
    icon: TrendingUp,
    title: 'Source Attribution',
    description: 'Track which platforms drive the most valuable subscribers. Optimize your marketing spend.',
    badge: 'Growth',
    color: 'from-orange-500 to-amber-500',
    shadowColor: 'shadow-orange-500/20',
  },
  {
    icon: Shield,
    title: 'Privacy First',
    description: 'Your data is encrypted and secure. We never share your information with third parties.',
    badge: 'Secure',
    color: 'from-slate-500 to-gray-500',
    shadowColor: 'shadow-slate-500/20',
  },
]

export function Features() {
  return (
    <section id="features" className="py-24 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 -left-32 w-64 h-64 bg-pink-200/30 dark:bg-pink-900/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-64 h-64 bg-purple-200/30 dark:bg-purple-900/20 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-16">
          <Badge className="mb-5 bg-gradient-to-r from-pink-500/10 to-purple-500/10 dark:from-pink-500/20 dark:to-purple-500/20 text-pink-600 dark:text-pink-400 border-pink-200/50 dark:border-pink-800/50 px-5 py-2 text-sm font-medium">
            <Zap className="h-4 w-4 mr-2" />
            Powerful Features
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-5 tracking-tight text-gray-900 dark:text-white">
            Everything You Need to{' '}
            <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              Scale Your Business
            </span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-medium">
            CreatorHub provides all the tools you need to manage subscribers, 
            automate engagement, and maximize your revenue.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card
              key={feature.title}
              className={`relative overflow-hidden border-0 bg-white dark:bg-gray-800/50 backdrop-blur-sm shadow-xl ${feature.shadowColor} hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Gradient border effect on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
              
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="h-7 w-7 text-white" />
                  </div>
                  <Badge variant="outline" className="text-xs bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700">
                    {feature.badge}
                  </Badge>
                </div>
                <CardTitle className="text-xl text-gray-900 dark:text-white">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
