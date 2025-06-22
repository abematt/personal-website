import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Verify webhook secret (recommended)
    const secret = request.nextUrl.searchParams.get('secret')
    if (secret !== process.env.REVALIDATE_SECRET) {
      return NextResponse.json({ message: 'Invalid secret' }, { status: 401 })
    }

    // Revalidate blog index
    revalidatePath('/blog')
    
    // If specific post, revalidate that too
    if (body.slug) {
      revalidatePath(`/blog/${body.slug}`)
    }

    return NextResponse.json({ revalidated: true })
  } catch (err) {
    return NextResponse.json(
      { message: 'Error revalidating' },
      { status: 500 }
    )
  }
} 