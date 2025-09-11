import 'dotenv/config';
import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY 
);

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// ---- Demo payload (2–3 courses) ----
const DEMO = [
  {
    title: 'Intro to Python for Data Analysis',
    subtitle: 'From basics to pandas',
    description:
      'Learn Python syntax, data structures, and get hands-on with data analysis using pandas and simple plots.',
    level: 'beginner',
    tags: ['python', 'data', 'pandas'],
    is_public: true,
    lessons: [
      { idx: 1, title: 'Python Basics', content: 'Variables, types, control flow, functions.' },
      { idx: 2, title: 'Data Structures', content: 'Lists, dicts, sets, tuples; iteration patterns.' },
      { idx: 3, title: 'Pandas Intro', content: 'Series, DataFrame, reading CSV, basic transforms, describe().' },
      { idx: 4, title: 'Exploratory Analysis', content: 'Filtering, groupby, simple charts, insights.' },
    ],
  },
  {
    title: 'Relational Databases with SQL',
    subtitle: 'Queries, joins, and modeling',
    description:
      'A practical introduction to SQL, normalization, joins, aggregation, and indexing for performance.',
    level: 'beginner',
    tags: ['sql', 'database', 'postgres'],
    is_public: true,
    lessons: [
      { idx: 1, title: 'SELECT Basics', content: 'SELECT, WHERE, ORDER BY, LIMIT.' },
      { idx: 2, title: 'JOINs', content: 'INNER, LEFT, RIGHT, FULL; joining tables effectively.' },
      { idx: 3, title: 'Aggregation', content: 'GROUP BY, HAVING, window functions basics.' },
      { idx: 4, title: 'Modeling & Indexes', content: 'Normalization, keys, indexes, query plans.' },
    ],
  },
  {
    title: 'JavaScript Foundations',
    subtitle: 'ES fundamentals for the web',
    description:
      'Master core JavaScript: values, functions, async, and the DOM. Build confidence to move into frameworks.',
    level: 'beginner',
    tags: ['javascript', 'web', 'frontend'],
    is_public: true,
    lessons: [
      { idx: 1, title: 'JS Basics', content: 'Primitives, objects, arrays, let/const, scope.' },
      { idx: 2, title: 'Functions & Modules', content: 'Declaration, arrow functions, exports/imports.' },
      { idx: 3, title: 'Async Patterns', content: 'Callbacks, promises, async/await, fetch API.' },
      { idx: 4, title: 'DOM & Events', content: 'Selecting nodes, event listeners, manipulating the DOM.' },
    ],
  },
];

// ---- Helpers ----
function buildEmbedText(course) {
  const header = [course.title, course.subtitle, course.description].filter(Boolean).join(' — ');
  const lessonsText = course.lessons
    .sort((a, b) => a.idx - b.idx)
    .map((l) => `Lesson ${l.idx}: ${l.title}\n${l.content}`)
    .join('\n\n');
  return `${header}\n\n${lessonsText}`.trim();
}

function preview(text, n = 300) {
  const t = text.replace(/\s+/g, ' ').trim();
  return t.length <= n ? t : `${t.slice(0, n)}…`;
}

async function embed(text) {
  const res = await openai.embeddings.create({
    model: 'text-embedding-3-small', // 1536 dims
    input: text,
  });
  return res.data[0]?.embedding || null;
}

// ---- Main ----
async function run() {
  console.log('Seeding demo courses as library content (owner = NULL)…');

  const createdCourseIds = [];

  for (const c of DEMO) {
    // 1) Insert course
    const { data: courseRow, error: courseErr } = await supabase
      .from('courses')
      .insert({
        owner: null, // library/global
        title: c.title,
        subtitle: c.subtitle || null,
        description: c.description,
        level: c.level,
        tags: c.tags || [],
        is_public: c.is_public ?? true,
      })
      .select('id')
      .single();

    if (courseErr) {
      console.error('Failed inserting course', c.title, courseErr.message);
      continue;
    }

    const course_id = courseRow.id;
    createdCourseIds.push(course_id);

    // 2) Insert lessons
    const lessonsPayload = c.lessons.map((l) => ({
      course_id,
      idx: l.idx,
      title: l.title,
      content: l.content,
    }));

    const { error: lessonsErr } = await supabase.from('lessons').insert(lessonsPayload);
    if (lessonsErr) {
      console.error('Failed inserting lessons for', c.title, lessonsErr.message);
      continue;
    }

    // 3) Build doc & embedding
    const doc = buildEmbedText(c);
    const vec = await embed(doc);
    if (!vec) {
      console.error('Embedding failed for', c.title);
      continue;
    }

    // 4) Upsert into course_embeddings
    const { error: embErr } = await supabase.from('course_embeddings').upsert({
      course_id,
      title: c.title,
      description_preview: preview(doc, 300),
      embedding: vec,
    });

    if (embErr) {
      console.error('Failed upserting embedding for', c.title, embErr.message);
      continue;
    }

    console.log('Seeded:', c.title, '→', course_id);
  }

  console.log('\n=== CREATED COURSE IDS ===');
  createdCourseIds.forEach((id) => console.log(id));
  console.log('==========================\n');

  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
