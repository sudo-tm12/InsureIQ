import type { Metadata } from 'next'
import { LegalLayout } from '@/components/layout/LegalLayout'
import { REGULATORY, CONTACT } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'InsurIQ Privacy Policy. How we collect, use, and protect your personal information in compliance with POPIA.',
}

export default function PrivacyPolicyPage() {
  return (
    <LegalLayout eyebrow="LEGAL" title="Privacy Policy" lastUpdated="May 2026">
      <h2>1. Introduction</h2>
      <p>
        {REGULATORY.registeredName} (&quot;InsurIQ&quot;, &quot;we&quot;, &quot;us&quot;, or
        &quot;our&quot;) is committed to protecting your personal information. This Privacy Policy
        explains how we collect, use, store, and share your personal information when you use our
        website, products, or services.
      </p>
      <p>
        We are bound by the Protection of Personal Information Act, 4 of 2013 (&quot;POPIA&quot;)
        and take our obligations as a responsible party seriously. This policy is intended to be
        clear and plain — not buried in legal jargon.
      </p>

      <h2>2. Information We Collect</h2>
      <p>We may collect the following categories of personal information:</p>
      <ul>
        <li>
          <strong>Personal details:</strong> Full name, South African ID number, date of birth,
          gender.
        </li>
        <li>
          <strong>Contact information:</strong> Email address, phone number, physical or postal
          address.
        </li>
        <li>
          <strong>Financial information:</strong> Loan type, outstanding loan balance, income
          information, bank account details (for debit order setup after policy acceptance).
        </li>
        <li>
          <strong>Policy information:</strong> Products you enquire about or hold, correspondence
          related to your policy.
        </li>
        <li>
          <strong>Usage data:</strong> How you interact with our website, including pages visited,
          time spent, and device information, collected via Google Analytics 4.
        </li>
        <li>
          <strong>Communication records:</strong> Records of calls, emails, or messages you send
          to us.
        </li>
      </ul>

      <h2>3. Why We Collect Your Information</h2>
      <p>We collect and process your personal information for the following purposes:</p>
      <ul>
        <li>To generate and deliver personalised insurance quotes.</li>
        <li>To process and administer your insurance application and policy.</li>
        <li>To comply with our obligations under FSCA, FAIS, and other applicable law.</li>
        <li>To communicate with you about your policy, enquiry, or account.</li>
        <li>To send service-related updates (not marketing, unless you opt in).</li>
        <li>To detect and prevent fraud.</li>
        <li>To improve our products, services, and website.</li>
      </ul>

      <h2>4. Who We Share Your Information With</h2>
      <p>
        We do not sell, rent, or trade your personal information to any third party for marketing
        purposes. We may share your information with:
      </p>
      <ul>
        <li>
          <strong>Underwriting partners:</strong> To assess risk and issue policies on your behalf.
          These partners are bound by confidentiality obligations and their own POPIA compliance
          frameworks.
        </li>
        <li>
          <strong>Regulatory bodies:</strong> The FSCA and other regulatory authorities, where
          required by law.
        </li>
        <li>
          <strong>Service providers:</strong> Companies who assist us in operating our website and
          business (email delivery, cloud hosting, analytics). All service providers are subject to
          data processing agreements that restrict how they may use your information.
        </li>
        <li>
          <strong>Legal and compliance:</strong> Where required by a court order, subpoena, or
          applicable law.
        </li>
      </ul>

      <h2>5. How Long We Keep Your Information</h2>
      <ul>
        <li>
          <strong>Active client data:</strong> Retained for the duration of your policy plus 5
          years after termination, as required by FAIS record-keeping obligations.
        </li>
        <li>
          <strong>Enquiry data (non-clients):</strong> Retained for up to 12 months from the date
          of your enquiry.
        </li>
        <li>
          <strong>Website usage data:</strong> Retained for 13 months (Google Analytics 4 default
          retention period).
        </li>
        <li>
          <strong>Communication records:</strong> Retained for 5 years in accordance with FAIS
          requirements.
        </li>
      </ul>

      <h2>6. Your Rights Under POPIA</h2>
      <p>You have the following rights regarding your personal information:</p>
      <ul>
        <li>
          <strong>Right to access:</strong> You may request a copy of the personal information we
          hold about you.
        </li>
        <li>
          <strong>Right to correction:</strong> You may request that we correct inaccurate or
          incomplete information.
        </li>
        <li>
          <strong>Right to deletion:</strong> You may request that we delete your personal
          information, subject to legal retention requirements.
        </li>
        <li>
          <strong>Right to object:</strong> You may object to processing of your personal
          information for direct marketing purposes.
        </li>
        <li>
          <strong>Right to lodge a complaint:</strong> You may lodge a complaint with the
          Information Regulator of South Africa at{' '}
          <a href="https://www.justice.gov.za/inforeg/" target="_blank" rel="noopener noreferrer">
            www.justice.gov.za/inforeg
          </a>
          .
        </li>
      </ul>

      <h2>7. How to Exercise Your Rights</h2>
      <p>
        To exercise any of the rights above, please contact our POPIA Compliance Officer at{' '}
        <a href={`mailto:${REGULATORY.popiaOfficerEmail}`}>{REGULATORY.popiaOfficerEmail}</a>. We
        will acknowledge your request within 2 business days and respond fully within 10 business
        days.
      </p>

      <h2>8. Cookies and Analytics</h2>
      <p>
        Our website uses Google Analytics 4 to collect anonymised usage data. This helps us
        understand how visitors use our site so we can improve it. Google Analytics uses cookies —
        small text files stored on your device.
      </p>
      <p>
        You can opt out of Google Analytics tracking via your browser settings or by using{' '}
        <a
          href="https://tools.google.com/dlpage/gaoptout"
          target="_blank"
          rel="noopener noreferrer"
        >
          Google&apos;s Analytics Opt-out Browser Add-on
        </a>
        . We do not use cookies for advertising or tracking across other websites.
      </p>

      <h2>9. Data Security</h2>
      <p>
        We implement appropriate technical and organisational security measures to protect your
        personal information against unauthorised access, loss, or destruction. All data
        transmitted via our website is encrypted using HTTPS/TLS.
      </p>

      <h2>10. Contact Us</h2>
      <p>
        If you have any questions about this Privacy Policy or how we handle your personal
        information, please contact:
      </p>
      <ul>
        <li>
          <strong>{REGULATORY.registeredName}</strong>
        </li>
        <li>
          POPIA Compliance Officer:{' '}
          <a href={`mailto:${REGULATORY.popiaOfficerEmail}`}>{REGULATORY.popiaOfficerEmail}</a>
        </li>
        <li>
          General enquiries:{' '}
          <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
        </li>
      </ul>
    </LegalLayout>
  )
}
