'use client'

import { Button } from '@/components/ui/button'
import { Sparkles } from 'lucide-react'

export default function GenerateButtonClient({ pathId, idx, newTitle, note = '' }) {
  async function onClick() {
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
    <Button 
      onClick={onClick}
      variant="outline"
      className="inline-flex items-center gap-2 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700"
    >
      <Sparkles className="w-4 h-4" />
      Generate Course
    </Button>
  )
}


