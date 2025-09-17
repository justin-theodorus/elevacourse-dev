// app/api/plan/route.js
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getUserIdOrThrow, supabaseAdmin } from '@/lib/supabaseServer';
import { embed, callPlannerLLM } from '@/lib/llm';
import { searchSimilarCourses } from '@/lib/search';

const Body = z.object({ prompt: z.string().min(5) });

function autoTitleFromBrief(brief) {
  const first = String(brief || '').split(/[.\n:;!?]/)[0];
  const words = first.trim().split(/\s+/).slice(0, 6).join(' ');
  if (!words) return 'Introduction';
  return words.replace(/\b\w/g, (m) => m.toUpperCase());
}

export async function POST(req) {
  try {
    // 0) parse + auth
    const json = await req.json();
    const parsedBody = Body.safeParse(json);
    if (!parsedBody.success) {
      return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
    }
    const userId = await getUserIdOrThrow();
    const prompt = parsedBody.data.prompt;

    // 1) embed prompt + search similar
    const vec = await embed(prompt);
    // Use a lower threshold to avoid filtering out good matches (~0.5-0.6)
    const similar = await searchSimilarCourses(vec, 8, 0.3);
    try {
      console.log('[plan] similar candidates:');
      for (const c of similar) {
        console.log(' -', c.id, '|', c.title, '| score:', Number(c.score ?? 0).toFixed(3));
      }
    } catch {}

    // 2) planner LLM (now returns { raw, parsed })
    const planned = await callPlannerLLM({ userPrompt: prompt, similarCourses: similar });

    // Use parsed items if available; else try to read raw.items; else final fallback
    let items = [];
    if (planned?.parsed?.success) {
      items = planned.parsed.data.items;
    } else {
      try {
        const rawObj = JSON.parse(planned?.raw || '{}');
        if (Array.isArray(rawObj.items)) items = rawObj.items;
      } catch {}
    }
    if (!Array.isArray(items) || items.length === 0) {
      items = [{ idx: 1, type: 'new', new_title: 'Introduction', brief: prompt }];
    }
    try { console.log('[plan] planner items:', items); } catch {}

    // 3) create path
    const sb = supabaseAdmin();
    const { data: path, error: pathErr } = await sb
      .from('learning_paths')
      .insert({ user_id: userId, user_prompt: prompt, title: null })
      .select('id')
      .single();
    if (pathErr) throw pathErr;

    // 3.5) Reconcile planner 'reuse' IDs to similar-course IDs (LLM may not copy UUIDs)
    const candidateIdByIndex = new Map(similar.map((c, i) => [String(i + 1), c.id]));
    const candidateIdSet = new Set(similar.map((c) => c.id));
    const BEST_SCORE_FOR_FALLBACK = 0.55;

    items = items.map((it) => {
      if (it?.type !== 'reuse') return it;
      const raw = typeof it?.course_id === 'string' ? it.course_id.trim() : '';
      let resolved = null;
      if (candidateIdSet.has(raw)) {
        resolved = raw;
      } else if (/^\d+$/.test(raw) && candidateIdByIndex.has(raw)) {
        resolved = candidateIdByIndex.get(raw);
      } else if (similar[0] && Number(similar[0].score ?? 0) >= BEST_SCORE_FOR_FALLBACK) {
        // As a last resort, map any reuse to the top candidate if it's strong enough
        resolved = similar[0].id;
      }
      return { ...it, course_id: resolved };
    });

    // 4) validate/downgrade reuse IDs to avoid FK violations
    const reuseIds = Array.from(
      new Set(
        items
          .filter((it) => it?.type === 'reuse' && typeof it?.course_id === 'string' && it.course_id.trim())
          .map((it) => it.course_id.trim())
      )
    );

    let existingSet = new Set();
    if (reuseIds.length > 0) {
      const { data: existing, error: existErr } = await sb
        .from('courses')
        .select('id')
        .in('id', reuseIds);
      if (!existErr && Array.isArray(existing)) {
        existingSet = new Set(existing.map((r) => r.id));
      }
    }

    // 5) sanitize + normalize rows
    const seen = new Set();
    const reusedInThisPath = new Set();
    let rows = items
      .map((it) => {
        const idx = Math.max(1, Number(it?.idx || 1));
        let type = it?.type === 'reuse' ? 'reuse' : 'new';
        let course_id =
          type === 'reuse' && typeof it?.course_id === 'string' && existingSet.has(it.course_id)
            ? it.course_id
            : null;

        if (type === 'reuse' && !course_id) type = 'new';
        // Prevent reusing the same course more than once within a single path
        if (type === 'reuse' && course_id) {
          if (reusedInThisPath.has(course_id)) {
            try { console.log('[plan] duplicate reuse detected for', course_id, '→ converting to new'); } catch {}
            type = 'new';
            course_id = null;
          } else {
            reusedInThisPath.add(course_id);
          }
        }

        return {
          path_id: path.id,
          idx,
          type,
          new_title:
            type === 'new'
              ? (it?.new_title && String(it.new_title).trim()) || autoTitleFromBrief(it?.brief)
              : null,
          course_id, // may be null
          note: it?.brief || '',
          status: type === 'reuse' ? 'ready' : 'pending',
        };
      })
      .filter((row) => {
        if (seen.has(row.idx)) return false; // dedupe duplicate idx
        seen.add(row.idx);
        return true;
      });

    // 5.1) Enforce reuse of strongest match if planner omitted it
    const ENFORCE_REUSE_MIN_SCORE = 0.55;
    const best = Array.isArray(similar) && similar[0];
    if (best && Number(best.score ?? 0) >= ENFORCE_REUSE_MIN_SCORE) {
      const alreadyReusesBest = rows.some((r) => r.type === 'reuse' && r.course_id === best.id);
      if (!alreadyReusesBest) {
        try { console.log('[plan] enforcing top reuse for', best.id, best.title, best.score); } catch {}
        rows = [
          {
            path_id: path.id,
            idx: 1,
            type: 'reuse',
            new_title: null,
            course_id: best.id,
            note: `Reusing similar course: ${best.title}`,
            status: 'ready',
          },
          ...rows.map((r) => ({ ...r, idx: r.idx + 1 })),
        ];
      }
    }
    try { console.log('[plan] normalized rows:', rows.map(r => ({ idx: r.idx, type: r.type, course_id: r.course_id, new_title: r.new_title, status: r.status }))); } catch {}

    // 6) insert items
    const { error: itemsErr } = await sb.from('path_items').insert(rows);
    if (itemsErr) throw itemsErr;

    // 7) response
    return NextResponse.json({
      path_id: path.id,
      redirect: `/paths/${path.id}`,
      items: rows.map(({ idx, type, course_id, new_title, note, status }) => ({
        idx,
        type,
        course_id,
        new_title,
        note,
        status,
      })),
    });
  } catch (e) {
    console.error('[api/plan] error:', e);
    const msg = e?.message || 'Internal error';
    return NextResponse.json({ error: msg }, { status: msg === 'Unauthorized' ? 401 : 500 });
  }
}
