import Groq from 'groq-sdk'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { rashi } = body as { rashi: string; date?: string }

    if (!rashi) {
      return NextResponse.json(
        { error: 'Missing required field: rashi' },
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

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'user',
          content: `You are a Vedic astrologer. Give today's detailed horoscope for ${rashi} rashi. Include predictions for love, career, health and finances. Give specific advice and lucky number, lucky color for today. Write in a warm, personal tone. 200 words maximum.`,
        },
      ],
      max_tokens: 400,
    })

    const horoscope = (completion.choices[0].message.content ?? '').trim()

    if (!horoscope) {
      return NextResponse.json(
        { error: 'The stars are temporarily misaligned. Please try again.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ horoscope })
  } catch (error) {
    console.error('Rashifal API error:', error)

    if (error instanceof Error) {
      if (error.message.includes('401') || error.message.includes('api_key') || error.message.includes('API key')) {
        return NextResponse.json(
          { error: 'Invalid API key. Please check your GROQ_API_KEY.' },
          { status: 401 }
        )
      }
      if (error.message.includes('429') || error.message.includes('rate_limit')) {
        return NextResponse.json(
          { error: 'Too many requests. Please wait a moment and try again.' },
          { status: 429 }
        )
      }
    }

    return NextResponse.json(
      { error: 'The stars are temporarily misaligned. Please try again.' },
      { status: 500 }
    )
  }
}
