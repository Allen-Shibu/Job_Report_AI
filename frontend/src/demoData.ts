import type { ReportData } from './types'

export const demoReport: ReportData = {
  company: 'Stripe',
  verdict: 'LEGIT',
  overallScore: 84,
  rawReport: '',

  scorecard: [
    {
      label: 'Applyability',
      score: 80,
      explanation: 'Stripe posts roles globally across engineering, design, and ops. Hiring bar is high but fair, with a well-documented interview process.',
    },
    {
      label: 'Salary',
      score: 88,
      explanation: 'Compensation is top-of-market. Engineers at L4–L6 report TC between $250k–$550k. Equity is meaningful and liquid post-IPO.',
    },
    {
      label: 'Employee Satisfaction',
      score: 78,
      explanation: 'Glassdoor rating sits at 4.1/5. Most employees cite strong mission alignment and smart colleagues. Some note high workload.',
    },
    {
      label: 'Benefits',
      score: 85,
      explanation: 'Comprehensive health, dental, vision. Generous parental leave (16 weeks), 401k match, remote stipend, and annual learning budget.',
    },
    {
      label: 'Work-Life Balance',
      score: 68,
      explanation: 'Fast-paced culture with high expectations. Teams are lean, which means more ownership — but also longer hours during product cycles.',
    },
    {
      label: 'Career Growth',
      score: 86,
      explanation: 'Excellent internal mobility. Many employees grow multiple levels over 3–4 years. Strong mentorship culture and clear promotion criteria.',
    },
  ],

  overview: `Stripe is a global financial infrastructure platform headquartered in San Francisco and Dublin, founded in 2010 by brothers Patrick and John Collison. The company provides payment processing APIs and a suite of financial tools used by businesses ranging from early-stage startups to Fortune 500 enterprises.

As of 2024, Stripe processes hundreds of billions of dollars in payments annually and operates in over 50 countries. Its product suite includes Stripe Payments, Billing, Connect, Treasury, Radar (fraud detection), and Atlas (company formation). The company employs approximately 8,000 people globally.`,

  applyability: `Stripe is actively hiring across all major functions: software engineering, infrastructure, data science, product, design, sales, and operations.

The hiring process typically consists of a recruiter screen, a technical or domain-specific interview, and a final loop with 4–5 interviewers. The process is thorough but moves at a reasonable pace (3–5 weeks average). The company prioritises analytical thinking, communication clarity, and evidence of impact over pedigree.

Remote roles are available for many positions, though some teams prefer or require in-person presence in SF, NYC, Dublin, or Singapore.`,

  salary: `Stripe's compensation is consistently rated among the best in the industry. Based on aggregated self-reported data from Levels.fyi and Glassdoor:

- **Software Engineer (L3):** $180k–$220k base + equity
- **Senior Software Engineer (L4):** $240k–$310k base + equity  
- **Staff Engineer (L5):** $310k–$420k base + equity
- **Principal Engineer (L6):** $420k–$550k+ base + equity

Equity refreshes are standard. Benefits include a $1,000/month remote work stipend, fully paid health insurance, and a $2,500 annual learning budget.`,

  employeeSatisfaction: `Employee sentiment is broadly positive, with satisfaction driven by:

- **Mission:** Employees consistently cite belief in Stripe's mission — "increasing the GDP of the internet" — as a core motivator.
- **Colleagues:** The quality of peers is frequently highlighted. Stripe is known for a high signal-to-noise ratio in its workforce.
- **Concerns:** The most common criticism involves pace and workload. Some employees note that the culture can feel demanding, particularly during major product launches or infrastructure migrations.

Attrition has increased post-2022 due to broader tech market corrections, but voluntary departure rates remain below industry averages.`,

  culture: `Stripe's culture is defined by a strong emphasis on written communication — long-form memos over slides, asynchronous decision-making, and rigorous documentation. This creates an environment where ideas are evaluated on merit rather than presentation style.

Career growth is well-structured. The engineering ladder is publicly documented. Promotion cycles occur twice yearly, and internal transfers are actively encouraged after 12–18 months in a role.

The company invests heavily in onboarding — new hires go through a structured 90-day program and are assigned a dedicated onboarding buddy.`,

  legitimacy: `Stripe, Inc. is a Delaware C-corporation, incorporated in 2010. The company is:

- **Registered** with the SEC as a private company (pre-IPO as of 2024)
- **Regulated** as a payment facilitator under PCI DSS Level 1 compliance
- **Licensed** as a money transmitter in all required US states and as an e-money institution in the EU (via Stripe Payments Europe Ltd, regulated by the Central Bank of Ireland)
- **Audited** annually by Deloitte

There are no material regulatory sanctions, fraud allegations, or pending class-action lawsuits of note against the company.`,

  reputation: `Stripe is widely regarded as one of the most developer-friendly payment platforms in the world. Key reputation signals:

- **Trustpilot:** 4.4/5 based on ~4,000 reviews from merchants
- **G2:** 4.4/5 — users praise documentation quality and API reliability
- **Glassdoor:** 4.1/5 — employees rate leadership and mission highly
- **Reddit / HN:** Developer sentiment is overwhelmingly positive; Stripe's API documentation is frequently cited as an industry benchmark

Notable criticisms include occasional account holds (particularly for new merchants in high-risk categories) and US-only availability of some newer products like Stripe Capital.`,

  financials: `Stripe's financial profile reflects a mature, high-growth private company:

- **Last valuation:** $65 billion (March 2023 tender offer, down from $95B peak in 2021)
- **Revenue:** Estimated $15B+ annualised in 2023, growing ~20% YoY
- **Profitability:** The company stated it reached profitability on a cash-flow basis in 2023
- **Investors:** Sequoia Capital, Andreessen Horowitz, General Catalyst, Thrive Capital, and the Irish sovereign wealth fund (ISIF)
- **IPO status:** Stripe has indicated intent to go public but has not set a firm timeline as of mid-2024

The balance sheet is strong, with $6.5B raised across all funding rounds and no reported debt covenants.`,

  redFlags: [],
}
