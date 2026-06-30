import Razorpay from 'razorpay'
import { NextRequest, NextResponse } from 'next/server'

// Server-side price catalog. Amounts are NEVER taken from the client — the client
// only sends a product key, so the price can't be tampered with.
const PRODUCTS: Record<string, { amount: number; receipt: string }> = {
  reading: { amount: 4900, receipt: 'jyotish_reading' },        // ₹49 full reading
  astrologer: { amount: 49900, receipt: 'jyotish_astrologer' }, // ₹499 live astrologer
}

export async function POST(request: NextRequest) {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    return NextResponse.json(
      { error: 'Razorpay keys not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to .env.local.' },
      { status: 500 }
    )
  }

  try {
    // Missing product → default to 'reading' (back-compat for callers that send no body).
    // Present-but-invalid product → fail loudly, never silently mischarge.
    const body = await request.json().catch(() => ({}))
    const requested = body?.product
    if (requested != null && !PRODUCTS[requested as string]) {
      return NextResponse.json(
        { error: `Unknown product: ${String(requested)}. Valid products: ${Object.keys(PRODUCTS).join(', ')}.` },
        { status: 400 }
      )
    }
    const product = (requested as string) ?? 'reading'
    const { amount, receipt } = PRODUCTS[product]

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    })

    const order = await razorpay.orders.create({
      amount,
      currency: 'INR',
      receipt,
    })

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    })
  } catch (error) {
    console.error('Razorpay create-order error:', error)
    return NextResponse.json(
      { error: 'Failed to create payment order. Please try again.' },
      { status: 500 }
    )
  }
}
