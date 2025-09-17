// app/api/lessons/[id]/route.js
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabaseServer';

export async function GET(_req, { params }) {
  const supabase = await createClient();
  const id = params?.id;

  if (!id) {
    return NextResponse.json({ error: 'Missing lesson id' }, { status: 400 });
  }

  // Fetch the lesson
  const { data: lesson, error: lessonErr } = await supabase
    .from('lessons')
    .select('id, course_id, idx, title, content, created_at, updated_at')
    .eq('id', id)
    .single();

  if (lessonErr?.code === 'PGRST116' || !lesson) {
    return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
  }
  if (lessonErr) {
    return NextResponse.json({ error: lessonErr.message }, { status: 500 });
  }
  return NextResponse.json({ lesson });
}
