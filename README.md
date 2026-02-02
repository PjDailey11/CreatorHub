# CreatorHub - OnlyFans Creator SaaS

A comprehensive SaaS platform designed specifically for OnlyFans creators to manage subscribers, automate DM funnels, optimize PPV pricing, and track content analytics.

## Features

### Core Functionality

- **Subscriber Management** - Track and manage all subscribers in one dashboard
  - Subscriber tiers (Standard, Premium, VIP)
  - Engagement tracking
  - Spending history
  - Status management (Active, Paused, Churned)

- **DM Funnels** - Automated messaging sequences
  - Visual funnel builder
  - Multiple trigger types (DM received, Bio link click, New follower)
  - Message steps with personalization
  - Delay steps for timing
  - Conditional logic for targeting

- **PPV Price Optimizer** - AI-powered pricing recommendations
  - Per-subscriber recommendations based on:
    - Subscriber tier
    - Engagement level
    - Spending history
  - Confidence scores
  - Custom price overrides

- **Analytics Dashboard** - Track your growth
  - Revenue tracking (Total & Monthly)
  - Subscriber metrics
  - Source attribution (Instagram, TikTok, Twitter, etc.)
  - Acquisition trends
  - Average LTV calculations

### User Features

- **Authentication** - Secure login with:
  - Magic link email authentication
  - Google OAuth
  
- **Settings** - Account management
  - Profile settings
  - Subscription plan management
  - Notification preferences
  - Security options

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Payments**: Stripe
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js 18+
- npm/yarn/pnpm
- Supabase account
- Stripe account (for payments)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-repo/creatorhub.git
cd creatorhub
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Fill in your environment variables:
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_STARTER_PRICE_ID=price_xxx
STRIPE_PRO_PRICE_ID=price_xxx
STRIPE_AGENCY_PRICE_ID=price_xxx
```

4. Set up Supabase database:

Run the following SQL in your Supabase SQL editor:

```sql
-- Profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  onlyfans_username TEXT,
  subscription_tier TEXT DEFAULT 'free',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subscribers table
CREATE TABLE subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  subscriber_name TEXT,
  subscriber_tier TEXT DEFAULT 'standard',
  subscription_price DECIMAL(10, 2),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_engaged_at TIMESTAMP WITH TIME ZONE,
  total_spent DECIMAL(10, 2) DEFAULT 0,
  status TEXT DEFAULT 'active'
);

-- Funnels table
CREATE TABLE funnels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  trigger_type TEXT,
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Funnel steps table
CREATE TABLE funnel_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  funnel_id UUID REFERENCES funnels(id) ON DELETE CASCADE,
  step_order INTEGER NOT NULL,
  step_type TEXT,
  content JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE funnels ENABLE ROW LEVEL SECURITY;
ALTER TABLE funnel_steps ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own subscribers" ON subscribers FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own subscribers" ON subscribers FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own subscribers" ON subscribers FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own subscribers" ON subscribers FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own funnels" ON funnels FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own funnels" ON funnels FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own funnels" ON funnels FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own funnels" ON funnels FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own funnel steps" ON funnel_steps FOR SELECT 
  USING (funnel_id IN (SELECT id FROM funnels WHERE user_id = auth.uid()));
CREATE POLICY "Users can insert own funnel steps" ON funnel_steps FOR INSERT 
  WITH CHECK (funnel_id IN (SELECT id FROM funnels WHERE user_id = auth.uid()));
CREATE POLICY "Users can update own funnel steps" ON funnel_steps FOR UPDATE 
  USING (funnel_id IN (SELECT id FROM funnels WHERE user_id = auth.uid()));
CREATE POLICY "Users can delete own funnel steps" ON funnel_steps FOR DELETE 
  USING (funnel_id IN (SELECT id FROM funnels WHERE user_id = auth.uid()));
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the result.

## Project Structure

```
src/
├── app/
│   ├── (auth)/          # Auth pages (login, signup)
│   ├── (dashboard)/     # Protected dashboard pages
│   │   ├── analytics/   # Analytics page
│   │   ├── dashboard/   # Main dashboard
│   │   ├── funnels/     # DM funnels (list, new, edit)
│   │   ├── ppv/         # PPV pricing page
│   │   ├── settings/    # User settings
│   │   └── subscribers/ # Subscriber management
│   ├── (marketing)/     # Marketing pages
│   │   └── pricing/     # Pricing page
│   └── api/             # API routes
├── components/
│   ├── dashboard/       # Dashboard components
│   ├── funnels/         # Funnel builder components
│   ├── marketing/       # Marketing page components
│   └── ui/              # shadcn/ui components
├── hooks/               # Custom React hooks
├── lib/                 # Utilities and configs
│   └── supabase/        # Supabase client setup
└── types/               # TypeScript types
```

## Pricing Plans

| Feature | Starter ($49/mo) | Pro ($149/mo) | Agency ($499/mo) |
|---------|-----------------|---------------|------------------|
| Subscribers | Up to 500 | Up to 5,000 | Unlimited |
| DM Funnels | 3 active | Unlimited | Unlimited |
| Analytics | Basic | Advanced | White-label |
| PPV Recommendations | ✓ | ✓ | ✓ |
| AI Optimization | - | ✓ | ✓ |
| Multi-Account | - | - | ✓ |
| API Access | - | - | ✓ |
| Support | Email | Priority | Dedicated Manager |

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting a PR.

## License

This project is proprietary software. All rights reserved.

---

Built with ❤️ for content creators
