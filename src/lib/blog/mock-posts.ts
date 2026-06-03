export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  content: string
  category: 'credit-life' | 'advisory' | 'debt' | 'news'
  categoryLabel: string
  author: string
  authorTitle: string
  readTime: number
  publishedAt: string
  featured: boolean
  coverImage?: string
}

export const mockPosts: BlogPost[] = [
  {
    slug: 'understanding-credit-life-insurance-south-africa',
    title: 'Understanding Credit Life Insurance in South Africa',
    coverImage: '/images/blog/understanding-credit-life-insurance.jpg',
    excerpt:
      'Most South Africans with loans are paying for credit life insurance without fully understanding what it covers — or how much it costs. Here is everything you need to know.',
    content: `Credit life insurance is one of the most widely held — and least understood — financial products in South Africa. If you have a vehicle loan, home loan, or personal loan, there is a very good chance you are paying for credit life insurance right now. The question is: do you know what you are paying, what it covers, and whether you are getting a fair deal?

Credit life insurance is designed to settle your outstanding loan balance if you die, become permanently disabled, or are retrenched. In theory, it is a sensible product — it protects your family from inheriting your debt and protects your credit record during difficult times. In practice, however, the way banks bundle and price this cover has left millions of South Africans overpaying for protection they barely understand.

When you take out a loan from a South African bank, credit life insurance is typically added to your monthly repayment automatically. The cost is calculated as a percentage of your outstanding balance, but this percentage is rarely disclosed clearly. The result is that many consumers simply accept the cost as part of their repayment without ever questioning whether they could get better cover elsewhere.

The good news is that South African law — specifically the National Credit Act and FSCA regulations — gives you the right to arrange your own credit life insurance through a provider of your choice, as long as the cover meets minimum requirements. This is where providers like InsurIQ come in. By offering standalone credit life insurance at transparent, competitive rates, we give you the power to choose — and to save significantly in the process.

When comparing credit life insurance options, look for the following: clear premium disclosure, cover that decreases as your debt decreases, retrenchment cover as standard, and an FSCA-licensed provider. If a product ticks all these boxes and costs less than what your bank is charging, making the switch is a straightforward decision.`,
    category: 'credit-life',
    categoryLabel: 'Credit Life',
    author: 'InsurIQ Editorial',
    authorTitle: 'Financial Education',
    readTime: 6,
    publishedAt: '2026-05-01',
    featured: true,
  },
  {
    slug: 'how-much-does-credit-life-insurance-cost',
    title: 'How Much Does Credit Life Insurance Actually Cost?',
    coverImage: '/images/blog/how-much-does-credit-life-insurance-actually-cost.jpg',
    excerpt:
      'The true cost of credit life insurance is rarely clear. We break down exactly what you should expect to pay — and how to know if you are overpaying.',
    content: `The pricing of credit life insurance in South Africa is, to put it plainly, opaque. Most consumers have no idea how their premium is calculated, what percentage of their repayment goes to insurance, or how their rate compares to the market. This opacity is by design — and it costs South Africans billions of rands every year.

Credit life insurance is typically priced as a monthly premium per thousand rand of outstanding loan balance. The FSCA has set regulatory caps on these rates, but many banks charge close to the maximum while offering minimum disclosure. For example, the regulatory cap for credit life on personal loans is R4.50 per R1,000 of outstanding balance per month. On a R100,000 personal loan, that is R450 per month — or R5,400 per year — just for the insurance component.

InsurIQ and other independent providers typically charge significantly less than the regulatory maximum. The average saving for clients who switch from bundled bank cover to a standalone policy is between 30% and 40%. On the R100,000 personal loan example above, that could mean a saving of R135 to R180 per month, or R1,620 to R2,160 per year.

To work out whether you are overpaying, you need three numbers: your current outstanding loan balance, the monthly premium you are paying for credit life insurance (check your loan statement — it is often listed separately), and the rate per R1,000 that premium represents. If that rate is above R3.00 per R1,000, you should get a comparative quote. If it is above R4.00 per R1,000, you are almost certainly overpaying.`,
    category: 'credit-life',
    categoryLabel: 'Credit Life',
    author: 'InsurIQ Editorial',
    authorTitle: 'Financial Education',
    readTime: 5,
    publishedAt: '2026-05-05',
    featured: false,
  },
  {
    slug: 'fais-compliance-what-it-means-for-you',
    title: 'FAIS Compliance: What It Means for You as a Client',
    coverImage: '/images/blog/FAIS_Compliance.png',
    excerpt:
      'When an FSP says they are FAIS compliant, what does that actually mean? We explain your rights under the Financial Advisory and Intermediary Services Act.',
    content: `The Financial Advisory and Intermediary Services Act — known simply as FAIS — is the primary piece of legislation that governs how financial advisors and intermediaries in South Africa must treat their clients. If you have ever worked with an insurance broker, financial planner, or investment advisor, FAIS is the law that is supposed to protect you. But most South Africans have never heard of it.

FAIS was introduced in 2002 to bring accountability to the financial services sector. Before FAIS, anyone could call themselves a financial advisor and sell financial products with little oversight. FAIS changed that by requiring all financial services providers to be licensed by the FSCA, to disclose their fees and conflicts of interest, to act in the best interest of their clients, and to maintain professional indemnity insurance.

For you as a client, FAIS compliance means several important things. First, your advisor is legally required to conduct a needs analysis before recommending any product. They cannot simply push the product with the highest commission. Second, they must provide you with a full written disclosure — called a Record of Advice — documenting what was discussed, what was recommended, and why. Third, if you are unhappy with advice you received, you have a formal complaints process available through both the FSP and the FAIS Ombud.

When you choose an FSCA-licensed FSP like InsurIQ, you are choosing a provider that is legally accountable to you — not just commercially accountable. That distinction matters in financial services, where the interests of the provider and the client can easily diverge.`,
    category: 'advisory',
    categoryLabel: 'Advisory',
    author: 'InsurIQ Editorial',
    authorTitle: 'Financial Education',
    readTime: 4,
    publishedAt: '2026-05-08',
    featured: false,
  },
  {
    slug: 'debt-review-vs-debt-consolidation',
    title: 'Debt Review vs Debt Consolidation: Which Is Right for You?',
    coverImage: '/images/blog/Debt_Review_vs_Debt_Consolidation.png',
    excerpt:
      'If you are struggling with debt repayments, you have options. Here is an honest comparison of debt review and debt consolidation — and how to choose.',
    content: `If your monthly debt repayments are becoming unmanageable, you are not alone. South Africa has one of the highest household debt-to-income ratios in the developing world, and millions of South Africans are caught in a cycle of minimum payments and compounding interest. The good news is that there are formal, legal pathways to relief. The two most common are debt review and debt consolidation — and they work very differently.

Debt review, also called debt counselling, is a formal legal process regulated by the National Credit Act. A registered debt counsellor reviews your income and all your outstanding debts, then applies to a court to have your repayments restructured into a single, affordable monthly payment. During this process, you are legally protected from credit providers taking legal action against you. Debt review stays on your credit record until all debts are settled, at which point a clearance certificate is issued and your record is restored.

Debt consolidation is not a regulated process in the same way. It involves taking out a new loan — typically at a lower interest rate — to pay off multiple existing debts. The result is one monthly payment instead of many. If done correctly, it can reduce your total interest cost and simplify your finances. However, it requires credit approval, and consolidation loans can themselves become a trap if the underlying spending behaviour does not change.

The key difference: debt review provides legal protection and is designed for consumers who genuinely cannot meet their existing obligations. Debt consolidation is better suited to consumers who are managing their debt but want to simplify and reduce their interest burden. If you are receiving letters from attorneys or have missed multiple repayments, debt review is likely the appropriate option. If you are simply paying too much interest across multiple accounts, consolidation may be more suitable.`,
    category: 'debt',
    categoryLabel: 'Debt',
    author: 'InsurIQ Editorial',
    authorTitle: 'Financial Education',
    readTime: 7,
    publishedAt: '2026-05-12',
    featured: false,
  },
  {
    slug: 'what-happens-to-your-debt-when-you-die',
    title: 'What Happens to Your Debt When You Die?',
    coverImage: '/images/blog/what-happens-to-your-debt-when-you-die.jpg',
    excerpt:
      'Many South Africans do not realise their debt does not simply disappear when they pass. Here is what your family needs to know — and how to protect them.',
    content: `It is a conversation most of us avoid — but the financial consequences of dying with outstanding debt can be severe for the people we leave behind. The common misconception is that debt dies with the debtor. In most cases, it does not.

When a South African dies, their estate is wound up by an executor appointed by the Master of the High Court. All outstanding debts are settled from the assets of the estate before any inheritance is distributed to beneficiaries. This means that if you have a R1,000,000 home loan and your estate assets are only worth R800,000, your beneficiaries receive nothing — and in some cases may actually inherit a deficit.

The situation is particularly complex for joint loans and co-signed debt. If your vehicle loan or bond is in joint names, your co-applicant — often a spouse — becomes solely responsible for the full outstanding balance. This can be devastating if they are not financially prepared to carry the repayment alone.

This is exactly the risk that credit life insurance is designed to address. A well-structured credit life policy settles your outstanding loan balance in the event of your death, preventing the debt from becoming a burden on your estate or your family. The pay-out goes directly to the creditor, your loan is settled, and any remaining assets in your estate can be distributed to your beneficiaries as intended. For most South Africans with active loans, this is not a luxury — it is an essential financial safety net.`,
    category: 'credit-life',
    categoryLabel: 'Credit Life',
    author: 'InsurIQ Editorial',
    authorTitle: 'Financial Education',
    readTime: 5,
    publishedAt: '2026-05-15',
    featured: false,
  },
  {
    slug: 'retrenchment-cover-south-africa-guide',
    title: 'Retrenchment Cover in South Africa: A Complete Guide',
    coverImage: '/images/blog/what-happens-to-your-debt-when-you-die.jpg',
    excerpt:
      'Retrenchment is one of the most common credit life insurance claims. Here is what you need to know about cover, qualifying criteria, and how to claim.',
    content: `Retrenchment — being dismissed due to operational requirements rather than personal performance — is one of the most financially disruptive events a South African household can face. It is also, statistically, one of the most common triggers for credit life insurance claims. Yet many policyholders do not fully understand what their cover includes, when it applies, or how to claim when the time comes.

Credit life insurance retrenchment cover typically works by paying your monthly loan repayment for a defined period — usually 12 to 24 months — following confirmed retrenchment. Some policies pay out a lump sum equivalent to a set number of months of repayments; others pay monthly while you remain unemployed, up to a maximum term. The exact structure matters significantly when comparing policies.

To qualify for a retrenchment claim, most insurers require that the retrenchment be involuntary and in terms of Section 189 or 189A of the Labour Relations Act. This means voluntary resignation, early retirement, and dismissal for misconduct do not qualify. You will typically be required to provide a retrenchment letter from your employer, your final payslip, and proof that you were registered with the Unemployment Insurance Fund (UIF).

There is usually a waiting period of 3 to 6 months from policy inception before retrenchment cover becomes active. This prevents consumers from taking out cover after retrenchment has already been announced. If you are aware of pending retrenchments at your employer and you do not yet have credit life cover, you should act immediately — before any formal announcements are made.

InsurIQ's credit life policies include retrenchment cover as standard, with clear qualifying criteria disclosed upfront. We believe you should know exactly what you are covered for before you pay a single rand — not when you are trying to submit a claim.`,
    category: 'credit-life',
    categoryLabel: 'Credit Life',
    author: 'InsurIQ Editorial',
    authorTitle: 'Financial Education',
    readTime: 6,
    publishedAt: '2026-05-19',
    featured: false,
  },
]

export function getPostBySlug(slug: string): BlogPost | undefined {
  return mockPosts.find((p) => p.slug === slug)
}

export function getPostsByCategory(category?: string): BlogPost[] {
  if (!category || category === 'all') return mockPosts
  return mockPosts.filter((p) => p.category === category)
}

export function getRelatedPosts(currentSlug: string, category: string, limit = 2): BlogPost[] {
  const same = mockPosts.filter((p) => p.slug !== currentSlug && p.category === category)
  if (same.length >= limit) return same.slice(0, limit)
  const others = mockPosts.filter((p) => p.slug !== currentSlug && p.category !== category)
  return [...same, ...others].slice(0, limit)
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-ZA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
