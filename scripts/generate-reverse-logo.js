'use strict'
/**
 * Regenerates the light-on-dark ("reverse") InsurIQ logo from the master asset.
 *
 *   node scripts/generate-reverse-logo.js
 *
 * Run this whenever public/images/logo/insuriq-logo.png changes. The master is
 * only ever read; this writes insuriq-logo-reverse.png beside it.
 *
 * Bundles a minimal 8-bit PNG codec so the repo needs no image dependency.
 */
const fs = require('fs')
const path = require('path')

const ROOT = path.join(__dirname, '..')

/* ------------------------------------------------------------ PNG codec */
const zlib = require('zlib')

const SIG = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])

let CRC_TABLE = null
function crcTable() {
  if (CRC_TABLE) return CRC_TABLE
  CRC_TABLE = new Int32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    CRC_TABLE[n] = c
  }
  return CRC_TABLE
}
function crc32(buf) {
  const t = crcTable()
  let c = 0xffffffff
  for (let i = 0; i < buf.length; i++) c = t[(c ^ buf[i]) & 0xff] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}

function paeth(a, b, c) {
  const p = a + b - c
  const pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c)
  if (pa <= pb && pa <= pc) return a
  if (pb <= pc) return b
  return c
}

function decode(buf) {
  if (!buf.subarray(0, 8).equals(SIG)) throw new Error('not a PNG')
  let pos = 8
  let ihdr = null
  const idat = []
  while (pos < buf.length) {
    const len = buf.readUInt32BE(pos)
    const type = buf.toString('ascii', pos + 4, pos + 8)
    const data = buf.subarray(pos + 8, pos + 8 + len)
    if (type === 'IHDR') {
      ihdr = {
        width: data.readUInt32BE(0),
        height: data.readUInt32BE(4),
        bitDepth: data[8],
        colorType: data[9],
        compression: data[10],
        filter: data[11],
        interlace: data[12],
      }
    } else if (type === 'IDAT') {
      idat.push(Buffer.from(data))
    } else if (type === 'IEND') {
      break
    }
    pos += 12 + len
  }
  if (!ihdr) throw new Error('no IHDR')
  if (ihdr.bitDepth !== 8) throw new Error('unsupported bit depth: ' + ihdr.bitDepth)
  if (ihdr.interlace !== 0) throw new Error('interlaced PNG unsupported')
  const channels = ihdr.colorType === 6 ? 4 : ihdr.colorType === 2 ? 3 : null
  if (!channels) throw new Error('unsupported colorType: ' + ihdr.colorType)

  const raw = zlib.inflateSync(Buffer.concat(idat))
  const { width, height } = ihdr
  const bpp = channels
  const stride = width * bpp
  const out = Buffer.alloc(stride * height)

  let rp = 0
  for (let y = 0; y < height; y++) {
    const ft = raw[rp++]
    const line = raw.subarray(rp, rp + stride)
    rp += stride
    const cur = out.subarray(y * stride, (y + 1) * stride)
    const prev = y > 0 ? out.subarray((y - 1) * stride, y * stride) : null
    for (let x = 0; x < stride; x++) {
      const a = x >= bpp ? cur[x - bpp] : 0
      const b = prev ? prev[x] : 0
      const c = prev && x >= bpp ? prev[x - bpp] : 0
      const v = line[x]
      let val
      switch (ft) {
        case 0: val = v; break
        case 1: val = v + a; break
        case 2: val = v + b; break
        case 3: val = v + ((a + b) >> 1); break
        case 4: val = v + paeth(a, b, c); break
        default: throw new Error('bad filter type ' + ft)
      }
      cur[x] = val & 0xff
    }
  }
  return { width, height, channels, data: out }
}

function encode({ width, height, channels, data }) {
  const stride = width * channels
  const raw = Buffer.alloc((stride + 1) * height)
  for (let y = 0; y < height; y++) {
    raw[y * (stride + 1)] = 0 // filter: None
    data.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride)
  }
  const deflated = zlib.deflateSync(raw, { level: 9 })

  const chunks = []
  const chunk = (type, body) => {
    const len = Buffer.alloc(4)
    len.writeUInt32BE(body.length, 0)
    const tb = Buffer.from(type, 'ascii')
    const crc = Buffer.alloc(4)
    crc.writeUInt32BE(crc32(Buffer.concat([tb, body])), 0)
    chunks.push(len, tb, body, crc)
  }

  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(width, 0)
  ihdr.writeUInt32BE(height, 4)
  ihdr[8] = 8
  ihdr[9] = channels === 4 ? 6 : 2
  ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0
  chunk('IHDR', ihdr)
  chunk('IDAT', deflated)
  chunk('IEND', Buffer.alloc(0))

  return Buffer.concat([SIG, ...chunks])
}

/* -------------------------------------------------------- reverse lockup */

// Derives the light-on-dark ("reverse") InsurIQ logo from the master asset.
// Master is never modified — this only writes a new file.
//
//   wordmark + tagline (x >= SPLIT) -> solid white
//   icon (x < SPLIT)                -> brand blues kept; near-black navy facets
//                                      lifted toward brand-bright so they hold
//                                      >= 3:1 against the #071840 dark surfaces

const SRC = path.join(ROOT, 'public/images/logo/insuriq-logo.png')
const OUT = path.join(ROOT, 'public/images/logo/insuriq-logo-reverse.png')

const SPLIT = 406             // empty gutter runs x354-456; split inside it
const MIN_CONTRAST = 3.05     // WCAG 1.4.11 non-text contrast, small safety margin
const TARGET = [75, 174, 240] // brand bright #4BAEF0
const DARK_BG = [7, 24, 64]   // #071840 — footer / mobile menu surface

const srgbC = (c) => { const s = c / 255; return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4) }
const relLum = (r, g, b) => 0.2126 * srgbC(r) + 0.7152 * srgbC(g) + 0.0722 * srgbC(b)
const ratio = (a, b) => {
  const la = relLum(a[0], a[1], a[2]), lb = relLum(b[0], b[1], b[2])
  const [hi, lo] = la > lb ? [la, lb] : [lb, la]
  return (hi + 0.05) / (lo + 0.05)
}

/**
 * Lift a colour toward TARGET by the smallest amount that clears MIN_CONTRAST
 * against DARK_BG. Keeps the mark's own hue wherever it already has enough
 * contrast, so only the near-black facets actually move.
 */
function liftToFloor(r, g, b) {
  if (ratio([r, g, b], DARK_BG) >= MIN_CONTRAST) return null
  let lo = 0, hi = 1
  for (let i = 0; i < 24; i++) {
    const t = (lo + hi) / 2
    const c = [
      r + (TARGET[0] - r) * t,
      g + (TARGET[1] - g) * t,
      b + (TARGET[2] - b) * t,
    ]
    if (ratio(c, DARK_BG) >= MIN_CONTRAST) hi = t; else lo = t
  }
  return [
    Math.round(r + (TARGET[0] - r) * hi),
    Math.round(g + (TARGET[1] - g) * hi),
    Math.round(b + (TARGET[2] - b) * hi),
  ]
}

const img = decode(fs.readFileSync(SRC))
const { width, height, channels: ch, data } = img
if (ch !== 4) throw new Error('expected RGBA master')

let whitened = 0
let lifted = 0

for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const o = (y * width + x) * ch
    if (data[o + 3] === 0) continue

    if (x >= SPLIT) {
      // Wordmark + tagline -> white
      data[o] = 255; data[o + 1] = 255; data[o + 2] = 255
      whitened++
      continue
    }

    const next = liftToFloor(data[o], data[o + 1], data[o + 2])
    if (next) {
      data[o] = next[0]; data[o + 1] = next[1]; data[o + 2] = next[2]
      lifted++
    }
  }
}

fs.mkdirSync(path.dirname(OUT), { recursive: true })
fs.writeFileSync(OUT, encode(img))

const srcSize = fs.statSync(SRC).size
const outSize = fs.statSync(OUT).size
console.log('wrote', OUT)
console.log('  wordmark px -> white :', whitened)
console.log('  icon px lifted       :', lifted)
console.log('  master', (srcSize / 1024).toFixed(1) + 'KB (untouched) -> reverse', (outSize / 1024).toFixed(1) + 'KB')

// Contrast audit of the result against the dark surfaces it will sit on
const BG = DARK_BG
let worstOpaque = Infinity, worstPx = null
const seen = new Set()
for (let i = 0; i < width * height; i++) {
  const o = i * ch
  if (data[o + 3] === 0) continue
  const key = (data[o] >> 3 << 10) | (data[o + 1] >> 3 << 5) | (data[o + 2] >> 3)
  if (seen.has(key)) continue
  seen.add(key)
  const c = ratio([data[o], data[o + 1], data[o + 2]], BG)
  if (c < worstOpaque) { worstOpaque = c; worstPx = [data[o], data[o + 1], data[o + 2]] }
}
console.log('\ncontrast vs #071840:')
console.log('  white wordmark :', ratio([255, 255, 255], BG).toFixed(2) + ':1')
console.log('  worst opaque px:', ratio(worstPx, BG).toFixed(2) + ':1', 'rgb(' + worstPx.join(',') + ')')
