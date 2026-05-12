import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Clock3, LifeBuoy, Mail, MessageSquare } from 'lucide-react'

import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Contact | CreatorHub',
  description: 'Get in touch with CreatorHub support for billing, onboarding, or product questions.',
}

const contactOptions = [
  {
    title: 'Email support',
    description: 'Reach our team directly for account, billing, or product questions.',
    detail: 'support@creatorhub.com',
    href: 'mailto:support@creatorhub.com',
    icon: Mail,
  },
  {
    title: 'Response expectations',
    description: 'Most creator and billing questions receive a response within one business day.',
    detail: 'Monday through Friday',
    href: 'mailto:support@creatorhub.com?subject=CreatorHub%20Support',
    icon: Clock3,
  },
  {
    title: 'Plan guidance',
    description: 'Need help deciding which workflow or plan makes sense first?',
    detail: 'We can point you to the right next step.',
    href: '/pricing',
    icon: LifeBuoy,
  },
]

export default function ContactPage() {
  return (
    <section className="py-20 md:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="max-w-2xl mb-12">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-pink-500 mb-4">
              Contact
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Talk to a real person.
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
              For support, billing, onboarding, or general questions, contact the CreatorHub
              team and we&apos;ll point you in the right direction quickly.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {contactOptions.map((option) => {
              const Icon = option.icon
              const isExternal = option.href.startsWith('mailto:')

              return (
                <article
                  key={option.title}
                  className="rounded-3xl border border-gray-200/80 dark:border-gray-800 bg-white/90 dark:bg-gray-900/80 p-6 shadow-sm"
                >
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white mb-5">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
                    {option.title}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                    {option.description}
                  </p>
                  {isExternal ? (
                    <a
                      href={option.href}
                      className="font-semibold text-pink-600 dark:text-pink-400 hover:underline"
                    >
                      {option.detail}
                    </a>
                  ) : (
                    <Link
                      href={option.href}
                      className="font-semibold text-pink-600 dark:text-pink-400 hover:underline"
                    >
                      {option.detail}
                    </Link>
                  )}
                </article>
              )
            })}
          </div>

          <div className="mt-10 rounded-[2rem] border border-pink-200/60 dark:border-pink-900/40 bg-gradient-to-br from-pink-50/80 to-white dark:from-pink-950/20 dark:to-gray-900 p-8 md:p-10">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/80 dark:bg-gray-900/80 px-4 py-2 text-sm font-semibold text-pink-600 dark:text-pink-400 mb-5">
                <MessageSquare className="h-4 w-4" />
                Preferred contact channel
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Email us at support@creatorhub.com
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                Include your account email, current plan, and a short description of the issue
                so we can respond faster.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="mailto:support@creatorhub.com?subject=CreatorHub%20Support">
                  <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 transition-all">
                    Email Support
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </a>
                <Link href="/signup">
                  <Button variant="outline" className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">
                    Start Free Trial
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
