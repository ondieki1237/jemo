import { type NextRequest, NextResponse } from "next/server"

interface ServiceRequest {
  firstName: string
  lastName: string
  email: string
  phone: string
  company?: string
  eventDate: string
  eventTime: string
  venue: string
  city: string
  country: string
  attendees: number
  selectedServices: string[]
  eventDescription: string
  specialRequirements?: string
  budget?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: ServiceRequest = await request.json()

    // Forward request to external backend (Express + Mongo) if configured
    const BACKEND = process.env.BACKEND_URL || 'http://localhost:4000'

    const res = await fetch(`${BACKEND}/api/requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch (error) {
    console.error('Error creating request (proxy):', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const BACKEND = process.env.BACKEND_URL || 'http://localhost:4000'
    const res = await fetch(`${BACKEND}/api/requests`)
    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch (error) {
    console.error('Error fetching requests (proxy):', error)
    return NextResponse.json({ requests: [] })
  }
}
