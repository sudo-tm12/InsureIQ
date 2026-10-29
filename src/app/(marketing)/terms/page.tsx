import type { Metadata } from 'next'
import { LegalLayout } from '@/components/layout/LegalLayout'
import { REGULATORY, CONTACT } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description: 'InsurIQ Terms & Conditions governing use of our website and services.',
}

export default function TermsPage() {
  return (
    <LegalLayout eyebrow="LEGAL" title="Terms & Conditions" lastUpdated="May 2026">
      <h2>1. Acceptance of Terms</h2>
      <p>
        By accessing or using the InsurIQ website at{' '}
        <a href="https://www.insuriq.co.za">www.insuriq.co.za</a> (the &quot;Site&quot;), you
        agree to be bound by these Terms &amp; Conditions (&quot;Terms&quot;) and our{' '}
        <a href="/privacy-policy">Privacy Policy</a>. If you do not agree to these Terms, please
        do not use the Site.
      </p>
      <p>
        These Terms govern your use of the Site only. They do not govern any insurance products or
        financial services rendered by {REGULATORY.registeredName}, which are subject to separate
        product terms and FAIS-compliant disclosures provided at the time of service.
      </p>

      <h2>2. Use of This Website</h2>
      <p>You agree to use this Site only for lawful purposes and in a manner that does not:</p>
      <ul>
        <li>Infringe the rights of any third party.</li>
        <li>
          Transmit any unsolicited or unauthorised advertising, promotional material, or spam.
        </li>
        <li>
          Attempt to gain unauthorised access to any part of the Site or its related systems.
        </li>
        <li>
          Transmit any material that is harmful, offensive, defamatory, or otherwise objectionable.
        </li>
        <li>Interfere with the proper operation of the Site.</li>
      </ul>
      <p>
        We reserve the right to restrict or terminate access to the Site for any user who violates
        these Terms or who engages in conduct we determine to be harmful to other users or to
        InsurIQ.
      </p>

      <h2>3. Intellectual Property</h2>
      <p>
        All content on this Site — including text, graphics, logos, icons, images, and software —
        is the property of {REGULATORY.registeredName} or its content suppliers and is protected
        by South African and international copyright and intellectual property law.
      </p>
      <p>
        You may not reproduce, distribute, modify, transmit, reuse, or use any content from this
        Site for commercial purposes without our express written permission.
      </p>

      <h2>4. Disclaimer of Warranties</h2>
      <p>
        The Site and its content are provided on an &quot;as is&quot; and &quot;as available&quot;
        basis without warranties of any kind, either express or implied. We do not warrant that the
        Site will be uninterrupted, error-free, or free of viruses or other harmful components.
      </p>
      <p>
        Information on this Site is for general informational purposes only and does not constitute
        financial advice. You should obtain independent financial advice before making any financial
        decisions.
      </p>

      <h2>5. Limitation of Liability</h2>
      <p>
        To the fullest extent permitted by applicable law, {REGULATORY.registeredName} will not be
        liable for any indirect, incidental, special, consequential, or punitive damages arising
        from your use of or inability to use this Site, even if we have been advised of the
        possibility of such damages.
      </p>
      <p>
        Our total liability for any claim arising from your use of this Site shall not exceed the
        amount you paid us in the three months preceding the claim, or R1,000, whichever is
        greater.
      </p>

      <h2>6. Third-Party Links</h2>
      <p>
        This Site may contain links to third-party websites. These links are provided for your
        convenience only. We have no control over the content of those sites and accept no
        responsibility for them or for any loss or damage that may arise from your use of them.
      </p>

      <h2>7. Governing Law</h2>
      <p>
        These Terms shall be governed by and construed in accordance with the laws of the Republic
        of South Africa. Any disputes arising under these Terms shall be subject to the exclusive
        jurisdiction of the courts of the Republic of South Africa.
      </p>

      <h2>8. Changes to These Terms</h2>
      <p>
        We reserve the right to modify these Terms at any time. Changes will be posted on this
        page with an updated &quot;last updated&quot; date. Your continued use of the Site after
        any changes constitutes your acceptance of the revised Terms.
      </p>

      <h2>9. Contact</h2>
      <p>
        If you have any questions about these Terms, please contact us at{' '}
        <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>.
      </p>
    </LegalLayout>
  )
}
