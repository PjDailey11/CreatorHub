import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy | CreatorHub',
  description: 'How CreatorHub collects, uses, and protects creator account information.',
}

const sections = [
  {
    title: 'Information we collect',
    body: 'We collect the information you provide when you create an account, contact support, import creator data, or use CreatorHub features. This can include your name, email address, billing details, subscriber records, and product usage data needed to operate the service.',
  },
  {
    title: 'How we use information',
    body: 'We use your information to provide the product, secure accounts, process billing, respond to support requests, improve the platform, and communicate important service updates. We do not sell your personal information.',
  },
  {
    title: 'Data sharing',
    body: 'We share data only with service providers that help us run CreatorHub, such as infrastructure, analytics, payment, and customer support tools. Those providers are expected to protect the data they process on our behalf.',
  },
  {
    title: 'Security and retention',
    body: 'We use reasonable administrative, technical, and organizational safeguards to protect account data. We retain information only as long as necessary to deliver the service, comply with legal obligations, resolve disputes, and enforce agreements.',
  },
  {
    title: 'Your choices',
    body: 'You can request account updates, data export guidance, or deletion assistance by contacting support. If you cancel your subscription, you may still retain limited access for the rest of the active billing period unless otherwise required by law or policy.',
  },
]

export default function PrivacyPage() {
  return (
    <section className="py-20 md:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="mb-10">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-pink-500 mb-4">
              Privacy Policy
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Privacy matters here.
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
              This page explains how CreatorHub handles information when creators use the
              platform. Last updated: May 12, 2026.
            </p>
          </div>

          <div className="space-y-6">
            {sections.map((section) => (
              <article
                key={section.title}
                className="rounded-3xl border border-gray-200/80 dark:border-gray-800 bg-white/90 dark:bg-gray-900/80 p-6 md:p-8 shadow-sm"
              >
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
                  {section.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {section.body}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-10 rounded-3xl border border-pink-200/60 dark:border-pink-900/40 bg-pink-50/70 dark:bg-pink-950/20 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Questions about privacy?
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Contact us at{' '}
              <a
                href="mailto:support@creatorhub.com"
                className="font-semibold text-pink-600 dark:text-pink-400 hover:underline"
              >
                support@creatorhub.com
              </a>{' '}
              or visit our{' '}
              <Link href="/contact" className="font-semibold text-pink-600 dark:text-pink-400 hover:underline">
                contact page
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
