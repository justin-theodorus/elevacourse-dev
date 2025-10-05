"use client"

import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import 'highlight.js/styles/github.css'

export function Markdown({ content }) {
  if (!content) return null

  function InlineCode({ className, children, ...props }) {
    return (
      <code className={className} {...props}>
        {children}
      </code>
    )
  }

  function Pre(props) {
    return (
      <pre
        className={`overflow-x-auto rounded-lg bg-zinc-900 text-zinc-100 p-4 my-4 ${props.className || ''}`}
        {...props}
      />
    )
  }

  return (
    <div className="prose max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[[rehypeHighlight, { ignoreMissing: true }]]}
        components={{
          pre: Pre,
          code: InlineCode,
          a({ href, children, ...props }) {
            return (
              <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
                {children}
              </a>
            )
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}


