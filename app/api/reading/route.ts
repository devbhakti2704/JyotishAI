import Groq from 'groq-sdk'
import { NextRequest, NextResponse } from 'next/server'

// Allow the Groq generation to run beyond the platform's default (short) timeout.
// On a cold serverless function the first request is slowest; without this the
// first attempt can exceed the default limit and fail, while a warm retry succeeds.
export const maxDuration = 60

function calculateRashi(dob: string): string {
  // Parse date and return Vedic rashi name based on approximate Sun sign
  // Vedic rashis (tropical sun sign as fallback approximation)
  try {
    const date = new Date(dob)
    const month = date.getMonth() + 1 // 1-12
    const day = date.getDate()

    // Mesh (Aries): Mar 21 - Apr 19
    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'Mesh (Aries)'
    // Vrishabh (Taurus): Apr 20 - May 20
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'Vrishabh (Taurus)'
    // Mithun (Gemini): May 21 - Jun 20
    if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'Mithun (Gemini)'
    // Kark (Cancer): Jun 21 - Jul 22
    if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'Kark (Cancer)'
    // Sinh (Leo): Jul 23 - Aug 22
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'Sinh (Leo)'
    // Kanya (Virgo): Aug 23 - Sep 22
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'Kanya (Virgo)'
    // Tula (Libra): Sep 23 - Oct 22
    if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'Tula (Libra)'
    // Vrishchik (Scorpio): Oct 23 - Nov 21
    if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'Vrishchik (Scorpio)'
    // Dhanu (Sagittarius): Nov 22 - Dec 21
    if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'Dhanu (Sagittarius)'
    // Makar (Capricorn): Dec 22 - Jan 19
    if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'Makar (Capricorn)'
    // Kumbh (Aquarius): Jan 20 - Feb 18
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'Kumbh (Aquarius)'
    // Meen (Pisces): Feb 19 - Mar 20
    if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return 'Meen (Pisces)'

    return 'Mesh (Aries)' // fallback
  } catch {
    return 'Mesh (Aries)'
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, dob, tob, pob, question, consent } = body as {
      name: string
      dob: string
      tob?: string
      pob: string
      question?: string
      consent?: boolean
    }

    if (!name || !dob || !pob) {
      return NextResponse.json(
        { error: 'Missing required fields: name, dob, pob' },
        { status: 400 }
      )
    }

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: 'Groq API key not configured. Please add GROQ_API_KEY to your .env.local file.' },
        { status: 500 }
      )
    }

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

    const rashi = calculateRashi(dob)
    const birthTime = tob ? `at ${tob}` : '(time not provided)'

    // Pass the user's raw question through to frame the reading. Classification
    // happens separately in /api/submissions — we do NOT re-classify here.
    const questionContext = question?.trim()
      ? `\n\nThe user has a specific question: "${question.trim()}". Ground your Vedic reading in this context while still covering the relevant chart areas.`
      : ''

    const prompt = `Give a complete Vedic astrology reading for ${name}, born on ${dob} ${birthTime} in ${pob}. Their approximate Rashi (Sun sign) is ${rashi}.${questionContext}

Return ONLY valid JSON in this exact structure (no extra text, no markdown):
{
  "rashi": "Rashi name in both Hindi and English e.g. Mesh (Aries)",
  "lagna": "Ascendant sign name based on birth time and place",
  "luckyNumber": 7,
  "luckyColor": "Gold",
  "freeReading": {
    "personalityOverview": "3-4 deeply personal sentences about their personality based on their rashi and birth details. Make it feel as if you truly know them.",
    "currentPhase": "1-2 sentences about their current life phase and what energies surround them right now."
  },
  "fullReading": {
    "career": "Detailed 2-3 paragraph career prediction for the next 12 months. Be specific about timing, opportunities, and challenges.",
    "love": "Detailed 2-3 paragraph love and relationship prediction. Include compatibility insights and timing.",
    "health": "Detailed paragraph on health guidance, areas to watch, and recommended lifestyle practices.",
    "finance": "Detailed paragraph on financial outlook, investment timing, and wealth-building guidance.",
    "dashas": [
      {"period": "2024-2027", "planet": "Saturn", "prediction": "Detailed 2-sentence prediction for this dasha period"},
      {"period": "2027-2030", "planet": "Mercury", "prediction": "Detailed 2-sentence prediction for this dasha period"},
      {"period": "2030-2033", "planet": "Ketu", "prediction": "Detailed 2-sentence prediction for this dasha period"}
    ],
    "remedies": {
      "gemstone": "Specific gemstone name, which finger, which metal, and best day to start wearing it",
      "mantra": "Specific Sanskrit mantra with count (e.g. 108 times) and best time to chant",
      "fasting": "Which day to fast, what to avoid, and the spiritual benefit",
      "other": "One additional Vedic remedy such as charity, color therapy, or yantra"
    },
    "mangalDosha": {
      "present": false,
      "description": "Detailed explanation of their Mangal Dosha status, its implications, and remedies if present"
    }
  }
}`

    const systemPrompt =
      'You are a master Vedic astrologer with 30 years of experience in Jyotish shastra. You give detailed, specific, emotionally resonant readings that feel personal and accurate. Never be vague. Always give specific predictions and advice tailored to the individual. Speak with authority and warmth. You deeply understand planetary periods (dashas), doshas, and remedies. Always respond in valid JSON format only — no markdown, no explanation outside the JSON.'

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      // JSON mode guarantees syntactically valid JSON, removing the intermittent
      // parse failures that surfaced as a generic 500 on some generations.
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt },
      ],
      max_tokens: 2000,
    })

    // Consent-gated export to a Google Sheet webhook. Fire-and-forget (never awaited),
    // so it can't slow down or break the reading response. Skips silently if the user
    // didn't opt in or the webhook env var isn't set.
    if (consent === true && process.env.GOOGLE_SHEET_WEBHOOK) {
      fetch(process.env.GOOGLE_SHEET_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, dob, tob: tob ?? '', pob, question: question ?? '' }),
      }).catch(() => {})
    }

    const rawText = (completion.choices[0].message.content ?? '').trim().replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim()

    let reading
    try {
      reading = JSON.parse(rawText)
    } catch {
      const jsonMatch = rawText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        reading = JSON.parse(jsonMatch[0])
      } else {
        throw new Error('Failed to parse JSON from Gemini response')
      }
    }

    return NextResponse.json(reading)
  } catch (error) {
    console.error('Reading API error:', error)

    if (error instanceof Error) {
      if (error.message.includes('401') || error.message.includes('api_key') || error.message.includes('API key')) {
        return NextResponse.json(
          { error: 'Invalid API key. Please check your GROQ_API_KEY.' },
          { status: 401 }
        )
      }
      if (error.message.includes('429') || error.message.includes('rate_limit') || error.message.includes('quota')) {
        return NextResponse.json(
          { error: 'Groq API rate limit exceeded. Please try again later.' },
          { status: 429 }
        )
      }
      if (error.message.includes('parse')) {
        return NextResponse.json(
          { error: 'Failed to generate reading. Please try again.' },
          { status: 500 }
        )
      }
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    )
  }
}
