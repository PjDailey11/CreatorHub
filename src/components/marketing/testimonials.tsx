'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Star, Quote } from 'lucide-react'

const testimonials = [
  {
    name: 'Sarah J.',
    role: 'Top 1% Creator',
    image: null,
    content: 'CreatorHub completely transformed how I manage my subscribers. The DM funnels alone saved me 10+ hours per week!',
    rating: 5,
    revenue: '+47% revenue',
    gradient: 'from-pink-400 to-rose-500',
  },
  {
    name: 'Emily R.',
    role: 'Content Creator',
    image: null,
    content: 'The PPV pricing recommendations are game-changing. I was leaving so much money on the table before using this tool.',
    rating: 5,
    revenue: '+$2,400/month',
    gradient: 'from-purple-400 to-indigo-500',
  },
  {
    name: 'Jessica M.',
    role: 'Model & Creator',
    image: null,
    content: 'Finally, a tool built specifically for OF creators. The analytics help me understand exactly where my best fans come from.',
    rating: 5,
    revenue: '2x subscribers',
    gradient: 'from-blue-400 to-cyan-500',
  },
  {
    name: 'Amanda K.',
    role: 'Top 3% Creator',
    image: null,
    content: 'I was skeptical at first, but the automated welcome funnels have increased my retention rate significantly.',
    rating: 5,
    revenue: '-32% churn',
    gradient: 'from-green-400 to-emerald-500',
  },
  {
    name: 'Taylor W.',
    role: 'Agency Owner',
    image: null,
    content: 'Managing multiple creator accounts used to be a nightmare. Now I can handle 5x more clients with CreatorHub.',
    rating: 5,
    revenue: '5x efficiency',
    gradient: 'from-orange-400 to-amber-500',
  },
  {
    name: 'Mia L.',
    role: 'Content Creator',
    image: null,
    content: 'The subscriber segmentation feature is incredible. I can now personalize my content and pricing for different fan tiers.',
    rating: 5,
    revenue: '+65% engagement',
    gradient: 'from-violet-400 to-purple-500',
  },
]

export function Testimonials() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-pink-200/20 dark:bg-pink-900/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-purple-200/20 dark:bg-purple-900/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-16">
          <Badge className="mb-5 bg-gradient-to-r from-pink-500/10 to-purple-500/10 dark:from-pink-500/20 dark:to-purple-500/20 text-pink-600 dark:text-pink-400 border-pink-200/50 dark:border-pink-800/50 px-5 py-2 text-sm font-medium">
            <Quote className="h-4 w-4 mr-2" />
            Testimonials
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-5 tracking-tight text-gray-900 dark:text-white">
            Loved by{' '}
            <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              1,000+ Creators
            </span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-medium">
            See what creators are saying about how CreatorHub has helped grow their business.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="border-0 bg-white dark:bg-gray-800/50 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group overflow-hidden"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Top gradient accent */}
              <div className={`h-1 bg-gradient-to-r ${testimonial.gradient}`} />
              
              <CardContent className="p-6">
                {/* Rating */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400 drop-shadow-sm" />
                  ))}
                </div>

                {/* Quote icon */}
                <div className="mb-4">
                  <Quote className={`h-8 w-8 text-gray-200 dark:text-gray-700`} />
                </div>

                {/* Quote */}
                <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed text-lg">
                  {testimonial.content}
                </p>

                {/* Author */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className={`h-12 w-12 rounded-full bg-gradient-to-br ${testimonial.gradient} flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800">
                    {testimonial.revenue}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
