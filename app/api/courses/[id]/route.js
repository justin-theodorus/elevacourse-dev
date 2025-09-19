import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabaseServer';

export async function GET(_req, { params }) {
  const supabase = await createClient();
  const id = params?.id;

  if (!id) {
    return NextResponse.json({ error: 'Missing course id' }, { status: 400 });
  }

  // Fetch course
  const { data: course, error: courseErr } = await supabase
    .from('courses')
    .select(
      'id, owner, title, subtitle, description, level, tags, is_public, created_at, updated_at'
    )
    .eq('id', id)
    .single();

  if (courseErr?.code === 'PGRST116' || !course) {
    // PostgREST "Row not found" or RLS denied
    return NextResponse.json({ error: 'Course not found' }, { status: 404 });
  }
  if (courseErr) {
    return NextResponse.json({ error: courseErr.message }, { status: 500 });
  }

  // Fetch lessons ordered by idx
  const { data: lessons, error: lessonsErr } = await supabase
    .from('lessons')
    .select('id, course_id, idx, title, content, created_at, updated_at')
    .eq('course_id', course.id)
    .order('idx', { ascending: true });

  if (lessonsErr) {
    return NextResponse.json({ error: lessonsErr.message }, { status: 500 });
  }

  return NextResponse.json({ course, lessons: lessons ?? [] });
}
