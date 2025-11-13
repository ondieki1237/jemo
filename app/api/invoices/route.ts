import { type NextRequest, NextResponse } from "next/server"

interface CreateInvoiceRequest {
  quotationId: string
  amount: number
  dueDate: string
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateInvoiceRequest = await request.json()
    const BACKEND = process.env.BACKEND_URL || 'https://jemo.codewithseth.co.ke'

    const res = await fetch(`${BACKEND}/api/invoices`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch (error) {
    console.error('Error creating invoice (proxy):', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const BACKEND = process.env.BACKEND_URL || 'http://localhost:4000'
    const res = await fetch(`${BACKEND}/api/invoices`)
    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch (error) {
    console.error('Error fetching invoices (proxy):', error)
    return NextResponse.json({ invoices: [] })
  }
}
