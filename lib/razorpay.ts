// Shared Razorpay checkout flow, extracted from the original LockedSection logic so
// both the paid reading and the "Talk to a real astrologer" flow reuse one code path.

export type CheckoutStage = 'creating-order' | 'awaiting-payment' | 'verifying'

export interface CheckoutOptions {
  product: 'reading' | 'astrologer' // server maps this to a price; client never sends an amount
  description: string
  onStage?: (stage: CheckoutStage) => void
  onSuccess: () => void
  onError: (message: string) => void
  onDismiss?: () => void
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (document.getElementById('razorpay-sdk')) { resolve(true); return }
    const script = document.createElement('script')
    script.id = 'razorpay-sdk'
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

export async function startRazorpayCheckout(opts: CheckoutOptions) {
  const { product, description, onStage, onSuccess, onError, onDismiss } = opts
  try {
    onStage?.('creating-order')
    const orderRes = await fetch('/api/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product }),
    })
    if (!orderRes.ok) {
      const data = await orderRes.json().catch(() => ({}))
      throw new Error(data.error || 'Failed to create payment order.')
    }
    const { orderId, amount, currency, keyId } = await orderRes.json()

    onStage?.('awaiting-payment')
    const loaded = await loadRazorpayScript()
    if (!loaded) throw new Error('Could not load payment gateway. Check your connection.')

    await new Promise<void>((resolve) => {
      const rzp = new window.Razorpay({
        key: keyId,
        amount,
        currency,
        name: 'JyotishAI',
        description,
        order_id: orderId,
        theme: { color: '#C9A84C' },
        handler: async (response) => {
          onStage?.('verifying')
          try {
            const verifyRes = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            })
            const verifyData = await verifyRes.json()
            if (verifyData.success) {
              onSuccess()
            } else {
              throw new Error('Payment verification failed. Please contact support.')
            }
          } catch (err) {
            onError(err instanceof Error ? err.message : 'Payment failed. Please try again.')
          } finally {
            resolve()
          }
        },
        modal: { ondismiss: () => { onDismiss?.(); resolve() } },
      })
      rzp.open()
    })
  } catch (err) {
    onError(err instanceof Error ? err.message : 'Payment failed. Please try again.')
  }
}
