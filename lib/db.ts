import { neon, type NeonQueryFunction } from '@neondatabase/serverless'

// Lazy singleton so importing this module never throws at build time when
// DATABASE_URL is unset (e.g. during `next build` without env).
let _sql: NeonQueryFunction<false, false> | null = null

export function getSql(): NeonQueryFunction<false, false> {
  if (!_sql) {
    const url = process.env.DATABASE_URL
    if (!url) throw new Error('DATABASE_URL is not configured.')
    _sql = neon(url)
  }
  return _sql
}

export function isDbConfigured(): boolean {
  return !!process.env.DATABASE_URL
}
