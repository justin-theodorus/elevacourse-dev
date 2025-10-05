import { NextResponse } from 'next/server'
import { supabaseUserFromRoute } from '@/lib/supabaseServer'

export async function GET() {
  try {
    const sb = await supabaseUserFromRoute()

    const {
      data: { user },
      error: authErr,
    } = await sb.auth.getUser()

    if (authErr || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
