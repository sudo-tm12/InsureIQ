import type { Metadata } from 'next'
import Link from 'next/link'
import { LegalLayout } from '@/components/layout/LegalLayout'
import { REGULATORY } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Conflict of Interest Policy',
  description:
    'How InsurIQ identifies, avoids, mitigates and discloses conflicts of interest, as required by section 3A of the FAIS General Code of Conduct.',
  alternates: { canonical: '/conflict-of-interest' },
}

export default function ConflictOfInterestPage() {
  return (
    <LegalLayout eyebrow="REGULATORY" title="Conflict of Interest Policy" lastUpdated="October 2026">
      <p>
        This policy sets out how {REGULATORY.registeredName} (&quot;InsurIQ&quot;) identifies,
        avoids, mitigates and discloses conflicts of interest, as required by section 3A of the
        General Code of Conduct for Authorised Financial Services Providers and Representatives
        under the Financial Advisory and Intermediary Services Act, 37 of 2002 (&quot;FAIS&quot;).
        It applies to InsurIQ, its key individuals, representatives and employees.
      </p>

      <h2>1. What Is a Conflict of Interest?</h2>
      <p>
        A conflict of interest is any situation in which InsurIQ or one of our representatives has
        an actual or potential interest that may influence the objective performance of our
        obligations to you, or prevent us from rendering an unbiased and fair financial service or
        from acting in your best interests. This includes, but is not limited to:
      </p>
      <ul>
        <li>a financial interest;</li>
        <li>an ownership interest; and</li>
        <li>any relationship with a third party, such as a product supplier.</li>
      </ul>

      <h2>2. Financial Interests We May Receive</h2>
      <p>
        InsurIQ and its representatives may only receive or offer the following financial
        interests:
      </p>
      <ul>
        <li>
          commission authorised under the Long-term Insurance Act, the Short-term Insurance Act or
          the Insurance Act, at the rates those Acts permit;
        </li>
        <li>
          fees specifically agreed with you in writing, which you may stop paying at your
          discretion;
        </li>
        <li>
          fees or remuneration for a service rendered to a third party, where that amount is
          reasonably commensurate with the service; and
        </li>
        <li>
          an immaterial financial interest, being a gift or benefit worth no more than R1,000 in
          aggregate from the same third party in a calendar year.
        </li>
      </ul>
      <p>
        We will never accept a financial interest that is offered on condition that we favour a
        particular product supplier, or that is linked to the quantity of business placed with a
        supplier beyond what the law allows.
      </p>

      <h2>3. How We Identify Conflicts</h2>
      <p>We regularly review our business for situations that could give rise to a conflict, including:</p>
      <ul>
        <li>remuneration structures that could reward selling one product over another;</li>
        <li>ownership interests between InsurIQ and any product supplier;</li>
        <li>gifts, hospitality or incentives offered by product suppliers;</li>
        <li>personal interests of representatives in a recommendation; and</li>
        <li>outside business interests of key individuals and representatives.</li>
      </ul>

      <h2>4. How We Avoid and Mitigate Conflicts</h2>
      <ul>
        <li>
          Advice is based on your needs and circumstances. Our quote calculator shows what you pay
          now against what InsurIQ would cost, and never presents a product that leaves you worse
          off.
        </li>
        <li>
          Representatives may not be remunerated in a way that rewards recommending one product
          supplier over another.
        </li>
        <li>
          Gifts and hospitality from third parties are recorded in a gift register and must stay
          within the immaterial financial interest limit.
        </li>
        <li>
          Representatives and employees must declare outside business and ownership interests,
          which the compliance officer reviews.
        </li>
        <li>
          Where a conflict cannot be avoided, we will decline to act rather than act against your
          interests.
        </li>
      </ul>

      <h2>5. Disclosure to You</h2>
      <p>
        Where an actual or potential conflict of interest exists, we will disclose it to you in
        writing, in clear and plain language, before we give advice or conclude any transaction.
        The disclosure will include the nature of the conflict, any financial interest we may
        receive and the measures we have taken to manage it, so that you can make an informed
        decision.
      </p>
      <p>
        We will also disclose any ownership interest or relationship we hold with a product
        supplier, and any product supplier in which InsurIQ or its associates hold an ownership
        interest, before rendering a financial service in respect of that supplier&apos;s
        products.
      </p>

      <h2>6. Training, Monitoring and Consequences</h2>
      <p>
        All representatives and employees are trained on this policy when they join and at least
        annually. The compliance officer monitors adherence, maintains the gift and interest
        registers, and reports on conflicts of interest. A breach of this policy is treated as a
        disciplinary matter and may lead to the termination of employment or a mandate.
      </p>

      <h2>7. Review of This Policy</h2>
      <p>
        This policy is reviewed at least once a year, and whenever our business or the applicable
        regulations change.
      </p>

      <h2>8. Contact</h2>
      <p>
        Questions about this policy, or requests for further information about any conflict of
        interest, can be sent to our compliance officer at{' '}
        <a href={`mailto:${REGULATORY.complianceOfficerEmail}`}>
          {REGULATORY.complianceOfficerEmail}
        </a>
        . If you are unhappy with how we have handled a conflict of interest, please follow our{' '}
        <Link href="/complaints">Complaints Procedure</Link>.
      </p>
    </LegalLayout>
  )
}
