import { NextRequest, NextResponse } from 'next/server'
import { getSql, isDbConfigured } from '@/lib/db'

export const runtime = 'nodejs'

// DPDP right to erasure. The id returned at submission time acts as the deletion code.
export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!isDbConfigured()) {
      return NextResponse.json({ error: 'Storage is not configured.' }, { status: 503 })
    }
    const id = params.id
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
      return NextResponse.json({ error: 'Invalid deletion code.' }, { status: 400 })
    }
    const sql = getSql()
    const rows = await sql`delete from user_submissions where id = ${id} returning id`
    if (rows.length === 0) {
      return NextResponse.json({ deleted: false, error: 'No record found for that code.' }, { status: 404 })
    }
    return NextResponse.json({ deleted: true })
  } catch (e) {
    console.error('submissions DELETE error:', e)
    return NextResponse.json({ error: 'Could not process erasure request.' }, { status: 500 })
  }
}
