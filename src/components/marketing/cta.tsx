'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles, Star, Zap, TrendingUp } from 'lucide-react'

export function CTA() {
  return (
    <section className="py-24 bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-600 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-white/10 blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-72 h-72 rounded-full bg-white/10 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
        
        {/* Floating icons */}
        <div className="absolute top-20 left-[15%] animate-bounce" style={{ animationDuration: '3s' }}>
          <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center rotate-12">
            <Star className="h-6 w-6 text-yellow-300" />
          </div>
        </div>
        <div className="absolute bottom-32 left-[20%] animate-bounce" style={{ animationDuration: '4s', animationDelay: '0.5s' }}>
          <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center -rotate-6">
            <Zap className="h-5 w-5 text-yellow-300" />
          </div>
        </div>
        <div className="absolute top-32 right-[15%] animate-bounce" style={{ animationDuration: '3.5s', animationDelay: '1s' }}>
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center rotate-6">
            <TrendingUp className="h-7 w-7 text-green-300" />
          </div>
        </div>
        <div className="absolute bottom-24 right-[25%] animate-bounce" style={{ animationDuration: '4.5s', animationDelay: '0.3s' }}>
          <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center -rotate-12">
            <Sparkles className="h-4 w-4 text-pink-200" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="max-w-4xl mx-auto text-center text-white">
          {/* Pill badge */}
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-5 py-2.5 mb-8 border border-white/30 hover:bg-white/30 transition-colors">
            <Sparkles className="h-4 w-4 text-yellow-300 animate-spin" style={{ animationDuration: '3s' }} />
            <span className="text-sm font-semibold">Start Your 14-Day Free Trial Today</span>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
          </div>

          <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Ready to <span className="relative">
              <span className="relative z-10">Transform</span>
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                <path d="M2 10C50 4 150 4 198 10" stroke="rgba(255,255,255,0.5)" strokeWidth="4" strokeLinecap="round"/>
              </svg>
            </span>
            <br />Your Creator Business?
          </h2>

          <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
            Join over <span className="font-bold text-yellow-300">1,000+ creators</span> who are using CreatorHub to manage subscribers, 
            automate engagement, and <span className="font-bold">maximize revenue</span>.
          </p>

          {/* Stats row */}
          <div className="flex flex-wrap justify-center gap-8 mb-10">
            {[
              { value: '$2.5M+', label: 'Revenue Generated' },
              { value: '50K+', label: 'Subscribers Managed' },
              { value: '98%', label: 'Satisfaction Rate' },
            ].map((stat, i) => (
              <div key={i} className="text-center px-4">
                <div className="text-3xl md:text-4xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-white/70">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button
                size="lg"
                className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-8 py-6 font-semibold shadow-2xl shadow-black/20 hover:shadow-white/20 transition-all duration-300 hover:scale-105 group"
              >
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button
                size="lg"
                className="bg-white/20 backdrop-blur-sm text-white border-2 border-white/50 hover:bg-white hover:text-purple-600 text-lg px-8 py-6 font-semibold transition-all duration-300 hover:scale-105"
              >
                View Pricing
              </Button>
            </Link>
          </div>

          <p className="mt-8 text-sm text-white/80 flex items-center justify-center gap-4 flex-wrap">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              No credit card required
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Cancel anytime
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              14-day free trial
            </span>
          </p>
        </div>
      </div>
    </section>
  )
}
