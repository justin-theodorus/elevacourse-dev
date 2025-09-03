import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(request) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    return NextResponse.redirect(`${request.nextUrl.origin}/error`);
  }

  return NextResponse.redirect(`${request.nextUrl.origin}/`);
}
