import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabaseServer'

export default async function CoursePage({ params, searchParams }) {
  const supabase = await createClient()
  const id = (await params)?.id

  if (!id) return notFound()

  const { data: course, error: courseErr } = await supabase
    .from('courses')
    .select('id, title, subtitle, description, level, tags')
    .eq('id', id)
    .single()

  if (courseErr || !course) return notFound()

  const { data: lessons, error: lessonsErr } = await supabase
    .from('lessons')
    .select('id, idx, title')
    .eq('course_id', id)
    .order('idx', { ascending: true })

  if (lessonsErr) return notFound()

  const pathParam = (await searchParams)?.get ? (await searchParams).get('path') : (await searchParams)?.path
  const backHref = pathParam ? `/paths/${pathParam}` : '/builder'

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <a className="text-sm underline" href={backHref}>&larr; Back to your learning path</a>
      <div>
        <h1 className="text-3xl font-semibold">{course.title}</h1>
        {course.subtitle && (
          <p className="text-lg opacity-80 mt-1">{course.subtitle}</p>
        )}
      </div>

      <div className="prose max-w-none whitespace-pre-wrap">{course.description}</div>

      {!!(lessons?.length) && (
        <div>
          <h2 className="text-xl font-medium mb-2">Lessons</h2>
          <ul className="space-y-2">
            {lessons.map((l) => (
              <li key={l.id} className="flex items-center justify-between border rounded p-3">
                <div className="font-medium">Lesson {l.idx}: {l.title}</div>
                <a className="px-3 py-1 rounded border" href={pathParam ? `/lessons/${l.id}?path=${pathParam}` : `/lessons/${l.id}`}>Open</a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}


