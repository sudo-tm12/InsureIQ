import type { Metadata } from 'next'
import { LegalLayout } from '@/components/layout/LegalLayout'
import { REGULATORY } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Complaints Procedure',
  description:
    'How to submit a complaint to InsurIQ. Response within 2 business days. Escalation to FSCA and FAIS Ombud if required.',
}

export default function ComplaintsPage() {
  return (
    <LegalLayout eyebrow="REGULATORY" title="Complaints Procedure" lastUpdated="May 2026">
      <p>
        {REGULATORY.registeredName} is committed to treating every client fairly. If you are
        dissatisfied with any aspect of our service, we want to know — and we will work to resolve
        your complaint promptly and fairly.
      </p>

      <h2>1. How to Submit a Complaint</h2>
      <p>
        You may submit a complaint to us by email at{' '}
        <a href={`mailto:${REGULATORY.complaintsEmail}`}>{REGULATORY.complaintsEmail}</a>. Please
        include the following information to help us resolve your complaint as quickly as possible:
      </p>
      <ul>
        <li>Your full name and contact details.</li>
        <li>Your policy or reference number (if applicable).</li>
        <li>A clear description of your complaint and the circumstances that gave rise to it.</li>
        <li>Any relevant documents or correspondence.</li>
        <li>The outcome or resolution you are seeking.</li>
      </ul>
      <p>
        You may also submit a complaint in writing to our registered office at{' '}
        {REGULATORY.registeredOffice}, marked for the attention of the Complaints Officer.
      </p>

      <h2>2. Our Response Timeframes</h2>
      <p>Once we receive your complaint, we will:</p>
      <ul>
        <li>
          <strong>Acknowledge receipt</strong> within 2 business days.
        </li>
        <li>
          <strong>Resolve and respond</strong> in full within 10 business days of receiving all
          relevant information.
        </li>
        <li>
          <strong>Complex complaints:</strong> Where a complaint requires more extensive
          investigation, we will notify you within 10 business days and provide a revised timeline.
          Complex complaints will be resolved within 45 calendar days in all but exceptional
          circumstances.
        </li>
      </ul>

      <h2>3. If You Are Not Satisfied With Our Response</h2>
      <p>
        If you are not satisfied with our final response, or if we have not resolved your complaint
        within the timeframes above, you have the right to escalate your complaint to the following
        external bodies at no cost to you:
      </p>

      <p>
        <strong>FAIS Ombud (Ombud for Financial Services Providers)</strong>
        <br />
        The FAIS Ombud resolves disputes between clients and authorised financial services
        providers.
      </p>
      <ul>
        <li>
          Website:{' '}
          <a href="https://www.faisombud.co.za" target="_blank" rel="noopener noreferrer">
            www.faisombud.co.za
          </a>
        </li>
        <li>Telephone: 012 762 5000</li>
        <li>
          Email: <a href="mailto:info@faisombud.co.za">info@faisombud.co.za</a>
        </li>
      </ul>

      <p>
        <strong>Financial Sector Conduct Authority (FSCA)</strong>
        <br />
        The FSCA supervises the conduct of financial institutions and may investigate complaints
        relating to regulatory non-compliance.
      </p>
      <ul>
        <li>
          Website:{' '}
          <a href="https://www.fsca.co.za" target="_blank" rel="noopener noreferrer">
            www.fsca.co.za
          </a>
        </li>
        <li>Telephone: 0800 20 37 22 (toll-free)</li>
        <li>
          Email: <a href="mailto:info@fsca.co.za">info@fsca.co.za</a>
        </li>
      </ul>

      <h2>4. Record-Keeping</h2>
      <p>
        We maintain a record of all complaints received, including the nature of the complaint, the
        steps taken to resolve it, and the outcome. These records are retained for a minimum of
        five years in accordance with FAIS requirements.
      </p>

      <h2>5. No Retaliation</h2>
      <p>
        Submitting a complaint will never negatively affect your policy, your relationship with
        InsurIQ, or any service you receive from us. We welcome complaints as an opportunity to
        improve.
      </p>
    </LegalLayout>
  )
}
