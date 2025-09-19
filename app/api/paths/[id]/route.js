import { NextResponse } from 'next/server';
import { supabaseUserFromRoute } from '@/lib/supabaseServer';

export async function GET(req, ctx) {
  try {
    const { id } = await ctx.params;

    const sb = await supabaseUserFromRoute();

    const { data, error } = await sb
      .from('learning_paths')
      .select('id, user_prompt, title, created_at, path_items(*)')
      .eq('id', id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: error?.message || 'Not found' }, { status: 404 });
    }

    // keep items ordered
    const items = (data.path_items ?? []).sort((a, b) => a.idx - b.idx);

    return NextResponse.json({ ...data, path_items: items });
  } catch (e) {
    return NextResponse.json({ error: e.message || 'Internal error' }, { status: 500 });
  }
}
