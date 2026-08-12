import { Logo } from '@/components/ui/Logo'
import { cn } from '@/lib/utils'

export interface PhoneMockupProps {
  imageSrc?: string
  imageAlt?: string
  className?: string
}

const LOAN_OPTIONS = ['Vehicle Finance', 'Home Loan', 'Personal Loan', 'Business Loan']

function QuoteUI() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: '#ffffff' }}>
      {/* App header — dark navy, padded to clear pill notch (~31px from top) */}
      <div
        style={{
          flexShrink: 0,
          padding: '36px 16px 16px',
          background: 'linear-gradient(145deg, #071840 0%, #0B2D78 100%)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <Logo variant="compact-reverse" linkToHome={false} decorative sizes="72px" className="h-[18px] w-auto" />
          <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '8px' }}>FSCA Licensed</span>
        </div>
        <p
          style={{
            color: 'rgba(255,255,255,0.55)',
            fontSize: '8px',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            margin: '0 0 6px',
          }}
        >
          Step 1 of 3 · Get a Quote
        </p>
        <div
          style={{
            width: '100%',
            backgroundColor: 'rgba(255,255,255,0.2)',
            borderRadius: '999px',
            height: '3px',
            marginBottom: '12px',
          }}
        >
          <div style={{ width: '33%', height: '100%', backgroundColor: '#5DCDE6', borderRadius: '999px' }} />
        </div>
        <p style={{ color: '#ffffff', fontWeight: 700, fontSize: '13px', lineHeight: 1.3, margin: 0 }}>
          What type of loan do you have?
        </p>
      </div>

      {/* Loan type options */}
      <div
        style={{
          flex: 1,
          padding: '10px 12px 0',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
        }}
      >
        {LOAN_OPTIONS.map((option, i) => (
          <div
            key={option}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 12px',
              borderRadius: '12px',
              border: `1.5px solid ${i === 0 ? '#5DCDE6' : '#E2E8F0'}`,
              backgroundColor: i === 0 ? 'rgba(93,205,230,0.1)' : '#ffffff',
            }}
          >
            <div
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                border: `1.5px solid ${i === 0 ? '#5DCDE6' : '#E2E8F0'}`,
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {i === 0 && (
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#5DCDE6' }} />
              )}
            </div>
            <span
              style={{
                fontSize: '10px',
                color: i === 0 ? '#0B2D78' : '#64748B',
                fontWeight: i === 0 ? 500 : 400,
                lineHeight: 1,
              }}
            >
              {option}
            </span>
          </div>
        ))}
      </div>

      {/* CTA + step dots */}
      <div style={{ padding: '10px 12px 16px', flexShrink: 0 }}>
        <div
          style={{
            width: '100%',
            textAlign: 'center',
            color: '#ffffff',
            fontWeight: 600,
            borderRadius: '12px',
            padding: '10px',
            fontSize: '11px',
            background: 'linear-gradient(135deg, #0B2D78 0%, #1A5FBF 100%)',
          }}
        >
          Next →
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '10px' }}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                borderRadius: '999px',
                backgroundColor: i === 0 ? '#5DCDE6' : '#E2E8F0',
                width: i === 0 ? '14px' : '5px',
                height: '5px',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export function PhoneMockup({ imageSrc, imageAlt, className }: PhoneMockupProps) {
  return (
    <div className={cn('relative mx-auto w-full', className)} style={{ maxWidth: '260px' }}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 400 800"
        width="100%"
        height="100%"
        style={{ display: 'block' }}
        role="img"
        aria-label={imageAlt ?? 'InsurIQ mobile app preview'}
      >
        <defs>
          <clipPath id="phone-screen-clip">
            <rect x="22" y="22" width="356" height="756" rx="43" />
          </clipPath>
        </defs>

        {/* Outer bezel */}
        <rect x="10" y="10" width="380" height="780" rx="55" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="4" />
        {/* Inner dark frame */}
        <rect x="15" y="15" width="370" height="770" rx="50" fill="#0f172a" />
        {/* Screen background */}
        <rect x="22" y="22" width="356" height="756" rx="43" fill="#ffffff" />

        {/* Screen content */}
        {imageSrc ? (
          <image
            href={imageSrc}
            x="22"
            y="22"
            width="356"
            height="756"
            clipPath="url(#phone-screen-clip)"
            preserveAspectRatio="xMidYMin slice"
          />
        ) : (
          <foreignObject x="22" y="22" width="356" height="756" clipPath="url(#phone-screen-clip)">
            <QuoteUI />
          </foreignObject>
        )}

        {/* Pill notch — rendered above screen content */}
        <rect x="135" y="35" width="130" height="35" rx="17.5" fill="#000000" />
        {/* Camera */}
        <circle cx="245" cy="52.5" r="6" fill="#1e293b" />
        <circle cx="245" cy="52.5" r="2" fill="#3b82f6" opacity="0.6" />

        {/* Volume buttons — left */}
        <path d="M7,140 h3 v25 h-3 z" fill="#cbd5e1" />
        <path d="M7,190 h3 v50 h-3 z" fill="#cbd5e1" />
        <path d="M7,255 h3 v50 h-3 z" fill="#cbd5e1" />
        {/* Power button — right */}
        <path d="M390,210 h3 v70 h-3 z" fill="#cbd5e1" />
      </svg>
    </div>
  )
}
