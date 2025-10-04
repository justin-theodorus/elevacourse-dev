// lib/llm.js
import { z } from 'zod';
import OpenAI from 'openai';
import { createOpenAI } from '@ai-sdk/openai';
import { generateText, zodSchema } from 'ai';

export const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
export const LLM_MODEL = process.env.LLM_MODEL || 'gpt-4o-mini';
const openaiSDK = createOpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function embed(text) {
  const res = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text,
  });
  return res.data[0].embedding;
}

function stripCodeFences(s = '') {
  const t = s.trim();
  if (t.startsWith('```')) {
    const noHead = t.replace(/^```[a-zA-Z0-9_-]*\s*\n?/, '');
    return noHead.replace(/```$/, '').trim();
  }
  return t;
}
function extractFirstJsonObject(s = '') {
  const start = s.indexOf('{');
  if (start === -1) return null;
  let depth = 0;
  let inString = false;
  let prev = '';
  for (let i = start; i < s.length; i++) {
    const ch = s[i];
    if (inString) {
      if (ch === '"' && prev !== '\\') inString = false;
    } else {
      if (ch === '"') inString = true;
      else if (ch === '{') depth++;
      else if (ch === '}') {
        depth--;
        if (depth === 0) return s.slice(start, i + 1);
      }
    }
    prev = ch;
  }
  return null;
}
function tryParseRelaxedJson(s = '') {
  if (!s) return null;
  let candidate = stripCodeFences(s)
    .replace(/^\uFEFF/, '')           // strip BOM if present
    .replace(/,\s*([}\]])/g, '$1');   // remove trailing commas
  try { return JSON.parse(candidate); } catch {}
  const extracted = extractFirstJsonObject(candidate);
  if (extracted) { try { return JSON.parse(extracted); } catch {} }
  return null;
}
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

export const PlannerItem = z.object({
  idx: z.number().int().min(1),
  type: z.enum(['reuse', 'new']),
  course_id: z.union([z.string().trim(), z.null()]).optional().default(null),
  new_title: z.string().min(3).optional().default('Introduction'),
  brief: z.string().min(10),
});

export const PlannerResponse = z.object({ items: z.array(PlannerItem).min(1) });

export const WriterLesson = z.object({
  title: z.string(),
  content: z.string().min(80),
});
export const WriterResponse = z.object({
  course: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    description: z.string().min(50),
    level: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
    tags: z.array(z.string()).optional(),
  }),
  lessons: z.array(WriterLesson).min(3),
});

const OutlineLesson = z.object({
  title: z.string(),
  // allow a short blurb or even empty; we'll expand later
  content: z.string().min(0).optional().default(''),
});

const WriterOutline = z.object({
  course: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    description: z.string().min(50), // outline can still require a decent course description
    level: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
    tags: z.array(z.string()).optional(),
  }),
  lessons: z.array(OutlineLesson).min(4),
});

const LessonDraft = z.object({
  title: z.string(),
  content: z.string().min(800),
});



export async function callPlannerLLM({ userPrompt, similarCourses }) {
  const sys = `You are a course planner. Reply with ONLY valid JSON and nothing else.
Return exactly this shape:
{"items":[{"idx":number>=1,"type":"reuse"|"new","course_id":string|null,"new_title":string|null,"brief":string}]}
Rules:
- Prefer reusing high-score similar courses when relevant (use their IDs exactly as provided).
- If type="reuse": set "course_id" to a provided course id and "new_title" to null.
- If type="new": set "course_id" to null and ALWAYS provide a concise "new_title" (3-6 words).
- Produce 6-8 items in a coherent order using 1-based idx.
- Reuse at most ONCE per course_id. Never include the same course_id twice.`;

  const ctx =
    'Similar courses (id | title | subtitle | description | score):\n' +
    similarCourses
      .map(
        (c) =>
          `- ${c.id} | ${c.title} | ${c.subtitle ?? ''} | ${c.description ?? ''} | ${c.score ?? ''}`
      )
      .join('\n');

  const user = `User prompt: ${userPrompt}\nPlan the path now.`;

  try {
    const result = await generateText({
      model: openaiSDK.chat(LLM_MODEL),
      temperature: 0.2,
      messages: [
        { role: 'system', content: sys },
        { role: 'user', content: ctx },
        { role: 'user', content: user },
      ],
      schema: zodSchema(PlannerResponse),
    });

    // Prefer SDK-parsed object, else parse the text.
    let obj = result.object ?? null;
    if (!obj && result.text) {
      try { obj = JSON.parse(result.text); } catch {}
    }

    // Validate with Zod; always return { raw, parsed }
    const raw = result.text ?? (obj ? JSON.stringify(obj) : '');
    if (process.env.NODE_ENV !== 'production') console.log('[planner raw]', raw);

    const parsed = (() => {
      try { return PlannerResponse.safeParse(obj ?? JSON.parse(raw || '{}')); }
      catch { return { success: false, error: new Error('Invalid JSON') }; }
    })();

    return { raw, parsed };
  } catch (err) {
    // Hard failure path — still try to surface something useful
    let raw = '';
    try {
      raw =
        err?.response?.messages?.[err.response.messages.length - 1]?.content ??
        err?.value ?? err?.message ?? '';
    } catch {}
    if (process.env.NODE_ENV !== 'production') console.log('[planner raw]', raw);

    let parsed;
    try { parsed = PlannerResponse.safeParse(JSON.parse(raw || '{}')); }
    catch { parsed = { success: false, error: new Error('Invalid JSON') }; }

    return { raw, parsed };
  }
}


export async function callWriterLLM({ newTitle, prompt, options = {} }) {
  const {
    minWords = 900,
    maxLessons = 10,
    parallel = 2,
  } = options;

  console.log('[Writer] START new course:', newTitle);

  // -------------------------
  // PASS A: Outline (course + lesson titles, short blurbs OK)
  // -------------------------
  const sysA = `You are an expert course writer. Output ONLY JSON:
{
  "course": {
    "title": string, "subtitle"?: string, "description": string,
    "level"?: "beginner"|"intermediate"|"advanced", "tags"?: string[]
  },
  "lessons": [{ "title": string, "content"?: string }]
}
Rules:
- Lessons are TEXT ONLY (no images).
- In this outline pass, "lessons[*].content" may be very short (or omitted).
- Provide 4–10 lessons, coherent progression.
- Course description should be ~120–200 words.`;

  const userA = `Create a course titled "${newTitle}".
Context/brief:
${prompt}
Return JSON only.`;

  let outline;
  try {
    console.log('[Writer] Requesting OUTLINE from LLM...');
    const resA = await generateText({
      model: openaiSDK.chat(LLM_MODEL),
      temperature: 0.3,
      messages: [
        { role: 'system', content: sysA },
        { role: 'user', content: userA },
      ],
      schema: zodSchema(WriterOutline), // lenient outline schema
    });

    const rawA = resA.text ?? '';
    const objA = resA.object ?? (rawA ? tryParseRelaxedJson(rawA) : null);
    const parsedA = WriterOutline.safeParse(objA ?? {});
    if (!parsedA.success) {
      console.error('[Writer] Outline schema parse FAILED. Raw text (first 800 chars):\n', rawA.slice(0, 800));
      console.error('[Writer] Zod error:', parsedA.error);
      return { success: false, error: 'Writer outline failed schema validation' };
    }
    outline = parsedA.data;
    console.log('[Writer] Outline OK. Lesson count:', outline.lessons.length);
    console.log('[Writer] Lesson titles:', outline.lessons.map(l => l.title));
  } catch (err) {
    console.error('[Writer] ERROR during OUTLINE generation:', err);
    return { success: false, error: err?.message || 'Writer outline failed' };
  }

  if (!outline?.lessons?.length) {
    console.error('[Writer] No lessons returned in outline');
    return { success: false, error: 'No lessons produced in outline.' };
  }

  const lessonsOutline = outline.lessons.slice(0, maxLessons);

  // -------------------------
  // PASS B: Expand each lesson to full content (robust)
  // -------------------------
  const LessonDraft = z.object({
    title: z.string(),
    content: z.string().min(800), // enforce long content per lesson
  });

  const sysB = (title) => `You are a careful instructional writer.
Write a complete, self-contained lesson for the topic "${title}".
Return ONLY JSON matching exactly: {"title": string, "content": string}
Your entire response MUST be a single minified JSON object, with NO code fences, NO extra keys, NO trailing commas, and NO text before/after the JSON.

Requirements:
- Minimum ~${minWords} words of clear, accurate text.
- Use Markdown with structured sections and subheadings (##, ###).
- Start with a short overview, then sections for key concepts, examples, and a short practice/exercise.
- If code is relevant, include fenced code blocks.
- Self-contained (no "as covered earlier").
- No images. No links.`;

  async function expandOneOnce(title, brief, idx, attempt) {
    const userB = `Lesson title: "${title}"
Short brief/context: ${brief || 'N/A'}
Write the full lesson now and return JSON only.`;

    const temp = attempt === 1 ? 0.4 : 0.35;

    const resB = await generateText({
      model: openaiSDK.chat(LLM_MODEL),
      temperature: temp,
      messages: [
        { role: 'system', content: sysB(title) },
        { role: 'user', content: userB },
      ],
      schema: zodSchema(LessonDraft),
    });

    const rawB = resB.text ?? '';
    let objB = resB.object ?? tryParseRelaxedJson(rawB);

    const parsedB = LessonDraft.safeParse(objB ?? {});
    if (!parsedB.success) {
      console.error(`[Writer] Lesson ${idx + 1} schema parse FAILED (attempt ${attempt}). Raw text (first 800 chars):\n`, rawB.slice(0, 800));
      console.error(`[Writer] Lesson ${idx + 1} Zod error (attempt ${attempt}):`, parsedB.error);
      return null;
    }
    return parsedB.data;
  }

  const expandOne = async (title, brief, idx) => {
    console.log(`[Writer] Expanding lesson ${idx + 1}/${lessonsOutline.length}: ${title}`);

    let data = null;
    try {
      data = await expandOneOnce(title, brief, idx, 1);
    } catch (err) {
      console.error(`[Writer] ERROR expanding lesson ${idx + 1} (attempt 1):`, err);
    }

    if (!data) {
      await sleep(600); // small backoff helps with truncation/limits
      try {
        data = await expandOneOnce(title, brief, idx, 2);
      } catch (err) {
        console.error(`[Writer] ERROR expanding lesson ${idx + 1} (attempt 2):`, err);
      }
    }

    if (data) {
      console.log(`[Writer] Lesson ${idx + 1} expanded successfully`);
      return data;
    }

    console.warn(`[Writer] Lesson ${idx + 1} falling back to placeholder`);
    return {
      title,
      content: `## ${title}\n\n*(Placeholder due to generation error.)*\n\n${brief || ''}`,
    };
  };

  // throttle parallelism
  const chunks = [];
  for (let i = 0; i < lessonsOutline.length; i += parallel) {
    chunks.push(lessonsOutline.slice(i, i + parallel));
  }

  const expanded = [];
  for (const batch of chunks) {
    const results = await Promise.all(
      batch.map((l, i) => expandOne(l.title, l.content, expanded.length + i))
    );
    expanded.push(...results);
  }

  console.log('[Writer] All lessons expanded. Validating final payload...');

  // Final payload must match your original WriterResponse
  const final = {
    course: outline.course,
    lessons: expanded.map((l, idx) => ({
      title: l.title || lessonsOutline[idx]?.title || `Lesson ${idx + 1}`,
      content: l.content,
    })),
  };

  const checked = WriterResponse.safeParse(final);
  if (!checked.success) {
    console.error('[Writer] Final payload failed schema validation:', checked.error);
    return { success: false, error: 'Final writer payload failed validation.' };
  }

  console.log('[Writer] Completed successfully');
  return { success: true, data: checked.data };
}




