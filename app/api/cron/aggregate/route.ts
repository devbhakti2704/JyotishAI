import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { getSql, isDbConfigured } from '@/lib/db'
import { K_MIN } from '@/lib/consent'

export const runtime = 'nodejs'

function isAuthorized(request: NextRequest): boolean {
  const expected = process.env.CRON_SECRET
  if (!expected) return false
  const auth = request.headers.get('authorization') || ''
  const provided = auth.startsWith('Bearer ')
    ? auth.slice(7)
    : new URL(request.url).searchParams.get('secret') || ''
  const a = Buffer.from(provided)
  const b = Buffer.from(expected)
  return a.length === b.length && crypto.timingSafeEqual(a, b)
}

// Rebuilds insights_aggregates from consented raw rows.
// k-anonymity is enforced by `having count(*) >= K_MIN` — small buckets are dropped.
async function runAggregation() {
  const sql = getSql()
  const rows = await sql`
    insert into insights_aggregates
      (period_month, question_category, age_bucket, region, user_count)
    select
      date_trunc('month', created_at)::date as period_month,
      question_category, age_bucket, region, count(*)::int
    from user_submissions
    where consent_given = true
      and deleted_at is null
      and question_category is not null
      and age_bucket is not null and age_bucket <> 'unknown'
      and region is not null
    group by 1, 2, 3, 4
    having count(*) >= ${K_MIN}
    on conflict (period_month, question_category, age_bucket, region)
    do update set user_count = excluded.user_count, generated_at = now()
    returning id
  `
  return rows.length
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  if (!isDbConfigured()) return NextResponse.json({ error: 'Storage is not configured.' }, { status: 503 })
  try {
    const bucketsWritten = await runAggregation()
    return NextResponse.json({ ok: true, bucketsWritten, kMin: K_MIN })
  } catch (e) {
    console.error('aggregate cron error:', e)
    return NextResponse.json({ error: 'Aggregation failed.' }, { status: 500 })
  }
}

// Allow GET too, so a scheduler that only does GET can trigger it.
export const GET = POST
