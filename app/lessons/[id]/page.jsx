import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabaseServer'

export default async function LessonPage({ params, searchParams }) {
  const supabase = await createClient()
  const id = (await params)?.id
  if (!id) return notFound()

  const { data: lesson, error } = await supabase
    .from('lessons')
    .select('id, course_id, idx, title, content')
    .eq('id', id)
    .single()

  if (error || !lesson) return notFound()

  const pathParam = (await searchParams)?.get ? (await searchParams).get('path') : (await searchParams)?.path
  const backHref = pathParam && lesson?.course_id
    ? `/courses/${lesson.course_id}?path=${pathParam}`
    : `/courses/${lesson?.course_id || ''}`

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <a className="text-sm underline" href={backHref}>&larr; Back to course</a>
      <h1 className="text-2xl font-semibold">Lesson {lesson.idx}: {lesson.title}</h1>
      <article className="prose max-w-none whitespace-pre-wrap">{lesson.content}</article>
    </div>
  )
}


