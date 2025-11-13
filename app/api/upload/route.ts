import { NextResponse } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL || 'https://jemo.codewithseth.co.ke'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    
    const res = await fetch(`${BACKEND_URL}/api/upload/image`, {
      method: 'POST',
      body: formData,
    })
    
    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch (error) {
    console.error('Error uploading image:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to upload image' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const publicId = searchParams.get('publicId')
    
    if (!publicId) {
      return NextResponse.json(
        { success: false, message: 'Public ID is required' },
        { status: 400 }
      )
    }
    
    const res = await fetch(`${BACKEND_URL}/api/upload/image/${publicId}`, {
      method: 'DELETE',
    })
    
    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch (error) {
    console.error('Error deleting image:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to delete image' },
      { status: 500 }
    )
  }
}
