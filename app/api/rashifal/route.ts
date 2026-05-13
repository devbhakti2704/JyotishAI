import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { rashi, date } = body as { rashi: string; date: string }

    if (!rashi || !date) {
      return NextResponse.json(
        { error: 'Missing required fields: rashi and date' },
        { status: 400 }
      )
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'Anthropic API key not configured. Please add ANTHROPIC_API_KEY to your .env.local file.' },
        { status: 500 }
      )
    }

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

    const formattedDate = new Date(date).toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1000,
      system:
        'You are a master Vedic astrologer with 30 years of experience. You give specific, emotionally resonant daily horoscopes that feel personal and accurate. Speak with warmth and authority. Be specific about energies, not generic. Always respond in valid JSON format only — no markdown, no text outside the JSON.',
      messages: [
        {
          role: 'user',
          content: `Give today's Vedic horoscope for ${rashi} rashi for ${formattedDate}.

Make it specific, emotionally resonant, 3-4 paragraphs covering love, career, and general energy guidance for the day. Include practical daily advice. Make it feel like it was written specifically for this date and this rashi.

Return ONLY valid JSON:
{
  "horoscope": "Full horoscope text — 3-4 paragraphs. Each paragraph on a new line. Cover: general daily energy, love/relationships, career/finances, and spiritual/health guidance. Make each section flow naturally without headers.",
  "luckyNumber": 7,
  "luckyColor": "Royal Blue",
  "advice": "One specific, actionable lucky tip for today — practical and cosmic simultaneously."
}`,
        },
      ],
    })

    const content = response.content[0]
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from Claude API')
    }

    let rawText = content.text.trim()
    if (rawText.startsWith('```')) {
      rawText = rawText.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim()
    }

    let horoscope
    try {
      horoscope = JSON.parse(rawText)
    } catch {
      const jsonMatch = rawText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        horoscope = JSON.parse(jsonMatch[0])
      } else {
        throw new Error('Failed to parse JSON from Claude response')
      }
    }

    return NextResponse.json(horoscope)
  } catch (error) {
    console.error('Rashifal API error:', error)

    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return NextResponse.json(
          { error: 'Invalid API key. Please check your ANTHROPIC_API_KEY.' },
          { status: 401 }
        )
      }
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(
      { error: 'Failed to generate horoscope. Please try again.' },
      { status: 500 }
    )
  }
}
