import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { getSql, isDbConfigured } from '@/lib/db'

export const runtime = 'nodejs'

function isAuthorized(request: NextRequest): boolean {
  const expected = process.env.ADMIN_TOKEN
  if (!expected) return false
  const auth = request.headers.get('authorization') || ''
  const provided = auth.startsWith('Bearer ')
    ? auth.slice(7)
    : new URL(request.url).searchParams.get('token') || ''
  const a = Buffer.from(provided)
  const b = Buffer.from(expected)
  return a.length === b.length && crypto.timingSafeEqual(a, b)
}

// Admin-only export of the anonymized aggregate layer (never raw PII).
export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }
  if (!isDbConfigured()) {
    return NextResponse.json({ error: 'Storage is not configured.' }, { status: 503 })
  }

  const sql = getSql()
  const rows = (await sql`
    select period_month, question_category, age_bucket, region, user_count, generated_at
    from insights_aggregates
    order by period_month desc, question_category, region, age_bucket
  `) as Array<Record<string, unknown>>

  const format = new URL(request.url).searchParams.get('format') || 'json'
  if (format === 'csv') {
    const header = 'period_month,question_category,age_bucket,region,user_count,generated_at'
    const lines = rows.map((r) =>
      [r.period_month, r.question_category, r.age_bucket, r.region, r.user_count, r.generated_at].join(',')
    )
    return new NextResponse([header, ...lines].join('\n'), {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="jyotishai-insights.csv"',
      },
    })
  }

  return NextResponse.json({ count: rows.length, aggregates: rows })
}
