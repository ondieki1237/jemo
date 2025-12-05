import { type NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.BACKEND_URL || 'https://jemo.codewithseth.co.ke'

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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.toString()

    const res = await fetch(`${BACKEND_URL}/api/quotations${query ? `?${query}` : ''}`)
    const data = await res.json()

    return NextResponse.json(data, { status: res.status })
  } catch (error) {
    console.error('Error fetching quotations:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch quotations' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateQuotationRequest = await request.json()

    const res = await fetch(`${BACKEND_URL}/api/quotations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch (error) {
    console.error('Error creating quotation:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to create quotation' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Quotation ID is required' },
        { status: 400 }
      )
    }

    const res = await fetch(`${BACKEND_URL}/api/quotations/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData),
    })

    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch (error) {
    console.error('Error updating quotation:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to update quotation' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Quotation ID is required' },
        { status: 400 }
      )
    }

    const res = await fetch(`${BACKEND_URL}/api/quotations/${id}`, {
      method: 'DELETE',
    })

    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch (error) {
    console.error('Error deleting quotation:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to delete quotation' },
      { status: 500 }
    )
  }
}
