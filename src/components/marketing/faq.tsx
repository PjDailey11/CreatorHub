'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { ContactModal } from '@/components/ui/contact-modal'
import { 
  HelpCircle, 
  ChevronDown, 
  DollarSign, 
  Shield, 
  MessageSquare, 
  Zap,
  Users,
  CreditCard,
  Sparkles,
  Lock
} from 'lucide-react'
import { cn } from '@/lib/utils'

const faqCategories = [
  { id: 'all', label: 'All Questions', icon: HelpCircle },
  { id: 'pricing', label: 'Pricing & Plans', icon: DollarSign },
  { id: 'features', label: 'Features', icon: Zap },
  { id: 'security', label: 'Security', icon: Shield },
]

const faqs = [
  {
    question: 'How does the PPV price optimizer work?',
    answer: 'Our AI analyzes each subscriber\'s tier, engagement level, spending history, and other factors to recommend optimal PPV prices. Higher-value subscribers see higher recommended prices, maximizing your revenue while maintaining engagement.',
    category: 'features',
    icon: Sparkles,
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    question: 'Can I import my existing subscribers?',
    answer: 'Yes! You can manually add subscribers or use our bulk import feature. We support CSV imports and are working on direct OnlyFans API integration.',
    category: 'features',
    icon: Users,
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    question: 'How do DM funnels work?',
    answer: 'DM funnels are automated message sequences triggered by specific actions like new subscriptions, bio link clicks, or incoming DMs. You create the sequence once, and it runs automatically for each subscriber who triggers it.',
    category: 'features',
    icon: MessageSquare,
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    question: 'Is my data secure?',
    answer: 'Absolutely. We use industry-standard encryption for all data at rest and in transit. We never share your data with third parties, and you can delete your account and all associated data at any time.',
    category: 'security',
    icon: Lock,
    gradient: 'from-red-500 to-orange-500',
  },
  {
    question: 'Can I cancel my subscription anytime?',
    answer: 'Yes, you can cancel your subscription at any time with no cancellation fees. Your access continues until the end of your current billing period.',
    category: 'pricing',
    icon: CreditCard,
    gradient: 'from-amber-500 to-yellow-500',
  },
  {
    question: 'Do you offer a free trial?',
    answer: 'Yes! All new accounts start with a 14-day free trial of our Pro plan. No credit card required to get started.',
    category: 'pricing',
    icon: Zap,
    gradient: 'from-violet-500 to-purple-500',
  },
  {
    question: 'What makes CreatorHub different from other tools?',
    answer: 'CreatorHub is built specifically for OnlyFans creators. Our AI-powered features like PPV optimization and automated source attribution help you maximize revenue while saving time on manual tasks.',
    category: 'features',
    icon: Sparkles,
    gradient: 'from-pink-500 to-rose-500',
  },
  {
    question: 'Can I use CreatorHub for multiple accounts?',
    answer: 'Our Agency plan supports multiple account management. You can manage up to 10 creator accounts from a single dashboard, perfect for agencies and managers.',
    category: 'pricing',
    icon: Users,
    gradient: 'from-indigo-500 to-blue-500',
  },
]

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  const [activeCategory, setActiveCategory] = useState('all')
  const [isContactOpen, setIsContactOpen] = useState(false)

  const filteredFaqs = activeCategory === 'all' 
    ? faqs 
    : faqs.filter(faq => faq.category === activeCategory)

  return (
    <>
      <section id="faq" className="py-24 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-pink-200/20 dark:bg-pink-900/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-200/20 dark:bg-purple-900/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-14">
            <Badge className="mb-5 bg-gradient-to-r from-pink-500/10 to-purple-500/10 dark:from-pink-500/20 dark:to-purple-500/20 text-pink-600 dark:text-pink-400 border-pink-200/50 dark:border-pink-800/50 px-5 py-2 text-sm font-medium">
              <HelpCircle className="h-4 w-4 mr-2" />
              FAQ
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-5 tracking-tight text-gray-900 dark:text-white">
              Frequently Asked{' '}
              <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                Questions
              </span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-medium">
              Got questions? We&apos;ve got answers. If you don&apos;t see what you&apos;re looking for, 
              reach out to our support team.
            </p>
          </div>

          {/* Category tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {faqCategories.map((category) => {
              const Icon = category.icon
              return (
                <button
                  key={category.id}
                  onClick={() => {
                    setActiveCategory(category.id)
                    setOpenIndex(null)
                  }}
                  className={cn(
                    'flex items-center gap-2 px-5 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105',
                    activeCategory === category.id
                      ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-xl shadow-pink-500/25'
                      : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border-2 border-gray-200 dark:border-gray-700 hover:border-pink-300 dark:hover:border-pink-700'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {category.label}
                </button>
              )
            })}
          </div>

          {/* FAQ Grid */}
          <div className="max-w-4xl mx-auto">
            <div className="grid gap-4">
              {filteredFaqs.map((faq, index) => {
                const Icon = faq.icon
                const isOpen = openIndex === index
                
                return (
                  <div
                    key={index}
                    className={cn(
                      'group rounded-2xl overflow-hidden transition-all duration-500 transform',
                      isOpen 
                        ? 'bg-white dark:bg-gray-800 shadow-xl scale-[1.02]' 
                        : 'bg-white/80 dark:bg-gray-800/80 shadow-lg hover:shadow-xl hover:scale-[1.01]'
                    )}
                  >
                    <button
                      onClick={() => setOpenIndex(isOpen ? null : index)}
                      className="w-full px-6 py-5 text-left flex items-center gap-4 transition-colors"
                    >
                      {/* Icon with gradient background */}
                      <div className={cn(
                        'flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center transition-transform duration-300',
                        faq.gradient,
                        isOpen ? 'scale-110 rotate-3' : 'group-hover:scale-105'
                      )}>
                        <Icon className="h-7 w-7 text-white" />
                      </div>
                      
                      <div className="flex-1">
                        <span className="font-bold text-gray-900 dark:text-white text-lg block">
                          {faq.question}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400 capitalize font-medium">
                          {faq.category}
                        </span>
                      </div>
                      
                      <div className={cn(
                        'flex-shrink-0 w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center transition-all duration-300',
                        isOpen && 'bg-gradient-to-r from-pink-500 to-purple-600'
                      )}>
                        <ChevronDown
                          className={cn(
                            'h-6 w-6 transition-all duration-300',
                            isOpen ? 'rotate-180 text-white' : 'text-gray-400'
                          )}
                        />
                      </div>
                    </button>
                    
                    <div
                      className={cn(
                        'overflow-hidden transition-all duration-500 ease-out',
                        isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                      )}
                    >
                      <div className="px-6 pb-6 ml-[4.5rem]">
                        <div className="p-5 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-gray-700 dark:to-gray-800 border border-gray-100 dark:border-gray-600">
                          <p className="text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Bottom contact card */}
          <div className="mt-16 flex justify-center">
            <div className="relative">
              <div className="flex items-center gap-5 px-8 py-5 bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700">
                <div className="flex -space-x-3">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className={cn(
                        'w-12 h-12 rounded-full border-3 border-white dark:border-gray-800 flex items-center justify-center text-white text-lg font-bold shadow-lg',
                        i === 0 && 'bg-gradient-to-br from-pink-400 to-pink-600',
                        i === 1 && 'bg-gradient-to-br from-purple-400 to-purple-600',
                        i === 2 && 'bg-gradient-to-br from-blue-400 to-blue-600',
                        i === 3 && 'bg-gradient-to-br from-green-400 to-green-600',
                      )}
                    >
                      {['🎨', '💬', '📊', '🚀'][i]}
                    </div>
                  ))}
                </div>
                <div>
                  <p className="font-bold text-gray-900 dark:text-white text-lg">Still have questions?</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Our support team is here to help 24/7</p>
                </div>
                <button 
                  onClick={() => setIsContactOpen(true)}
                  className="ml-4 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-bold hover:shadow-xl hover:shadow-pink-500/30 transition-all duration-300 hover:scale-105"
                >
                  Contact Us
                </button>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-yellow-400 rounded-xl rotate-12 animate-bounce shadow-lg" style={{ animationDelay: '0.1s', animationDuration: '3s' }} />
              <div className="absolute -bottom-3 -left-3 w-6 h-6 bg-pink-400 rounded-full animate-bounce shadow-lg" style={{ animationDelay: '0.3s', animationDuration: '4s' }} />
            </div>
          </div>
        </div>
      </section>

      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </>
  )
}
