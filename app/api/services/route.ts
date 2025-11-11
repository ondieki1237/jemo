import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const BACKEND = process.env.BACKEND_URL || 'http://localhost:4000'
    const res = await fetch(`${BACKEND}/api/services`)
    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch (error) {
    console.error('Error fetching services (proxy):', error)
    return NextResponse.json({ services: [] })
  }
}
