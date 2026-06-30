import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'
import { getSql, isDbConfigured } from '@/lib/db'
import { encryptOrNull } from '@/lib/crypto'
import {
  CONSENT_VERSION,
  deriveRegion,
  deriveAgeBucket,
  QUESTION_CATEGORIES,
  type QuestionCategory,
} from '@/lib/consent'

export const runtime = 'nodejs'

// Classify the free-text question into a single topic. Only the LABEL is ever stored
// in the aggregate layer — the raw question text stays encrypted in user_submissions.
async function classifyQuestion(question: string): Promise<QuestionCategory> {
  const q = question.trim()
  if (!q || !process.env.GROQ_API_KEY) return 'other'
  try {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })
    const c = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 4,
      temperature: 0,
      messages: [
        {
          role: 'system',
          content:
            'Classify the user message into exactly one category: career, love, health, finance, or other. Reply with only that single lowercase word.',
        },
        { role: 'user', content: q },
      ],
    })
    const label = (c.choices[0].message.content || '').toLowerCase().replace(/[^a-z]/g, '')
    return (QUESTION_CATEGORIES as readonly string[]).includes(label)
      ? (label as QuestionCategory)
      : 'other'
  } catch {
    return 'other'
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, dob, tob, pob, question, consent } = (await request.json()) as {
      name?: string
      dob?: string
      tob?: string
      pob?: string
      question?: string
      consent?: boolean
    }

    // Hard gate: never persist without explicit opt-in.
    if (consent !== true) {
      return NextResponse.json({ error: 'Consent is required to store data.' }, { status: 400 })
    }
    if (!isDbConfigured()) {
      return NextResponse.json({ error: 'Storage is not configured.' }, { status: 503 })
    }

    const question_category = await classifyQuestion(question || '')
    const region = deriveRegion(pob)
    const age_bucket = deriveAgeBucket(dob)

    const sql = getSql()
    const rows = await sql`
      insert into user_submissions
        (consent_given, consent_version, region, age_bucket, question_category,
         name_enc, birth_date_enc, birth_time_enc, birth_place_enc, question_text_enc)
      values
        (true, ${CONSENT_VERSION}, ${region}, ${age_bucket}, ${question_category},
         ${encryptOrNull(name)}, ${encryptOrNull(dob)}, ${encryptOrNull(tob)},
         ${encryptOrNull(pob)}, ${encryptOrNull(question)})
      returning id
    `
    // The id doubles as the user's "deletion code" for the DPDP right to erasure.
    return NextResponse.json({ id: rows[0].id, consentVersion: CONSENT_VERSION })
  } catch (e) {
    console.error('submissions POST error:', e)
    return NextResponse.json({ error: 'Could not store submission.' }, { status: 500 })
  }
}
