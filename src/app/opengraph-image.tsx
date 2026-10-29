import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { ImageResponse } from 'next/og'
import { SITE } from '@/lib/constants'

export const alt = `${SITE.name} — ${SITE.tagline}`
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// Read once at build: the image is statically generated.
const logo = readFile(
  path.join(process.cwd(), 'public', 'images', 'logo', 'insuriq-logo-compact-reverse.png'),
).then((buffer) => `data:image/png;base64,${buffer.toString('base64')}`)

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 80,
          background: 'linear-gradient(145deg, #071840 0%, #0B2D78 100%)',
          color: '#FFFFFF',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse renders plain <img> */}
        <img src={await logo} alt="" height={96} style={{ objectFit: 'contain', objectPosition: 'left' }} />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 64, fontWeight: 800, lineHeight: 1.05, letterSpacing: -1.5 }}>
            Credit life insurance that finally makes sense.
          </div>
          <div style={{ fontSize: 30, color: '#5DCDE6', marginTop: 24 }}>
            See what you could save in 60 seconds.
          </div>
        </div>
      </div>
    ),
    size,
  )
}
