'use client';

import { useEffect, useState } from 'react';

export default function BuilderPage() {
  const [prompt, setPrompt] = useState('');
  const [pathId, setPathId] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Allow deep-linking back to a specific learning path via ?path=ID
  useEffect(() => {
    try {
      const sp = new URLSearchParams(window.location.search);
      const p = sp.get('path');
      if (p) setPathId(p);
    } catch {}
  }, []);

  async function createPlan() {
    setLoading(true);
    const res = await fetch('/api/plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });
    const data = await res.json();
    setLoading(false);
    if (res.ok) {
      // redirect to the dedicated path page
      if (data.redirect) {
        window.location.assign(data.redirect);
        return;
      }
      setPathId(data.path_id);
      setItems(data.items);
    } else {
      alert(data.error ?? 'Failed to plan');
    }
  }

  async function generateOne(it) {
    if (!pathId || it.type !== 'new' || !it.new_title) return;
    setItems((prev) => prev.map((p) => (p.idx === it.idx ? { ...p, status: 'generating' } : p)));

    const res = await fetch('/api/generate-course', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        path_id: pathId,
        idx: it.idx,
        new_title: it.new_title,
        prompt: it.note ?? '',
      }),
    });
    if (!res.ok) {
      setItems((prev) => prev.map((p) => (p.idx === it.idx ? { ...p, status: 'failed' } : p)));
    }
  }

  // No polling here anymore; the dedicated path page handles display
  useEffect(() => {}, [pathId]);

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Generate a learning path</h1>

      <textarea
        className="w-full border rounded p-3"
        rows={5}
        placeholder="What do you want to learn?"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />

      <button
        className="px-4 py-2 rounded bg-black text-white disabled:opacity-50"
        onClick={createPlan}
        disabled={loading || !prompt.trim()}
      >
        {loading ? 'Planning…' : 'Create Plan'}
      </button>

      {!!items.length && (
        <div className="space-y-3">
          {items.map((it) => {
            const computedStatus = it.status || (it.type === 'reuse' ? 'ready' : 'pending')
            const titleLine =
              it.type === 'reuse'
                ? `Reuse existing course${it.course_id ? ` (${it.course_id})` : ''}`
                : `New → ${it.new_title || 'Untitled'}`
            return (
              <div key={it.idx} className="border rounded p-3 flex items-start justify-between gap-4">
                <div>
                  <div className="font-medium">
                    Step {it.idx}: {titleLine}
                  </div>
                  <div className="text-sm opacity-80">{it.note || it.brief || ''}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-1 rounded bg-gray-100">{computedStatus}</span>

                  {it.type === 'new' && computedStatus === 'pending' && (
                    <button className="px-3 py-1 rounded border" onClick={() => generateOne(it)}>
                      Generate
                    </button>
                  )}

                  {computedStatus === 'failed' && <span className="text-xs text-red-600">Failed — retry</span>}

                {computedStatus === 'ready' && it.course_id && (
                  <a
                    className="px-3 py-1 rounded border"
                    href={`/courses/${it.course_id}${pathId ? `?path=${pathId}` : ''}`}
                  >
                      Open
                    </a>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  );
}
