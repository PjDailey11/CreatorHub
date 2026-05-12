import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms of Service | CreatorHub',
  description: 'The core terms that govern access to and use of CreatorHub.',
}

const sections = [
  {
    title: 'Using CreatorHub',
    body: 'By using CreatorHub, you agree to use the service lawfully and only for legitimate business operations tied to your creator or agency workflow. You are responsible for the accuracy of the account information and connected data you provide.',
  },
  {
    title: 'Accounts and security',
    body: 'You are responsible for maintaining the confidentiality of your login credentials and for activity that occurs under your account. Notify us promptly if you believe your account has been accessed without authorization.',
  },
  {
    title: 'Billing and subscriptions',
    body: 'Paid plans renew automatically unless cancelled before the next billing cycle. Trial availability, pricing, and plan features may change over time, but any active subscription changes will be communicated before they take effect.',
  },
  {
    title: 'Acceptable use',
    body: 'You may not use CreatorHub to violate laws, infringe intellectual property rights, attempt unauthorized access, or interfere with the platform. We may suspend or terminate access if the service is used in a harmful, fraudulent, or abusive manner.',
  },
  {
    title: 'Service changes',
    body: 'We may update, improve, or discontinue product features as the platform evolves. We aim to provide reasonable notice for material changes that affect subscribed customers.',
  },
  {
    title: 'Liability and contact',
    body: 'CreatorHub is provided on an as-available basis to the extent allowed by law. If you have questions about these terms, contact support before continuing to use the service.',
  },
]

export default function TermsPage() {
  return (
    <section className="py-20 md:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="mb-10">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-pink-500 mb-4">
              Terms of Service
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Clear terms for using CreatorHub.
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
              These terms outline the basic rules for accessing and using CreatorHub.
              Last updated: May 12, 2026.
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
              Need clarification?
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Reach out at{' '}
              <a
                href="mailto:support@creatorhub.com"
                className="font-semibold text-pink-600 dark:text-pink-400 hover:underline"
              >
                support@creatorhub.com
              </a>{' '}
              or use the{' '}
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
