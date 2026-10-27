/**
 * Apply the lead-store schema to the configured Neon database.
 * Usage: npm run leads:migrate   (requires DATABASE_URL in .env.local or env)
 */
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { neon } from '@neondatabase/serverless'

// Load .env.local if the environment doesn't already provide DATABASE_URL.
if (!process.env.DATABASE_URL) {
  try {
    const envFile = readFileSync(path.join(process.cwd(), '.env.local'), 'utf-8')
    for (const line of envFile.split('\n')) {
      const match = /^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/.exec(line)
      if (match && !process.env[match[1]]) process.env[match[1]] = match[2]
    }
  } catch {
    // Fall through to the error below.
  }
}

const url = process.env.DATABASE_URL?.trim()
if (!url) {
  console.error('ERROR: DATABASE_URL is not set (Neon connection string).')
  process.exit(1)
}

const sql = neon(url)
const schema = readFileSync(path.join(process.cwd(), 'scripts', 'leads', 'schema.sql'), 'utf-8')
const statements = schema
  .split(';')
  .map((statement) => statement.trim())
  .filter((statement) => statement.length > 0 && !statement.startsWith('--'))

for (const statement of statements) {
  await sql(statement)
  console.log('applied:', statement.split('\n')[0])
}
console.log('Lead store schema is up to date.')
