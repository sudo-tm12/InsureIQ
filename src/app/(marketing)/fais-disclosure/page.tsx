import type { Metadata } from 'next'
import Link from 'next/link'
import { LegalLayout } from '@/components/layout/LegalLayout'
import { REGULATORY, CONTACT } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'FAIS Disclosure | InsurIQ',
  description:
    'InsurIQ FAIS Disclosure — FSP details, services authorised, conflict of interest policy, and complaints procedure as required by the Financial Advisory and Intermediary Services Act.',
}

export default function FaisDisclosurePage() {
  return (
    <LegalLayout eyebrow="REGULATORY" title="FAIS Disclosure" lastUpdated="May 2026">
      <p>
        In terms of the Financial Advisory and Intermediary Services Act, 37 of 2002
        (&quot;FAIS&quot;), {REGULATORY.registeredName} is required to provide you with the
        following disclosure before rendering any financial service.
      </p>

      <h2>1. FSP Details</h2>
      <ul>
        <li>
          <strong>Legal name:</strong> {REGULATORY.registeredName}
        </li>
        <li>
          <strong>Trading name:</strong> InsurIQ
        </li>
        {REGULATORY.fspNumber && (
          <li>
            <strong>FSP licence number:</strong> {REGULATORY.fspNumber}
          </li>
        )}
        <li>
          <strong>Registered office:</strong> {REGULATORY.registeredOffice}
        </li>
        <li>
          <strong>Contact email:</strong>{' '}
          <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
        </li>
        <li>
          <strong>Compliance officer:</strong>{' '}
          <a href={`mailto:${REGULATORY.complianceOfficerEmail}`}>
            {REGULATORY.complianceOfficerEmail}
          </a>
        </li>
      </ul>

      <h2>2. Services We Are Authorised to Render</h2>
      <p>
        InsurIQ is authorised by the FSCA to render financial advisory and intermediary services in
        the following categories:
      </p>
      <ul>
        <li>
          <strong>Category I:</strong> Advice and intermediary services in respect of long-term
          insurance (Category A, B, C), short-term insurance (personal and commercial lines), and
          retail pension benefits.
        </li>
        <li>
          <strong>Debt counselling services:</strong> Registered with the National Credit
          Regulator (NCR) for debt review and mediation services.
        </li>
      </ul>
      <p>
        We may only render services within the categories for which we are licensed. If you require
        services outside these categories, we will refer you to an appropriately licensed provider.
      </p>

      <h2>3. Products We Advise On</h2>
      <ul>
        <li>Credit life insurance products</li>
        <li>Risk insurance products (life, disability, dread disease)</li>
        <li>Short-term personal and commercial insurance products</li>
        <li>Debt review and mediation services</li>
      </ul>

      <h2>4. Conflict of Interest Policy</h2>
      <p>
        InsurIQ is committed to identifying, managing, and disclosing any conflicts of interest
        that may exist or arise in the course of rendering financial services to you.
      </p>
      <p>A conflict of interest may arise when:</p>
      <ul>
        <li>
          We hold a financial interest in a product provider (direct or indirect shareholding).
        </li>
        <li>A product provider provides us with financial or other incentives.</li>
        <li>
          A representative of InsurIQ holds a personal financial interest in a recommendation.
        </li>
      </ul>
      <p>
        Where a conflict of interest exists, it will be disclosed to you in writing before any
        advice is given or any transaction is concluded. Read our full{' '}
        <Link href="/conflict-of-interest">Conflict of Interest Policy</Link>, or request a copy
        from{' '}
        <a href={`mailto:${REGULATORY.complianceOfficerEmail}`}>
          {REGULATORY.complianceOfficerEmail}
        </a>
        .
      </p>

      <h2>5. Professional Indemnity and Fidelity Insurance</h2>
      <p>
        {REGULATORY.registeredName} holds professional indemnity insurance and fidelity guarantee
        insurance as required under the General Code of Conduct for Authorised Financial Services
        Providers. Details are available on request.
      </p>

      <h2>6. Complaints</h2>
      <p>
        If you are dissatisfied with any financial service or advice rendered by InsurIQ, you have
        the right to submit a formal complaint. Please refer to our{' '}
        <Link href="/complaints">Complaints Procedure</Link> for full details on how to submit a
        complaint and what to expect.
      </p>

      <h2>7. FSCA Contact Details</h2>
      <p>
        The Financial Sector Conduct Authority (FSCA) regulates the conduct of financial
        institutions in South Africa. If you have a regulatory query or wish to verify our licence,
        you may contact the FSCA directly:
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
    </LegalLayout>
  )
}
