import { type NextRequest, NextResponse } from "next/server"

interface LineItem {
  description: string
  quantity: number
  unitPrice: number
}

interface CreateQuotationRequest {
  requestId: string
  clientEmail: string
  lineItems: LineItem[]
  discount?: number
  notes?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateQuotationRequest = await request.json()
  const BACKEND = process.env.BACKEND_URL || 'https://jemo.codewithseth.co.ke'

    const res = await fetch(`${BACKEND}/api/quotations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch (error) {
    console.error('Error creating quotation (proxy):', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
