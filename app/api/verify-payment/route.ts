import crypto from 'crypto'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  if (!process.env.RAZORPAY_KEY_SECRET) {
    return NextResponse.json(
      { error: 'Razorpay secret not configured.' },
      { status: 500 }
    )
  }

  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      await request.json() as {
        razorpay_order_id: string
        razorpay_payment_id: string
        razorpay_signature: string
      }

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { success: false, error: 'Missing payment fields.' },
        { status: 400 }
      )
    }

    // Razorpay signature = HMAC-SHA256(order_id + "|" + payment_id, key_secret)
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex')

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ success: false }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Razorpay verify-payment error:', error)
    return NextResponse.json(
      { success: false, error: 'Verification failed.' },
      { status: 500 }
    )
  }
}
