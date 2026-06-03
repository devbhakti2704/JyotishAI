import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json() as { email?: string }

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Please provide a valid email address.' }, { status: 400 })
    }

    // TODO: Connect a real email service here (e.g. Mailchimp, Resend, ConvertKit)
    // For now we just log so no subscriber data is silently lost
    console.log(`[JyotishAI subscriber] ${new Date().toISOString()} — ${email}`)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Subscribe route error:', error)
    return NextResponse.json({ error: 'Could not save subscription. Please try again.' }, { status: 500 })
  }
}
