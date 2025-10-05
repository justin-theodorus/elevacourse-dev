import { NextResponse } from 'next/server';
import { supabaseUserFromRoute } from '@/lib/supabaseServer';

export async function GET(req) {
  try {
    const sb = await supabaseUserFromRoute();

    const {
      data: { user },
      error: authErr,
    } = await sb.auth.getUser();
    if (authErr || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const includeItems = searchParams.get('include') === 'items';

    const select = includeItems
      ? 'id, user_prompt, title, created_at, updated_at, path_items(*)'
      : 'id, user_prompt, title, created_at, updated_at';

    const { data, error } = await sb
      .from('learning_paths')
      .select(select)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (includeItems) {
      const sorted = (data ?? []).map((p) => ({
        ...p,
        path_items: (p.path_items ?? []).sort((a, b) => a.idx - b.idx),
      }));
      return NextResponse.json(sorted);
    }

    return NextResponse.json(data ?? []);
  } catch (e) {
    return NextResponse.json({ error: e.message || 'Internal error' }, { status: 500 });
  }
}


