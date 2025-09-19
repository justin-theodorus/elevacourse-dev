import { supabaseAdmin } from './supabaseServer';

export async function searchSimilarCourses(embedding, topK = 8, scoreMin = 0.3) {
  const sb = supabaseAdmin();

  const { data: matches, error: rpcErr } = await sb.rpc('match_courses', {
    query_embedding: embedding,
    match_count: topK,
    min_score: 0.0, 
  });
  if (rpcErr) throw rpcErr;

  try {
    console.log('[search] raw matches count:', Array.isArray(matches) ? matches.length : 0);
    const dbg = (Array.isArray(matches) ? matches : []).map(m => ({ id: m.course_id, score: Number(m.score ?? 0) }))
    console.log('[search] raw matches ids:', dbg);
  } catch {}

  const m = Array.isArray(matches) ? matches : [];
  if (m.length === 0) return [];

  const scoreById = new Map(
    m.map(({ course_id, score }) => [course_id, typeof score === 'number' ? score : Number(score ?? 0)])
  );
  const ids = m.map((x) => x.course_id);

  // Prefer metadata directly from course_embeddings to avoid join/permissions pitfalls
  const { data: embRows, error: embErr } = await sb
    .from('course_embeddings')
    .select('course_id, title, description_preview')
    .in('course_id', ids);
  if (embErr) throw embErr;

  let coursesRows = (embRows ?? []).map((e) => ({
    id: e.course_id,
    title: e.title || null,
    subtitle: null,
    description: e.description_preview || null,
    is_public: true,
    level: null,
    tags: null,
  }));

  if (coursesRows.length === 0 && ids.length > 0) {
    // Fallback to reading from courses if embeddings metadata missing
    try {
      const { data: fallback, error: cErr } = await sb
        .from('courses')
        .select('id, title, subtitle, description, is_public, level, tags')
        .in('id', ids);
      if (!cErr && Array.isArray(fallback)) coursesRows = fallback;
    } catch {}
  }

  const joinedPreFilter = (coursesRows ?? []).map((c) => ({
    id: c.id,
    title: c.title,
    subtitle: c.subtitle ?? null,
    description: c.description ?? null,
    is_public: !!c.is_public,
    level: c.level ?? null,
    tags: c.tags ?? null,
    score: Number(scoreById.get(c.id) ?? 0),
  }));

  try {
    console.log('[search] pre-filter (by score):');
    for (const r of joinedPreFilter.sort((a,b)=>b.score-a.score)) {
      console.log(' -', r.id, '|', r.title, '| score:', r.score.toFixed(3));
    }
  } catch {}

  const result = joinedPreFilter
    .filter((c) => c.score >= scoreMin)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);

  try {
    console.log('[search] joined top results:');
    for (const r of result) {
      console.log(' -', r.id, '|', r.title, '| score:', r.score.toFixed(3));
    }
  } catch {}

  return result;
}
