import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getUserIdOrThrow, supabaseAdmin, supabaseUserFromRoute } from '@/lib/supabaseServer';
import { callWriterLLM, embed } from '@/lib/llm';

const Body = z.object({
  path_id: z.string().uuid(),
  idx: z.number().int().min(1),
  new_title: z.string().min(3),
  prompt: z.string().min(5),
});

function buildEmbedDoc(courseRow, lessonsRows) {
  const header = [courseRow.title, courseRow.subtitle, courseRow.description]
    .filter(Boolean)
    .join(' — ');
  const lessonsText = [...lessonsRows]
    .sort((a, b) => a.idx - b.idx)
    .map((l) => `Lesson ${l.idx}: ${l.title}\n${l.content}`)
    .join('\n\n');
  return `${header}\n\n${lessonsText}`.trim();
}
function preview(text, n = 300) {
  const t = text.replace(/\s+/g, ' ').trim();
  return t.length <= n ? t : `${t.slice(0, n)}…`;
}

export async function POST(req) {
  let parsedBody = null;

  try {
    // 0) Parse & auth
    const json = await req.json();
    parsedBody = Body.safeParse(json);
    if (!parsedBody.success) {
      return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
    }
    const { path_id, idx, new_title, prompt } = parsedBody.data;
    const userId = await getUserIdOrThrow();

    const sbUser = await supabaseUserFromRoute(); // RLS client (must await in Next 15)
    const sb = supabaseAdmin();                   // service role

    // 1) Verify path belongs to user (defense in depth)
    const { data: path, error: pathErr } = await sbUser
      .from('learning_paths')
      .select('id, user_id')
      .eq('id', path_id)
      .single();
    if (pathErr || !path) return NextResponse.json({ error: 'Path not found' }, { status: 404 });
    if (path.user_id !== userId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    // 2) Mark item generating
    await sb
      .from('path_items')
      .update({ status: 'generating', error: null })
      .eq('path_id', path_id)
      .eq('idx', idx);

    // 3) Writer LLM → course + lessons
    const wrote = await callWriterLLM({ newTitle: new_title, prompt });
    if (!wrote.success) throw new Error('Writer JSON invalid');

    const { course, lessons } = wrote.data;

    // 4) Insert course (user-owned, public-readable)
    const { data: courseRow, error: cErr } = await sb
      .from('courses')
      .insert({
        owner: userId,
        title: course.title,
        subtitle: course.subtitle ?? null,
        description: course.description,
        level: course.level ?? null,
        tags: course.tags ?? [],
        is_public: true,
      })
      .select('id, title, subtitle, description')
      .single();
    if (cErr) throw cErr;

    // 5) Insert lessons with 1-based idx
    const lessonsRows = lessons.map((l, i) => ({
      course_id: courseRow.id,
      idx: i + 1,
      title: l.title,
      content: l.content,
    }));
    const { error: lErr } = await sb.from('lessons').insert(lessonsRows);
    if (lErr) throw lErr;

    // 6) Build doc, embed, upsert into course_embeddings
    // Use a richer signal (title + description + lesson titles) for better recall
    const doc = buildEmbedDoc(courseRow, lessonsRows);
    const richForEmbedding = [
      courseRow.title,
      courseRow.subtitle,
      courseRow.description,
      ...lessonsRows.map(l => `Lesson ${l.idx}: ${l.title}`),
    ].filter(Boolean).join('\n');
    const vec = await embed(richForEmbedding);

    const { error: embErr } = await sb.from('course_embeddings').upsert({
      course_id: courseRow.id,
      title: courseRow.title,
      description_preview: preview(doc, 300),
      embedding: vec,
    });
    if (embErr) throw embErr;

    // 7) Update path item → ready + attach course_id
    await sb
      .from('path_items')
      .update({ status: 'ready', course_id: courseRow.id })
      .eq('path_id', path_id)
      .eq('idx', idx);

    return NextResponse.json({ course_id: courseRow.id });
  } catch (e) {
    // Best-effort: mark failed if we already parsed a valid body
    try {
      if (parsedBody?.success) {
        const { path_id, idx } = parsedBody.data;
        await supabaseAdmin()
          .from('path_items')
          .update({ status: 'failed', error: (e?.message || 'Generation failed').slice(0, 1000) })
          .eq('path_id', path_id)
          .eq('idx', idx);
      }
    } catch {}
    return NextResponse.json({ error: e?.message || 'Internal error' }, { status: 500 });
  }
}
