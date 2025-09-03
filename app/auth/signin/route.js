import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(request) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${request.nextUrl.origin}/auth/callback`,
    },
  });

  if (error) {
    return NextResponse.redirect(`${request.nextUrl.origin}/error`);
  }

  return NextResponse.redirect(data.url);
}
