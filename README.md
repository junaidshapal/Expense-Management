# 💰 Hostel Hisab

A simple, clean mobile-first expense sharing app for two hostel friends. Track daily food, drinks, grocery, hostel, and other shared expenses — then calculate who owes whom at any time.

## Features

- **Dashboard** — live summary of total expenses, each person's contribution, and settlement status
- **Add / Edit / Delete Expenses** — with categories, date, paid-by, and optional notes
- **Expense History** — filterable by date range, category, and person
- **Settlement Calculator** — pick any date range and instantly see who owes whom
- **Last 15 Days Hisab** — one-tap quick calculation
- **Settings** — edit names, export/import JSON, reset all data
- **localStorage** — all data saved in the browser, no backend needed

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
| localStorage | Data persistence |

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
app/
├── layout.tsx          # Root layout
├── page.tsx            # Main single-page app
└── globals.css         # Global styles + green/white theme

components/
├── Navbar.tsx          # Top header + bottom tab navigation
├── SummaryCards.tsx    # Dashboard summary cards
├── ExpenseForm.tsx     # Add / edit expense form
├── ExpenseList.tsx     # Filterable expense history
├── Filters.tsx         # Date, category, person filters
├── SettlementCalculator.tsx  # Hisab calculator
├── SettingsPanel.tsx   # Names, export, import, reset
└── ui/                 # Base UI components (Button, Card, etc.)

lib/
├── types.ts            # TypeScript types
├── storage.ts          # localStorage read/write utilities
├── calculations.ts     # Settlement math + filtering
└── utils.ts            # formatCurrency, formatDate, helpers
```

## Sample Data

Go to **Settings → Sample Import JSON**, copy the JSON, save as a `.json` file, then tap **Import from JSON** to load test expenses instantly.

## Default Users

| Person | Default Name |
|---|---|
| Person A | Jamil |
| Person B | Friend |

Names can be changed anytime in Settings.
