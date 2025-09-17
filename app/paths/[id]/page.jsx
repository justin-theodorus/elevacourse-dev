import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabaseServer'
import GenerateButtonClient from '../GenerateButtonClient'

function StatusBadge ({ status }) {
  const label = String(status || '').toLowerCase() || 'pending'
  const cls =
    label === 'ready'
      ? 'bg-green-100 text-green-800'
      : label === 'generating'
        ? 'bg-yellow-100 text-yellow-800'
        : label === 'failed'
          ? 'bg-red-100 text-red-800'
          : 'bg-gray-100 text-gray-800'
  return <span className={`text-xs px-2 py-1 rounded ${cls}`}>{label}</span>
}

function TitleLine ({ item }) {
  if (item.type === 'reuse') return `Reuse existing course${item.course_title ? ` — ${item.course_title}` : item.course_id ? ` (${item.course_id})` : ''}`
  return `New → ${item.new_title || 'Untitled'}`
}

function OpenLink ({ item, pathId }) {
  if (item.status !== 'ready' || !item.course_id) return null
  const href = `/courses/${item.course_id}?path=${pathId}`
  return (
    <a className="px-3 py-1 rounded border" href={href}>Open</a>
  )
}

// client button is imported from a separate file

export default async function PathPage ({ params }) {
  const supabase = await createClient()
  const id = (await params)?.id
  if (!id) return notFound()

  const { data, error } = await supabase
    .from('learning_paths')
    .select('id, user_prompt, title, created_at, path_items(*)')
    .eq('id', id)
    .single()

  if (error || !data) return notFound()

  const items = (data.path_items || []).slice().sort((a, b) => a.idx - b.idx)

  // fetch titles for reused items
  const reuseIds = items.filter(i => i.type === 'reuse' && i.course_id).map(i => i.course_id)
  let titles = new Map()
  if (reuseIds.length) {
    const { data: embRows } = await supabase
      .from('course_embeddings')
      .select('course_id, title')
      .in('course_id', reuseIds)
    if (Array.isArray(embRows)) {
      titles = new Map(embRows.map(r => [r.course_id, r.title]))
    }
  }
  const itemsWithTitles = items.map(i => i.type === 'reuse' ? { ...i, course_title: titles.get(i.course_id) || null } : i)

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Your learning path</h1>
        <p className="text-sm opacity-80 mt-1">{data.title || data.user_prompt}</p>
      </div>

      <div className="space-y-3">
        {itemsWithTitles.map((it) => (
          <div key={it.idx} className="border rounded p-3 flex items-start justify-between gap-4">
            <div>
              <div className="font-medium">Step {it.idx}: <TitleLine item={it} /></div>
              <div className="text-sm opacity-80">{it.note || ''}</div>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge status={it.status || (it.type === 'reuse' ? 'ready' : 'pending')} />
              {it.type === 'new' && (it.status || 'pending') === 'pending' && (
                <GenerateButtonClient pathId={data.id} idx={it.idx} newTitle={it.new_title} note={it.note || ''} />
              )}
              <OpenLink item={it} pathId={data.id} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}


