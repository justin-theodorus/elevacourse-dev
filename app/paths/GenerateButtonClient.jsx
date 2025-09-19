'use client'

export default function GenerateButtonClient ({ pathId, idx, newTitle, note = '' }) {
  async function onClick () {
    try {
      const res = await fetch('/api/generate-course', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path_id: pathId,
          idx,
          new_title: newTitle,
          prompt: note
        })
      })
      if (!res.ok) {
        alert('Generation failed')
        return
      }
      window.location.reload()
    } catch (err) {
      console.error(err)
      alert('Generation error')
    }
  }

  return (
    <button className="px-3 py-1 rounded border" onClick={onClick}>Generate</button>
  )
}


