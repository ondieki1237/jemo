import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const BACKEND = process.env.BACKEND_URL || 'https://jemo.codewithseth.co.ke'
    const res = await fetch(`${BACKEND}/api/analytics`)
    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch (error) {
    console.error('Error fetching analytics (proxy):', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
