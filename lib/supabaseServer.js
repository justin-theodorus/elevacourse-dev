// lib/supabaseServer.js
import { createClient as createSupabaseAdminClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

export function supabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return createSupabaseAdminClient(url, key, { auth: { persistSession: false } });
}

export async function supabaseUserFromRoute() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get: async (name) => cookieStore.get(name)?.value,
        set: async (name, value, options) => {
          cookieStore.set(name, value, options);
        },
        remove: async (name, options) => {
          cookieStore.delete(name, options);
        },
      },
    }
  );
}

// Compatibility helper to match utils/supabase/server API
export async function createClient() {
  return await supabaseUserFromRoute();
}

export async function getUserIdOrThrow() {
  const supabase = await supabaseUserFromRoute();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user?.id) throw new Error('Unauthorized');
  return data.user.id;
}
