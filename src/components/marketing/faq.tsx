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
  Clock3,
  Lock
} from 'lucide-react'
import { cn } from '@/lib/utils'

const faqCategories = [
  { id: 'all', label: 'All Questions', icon: HelpCircle },
  { id: 'setup', label: 'Setup & Import', icon: Clock3 },
  { id: 'billing', label: 'Plans & Billing', icon: CreditCard },
  { id: 'security', label: 'Security & Data', icon: Shield },
]

const faqs = [
  {
    question: 'How long does setup usually take?',
    answer: 'Most creators can create an account, import a CSV, and publish a first welcome flow in one sitting. You can start simple, then add segments and reporting as your workflow gets sharper.',
    category: 'setup',
    icon: Clock3,
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    question: 'Can I import my current subscriber list?',
    answer: 'Yes. You can bring in subscribers with CSV import, then organize them by spend, tier, or lifecycle stage so you are not rebuilding your workflow from scratch.',
    category: 'setup',
    icon: Users,
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    question: 'What can I automate with DM funnels?',
    answer: 'DM funnels can handle welcome sequences, follow-ups, re-engagement, and other triggered messages based on actions like new subscriptions, clicks, or inactivity. You define the logic once, then let the sequence handle the repetitive work.',
    category: 'setup',
    icon: MessageSquare,
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    question: 'How does PPV pricing guidance work?',
    answer: 'CreatorHub looks at subscriber tier, engagement, and spend history to suggest smarter PPV price ranges. It gives you a better starting point than a one-price-for-everyone approach.',
    category: 'setup',
    icon: DollarSign,
    gradient: 'from-red-500 to-orange-500',
  },
  {
    question: 'Do I need a credit card to start?',
    answer: 'No. Every new account begins with a 14-day Pro trial and you can explore the product before entering billing details.',
    category: 'billing',
    icon: CreditCard,
    gradient: 'from-amber-500 to-yellow-500',
  },
  {
    question: 'Can I cancel or change plans anytime?',
    answer: 'Yes. You can upgrade, downgrade, or cancel whenever your needs change. Your access stays active through the end of the current billing period.',
    category: 'billing',
    icon: Zap,
    gradient: 'from-violet-500 to-purple-500',
  },
  {
    question: 'Is creator data secure?',
    answer: 'We use encryption for data at rest and in transit, and we do not sell or share your creator data with third parties. You can also delete your account and associated data whenever needed.',
    category: 'security',
    icon: Lock,
    gradient: 'from-pink-500 to-rose-500',
  },
  {
    question: 'Can agencies or managers use CreatorHub?',
    answer: 'Yes. The Agency plan is designed for multi-account management, shared visibility, and teams handling more than one creator workflow.',
    category: 'billing',
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
              Questions creators ask{' '}
              <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                before they start
              </span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-medium">
              The biggest blockers are usually setup time, billing clarity, and trust.
              Here are the answers buyers want before they commit.
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
            <div className="w-full max-w-3xl rounded-3xl border border-gray-200 bg-white/90 p-6 shadow-xl dark:border-gray-700 dark:bg-gray-800/90 sm:flex sm:items-center sm:justify-between sm:gap-6">
              <div className="max-w-xl">
                <p className="text-lg font-bold text-gray-900 dark:text-white">Need an answer before you sign up?</p>
                <p className="mt-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                  Tell us how you manage subscribers today and we&apos;ll help you figure out which plan and workflow make sense first.
                </p>
              </div>
              <button 
                  type="button"
                  onClick={() => setIsContactOpen(true)}
                  className="mt-5 inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 px-6 py-3 font-bold text-white transition-all duration-300 hover:shadow-xl hover:shadow-pink-500/30 sm:mt-0"
                >
                  Ask Support
                </button>
            </div>
          </div>
        </div>
      </section>

      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </>
  )
}
