import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://jemo.codewithseth.co.ke'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Forward request to backend
    const response = await fetch(`${BACKEND_URL}/api/quotations/${id}/pdf`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/pdf',
      },
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to generate PDF' },
        { status: response.status }
      )
    }

    // Get PDF buffer from backend
    const pdfBuffer = await response.arrayBuffer()

    // Return PDF with proper headers
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="quotation-${id}.pdf"`,
      },
    })
  } catch (error) {
    console.error('Error fetching PDF:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
