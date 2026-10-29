import type { Metadata } from 'next'
import { Mail, MessageCircle, ShieldCheck, LockKeyhole } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { ContactForm } from '@/components/forms/ContactForm'
import { CONTACT, FSP_LABEL, WHATSAPP_URL } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Contact Us | Get Your Free Quote',
  description:
    'Get in touch with InsurIQ for a free credit life insurance quote. FSCA licensed. Response within one business day.',
}

const CONTACT_ITEMS = [
  {
    icon: MessageCircle,
    label: 'WhatsApp',
    value: CONTACT.whatsappDisplay,
    href: WHATSAPP_URL,
    external: true,
  },
  {
    icon: Mail,
    label: 'Email',
    value: CONTACT.email,
    href: `mailto:${CONTACT.email}`,
    external: false,
  },
  {
    icon: ShieldCheck,
    label: 'FSCA Licensed FSP',
    value: FSP_LABEL ?? 'Licensed under FAIS',
    description: 'Authorised Financial Services Provider',
    href: null,
    external: false,
  },
]

export default function ContactPage() {
  return (
    <div className="bg-brand-cloud min-h-screen">
      {/* Page header — dark hero strip */}
      <div
        className="relative pt-32 pb-16 md:pt-40 md:pb-20 overflow-hidden"
        style={{ background: 'linear-gradient(145deg, #071840 0%, #0B2D78 100%)' }}
      >
        <div
          className="absolute top-0 right-0 w-[500px] h-[500px] pointer-events-none"
          style={{
            background: 'radial-gradient(circle at top right, rgba(93,205,230,0.10) 0%, transparent 65%)',
          }}
          aria-hidden="true"
        />
        <Container className="relative">
          <p className="text-[11px] font-body font-medium uppercase tracking-widest text-brand-cyan mb-4">
            GET IN TOUCH
          </p>
          <h1
            className="font-display font-extrabold text-white text-balance mb-4"
            style={{ fontSize: 'clamp(36px, 5vw, 60px)', lineHeight: 1.05, letterSpacing: '-0.025em' }}
          >
            {"Let's find the "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: 'linear-gradient(90deg, #5DCDE6 0%, #4BAEF0 100%)',
              }}
            >
              right cover
            </span>
            {' for you.'}
          </h1>
          <p className="text-[15px] text-white/65 font-body leading-relaxed max-w-lg">
            Fill in the form and we&apos;ll get back to you within one business day. Or chat with
            us directly on WhatsApp.
          </p>
        </Container>
      </div>

      {/* Main content */}
      <Container className="py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">

          {/* ── Left: contact info + trust block ── */}
          <div>
            {/* Contact items */}
            <div className="space-y-6 mb-8">
              {CONTACT_ITEMS.map(({ icon: Icon, label, value, description, href, external }) => (
                <div key={label} className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-white border border-brand-border flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Icon className="w-5 h-5 text-brand-cyan" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-xs font-body font-medium uppercase tracking-wider text-brand-muted mb-0.5">
                      {label}
                    </p>
                    {href ? (
                      <a
                        href={href}
                        target={external ? '_blank' : undefined}
                        rel={external ? 'noopener noreferrer' : undefined}
                        className="text-brand-navy font-body font-semibold hover:text-brand-blue transition-colors duration-[150ms]"
                      >
                        {value}
                      </a>
                    ) : (
                      <p className="text-brand-navy font-body font-semibold">{value}</p>
                    )}
                    {description && (
                      <p className="text-xs text-brand-muted font-body mt-0.5">{description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Trust block */}
            <div className="bg-white rounded-2xl p-6 border border-brand-border">
              <div className="flex items-center gap-3 mb-3">
                <LockKeyhole className="w-5 h-5 text-brand-cyan flex-shrink-0" aria-hidden="true" />
                <h2 className="font-display font-bold text-brand-navy text-base">
                  Your information is safe
                </h2>
              </div>
              <p className="text-sm text-brand-muted font-body leading-relaxed">
                All submissions are encrypted, POPIA compliant, and never shared with third
                parties. We only use your information to respond to your enquiry.
              </p>
            </div>
          </div>

          {/* ── Right: form card ── */}
          <div
            className="bg-white rounded-2xl p-6 lg:p-8"
            style={{ boxShadow: '0 4px 32px rgba(11,45,120,0.08)' }}
          >
            <ContactForm />
          </div>

        </div>
      </Container>
    </div>
  )
}
