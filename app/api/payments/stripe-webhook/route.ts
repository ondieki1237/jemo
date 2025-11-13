import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const BACKEND = process.env.BACKEND_URL || 'https://jemo.codewithseth.co.ke'

    // Forward webhook payload to backend (note: in production verify signatures before forwarding)
    const res = await fetch(`${BACKEND}/api/payments/stripe-webhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 400 })
  }
}
