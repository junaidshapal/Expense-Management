# 💰 Hostel Hisab

A simple, clean mobile-first expense sharing app for two hostel friends. Track daily food, drinks, grocery, hostel, and other shared expenses — then calculate who owes whom at any time.

## Features

- **Login / Signup** — Supabase Auth (email + password). One shared account for both roommates.
- **Dashboard** — live summary of total expenses, each person's contribution, and settlement status
- **Add / Edit / Delete Expenses** — with categories, date, paid-by, and optional notes
- **Expense History** — filterable by date range, category, and person
- **Settlement Calculator** — pick any date range and instantly see who owes whom
- **Last 15 Days Hisab** — one-tap quick calculation
- **Settings** — edit names, export/import JSON, reset all data
- **Supabase (Postgres)** — data is stored in the cloud and synced between both roommates in real time on refresh

## How the Calculation Works

```
total          = sum of all expenses in selected date range
sharePerPerson = total / 2

personABalance = personAPaid - sharePerPerson
personBBalance = personBPaid - sharePerPerson

→ negative balance = that person owes the other
```

**Example:**
- Total expenses: Rs. 10,000
- Jamil paid: Rs. 8,000 | Friend paid: Rs. 2,000
- Each share: Rs. 5,000
- Result: **Friend owes Jamil Rs. 3,000**

## Tech Stack

| Tool | Purpose |
|---|---|
| Next.js 15 (App Router) | Framework |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| Radix UI | Accessible primitives |
| Lucide React | Icons |
| Supabase (Postgres + Auth) | Data persistence + authentication |

## Getting Started

### 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) → New project (free tier is enough).
2. In the SQL Editor, run the contents of [`supabase/schema.sql`](supabase/schema.sql) — this creates the `expenses` and `settings` tables with row-level security enabled.
3. In **Project Settings → API**, copy the **Project URL** and **anon public key**.
4. By default Supabase requires email confirmation on signup. For a quick personal setup you can turn this off in **Authentication → Providers → Email → Confirm email**, or just confirm the one email you'll sign up with.

### 2. Configure environment variables

Copy `.env.local.example` to `.env.local` and fill in your Supabase values:

```bash
cp .env.local.example .env.local
```

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Install and run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), go to **Sign Up**, create one account, then share that same email + password with your roommate so you both log into the same shared expense data.

### 4. Deploy to Vercel

1. Push this repo to GitHub.
2. Import it into [Vercel](https://vercel.com/new).
3. Add the same two environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) in the Vercel project settings.
4. Deploy. Both of you can now log in from anywhere with the shared account.

## Project Structure

```
app/
├── layout.tsx          # Root layout
├── page.tsx            # Main single-page app (protected by middleware)
├── login/page.tsx      # Login page
├── signup/page.tsx     # Signup page
└── globals.css         # Global styles + green/white theme

components/
├── Navbar.tsx          # Top header (+ logout) + bottom tab navigation
├── SummaryCards.tsx    # Dashboard summary cards
├── ExpenseForm.tsx     # Add / edit expense form
├── ExpenseList.tsx     # Filterable expense history
├── Filters.tsx         # Date, category, person filters
├── SettlementCalculator.tsx  # Hisab calculator
├── SettingsPanel.tsx   # Names, export, import, reset
└── ui/                 # Base UI components (Button, Card, etc.)

lib/
├── types.ts            # TypeScript types
├── storage.ts          # Supabase-backed read/write utilities
├── calculations.ts     # Settlement math + filtering
├── utils.ts            # formatCurrency, formatDate, formatDateWithWeekday, helpers
└── supabase/
    ├── client.ts        # Browser Supabase client
    ├── server.ts         # Server Supabase client (Server Components/Actions)
    └── middleware.ts      # Session refresh + route protection

middleware.ts          # Wires lib/supabase/middleware.ts into Next.js
supabase/schema.sql    # Postgres schema + RLS policies to run in Supabase
```

## Sample Data

Go to **Settings → Sample Import JSON**, copy the JSON, save as a `.json` file, then tap **Import from JSON** to load test expenses instantly.

## Default Users

| Person | Default Name |
|---|---|
| Person A | Jamil |
| Person B | Friend |

Names can be changed anytime in Settings.
