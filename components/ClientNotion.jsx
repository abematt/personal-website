// components/SimpleNotionRenderer.jsx
'use client'

export function SimpleNotionRenderer({ blocks }) {
  const renderBlock = (block) => {
    const { type, id } = block
    const value = block[type]

    switch (type) {
      case 'paragraph':
        return (
          <p key={id} className="mb-4 text-zinc-200">
            {value.rich_text.map((text, i) => (
              <span key={i}>{text.plain_text}</span>
            ))}
          </p>
        )
      case 'heading_1':
        return (
          <h1 key={id} className="text-3xl font-bold mb-4 text-white">
            {value.rich_text.map((text, i) => (
              <span key={i}>{text.plain_text}</span>
            ))}
          </h1>
        )
      case 'heading_2':
        return (
          <h2 key={id} className="text-2xl font-bold mb-3 text-white">
            {value.rich_text.map((text, i) => (
              <span key={i}>{text.plain_text}</span>
            ))}
          </h2>
        )
      case 'heading_3':
        return (
          <h3 key={id} className="text-xl font-bold mb-2 text-white">
            {value.rich_text.map((text, i) => (
              <span key={i}>{text.plain_text}</span>
            ))}
          </h3>
        )
      case 'bulleted_list_item':
        return (
          <li key={id} className="mb-2 text-zinc-200">
            {value.rich_text.map((text, i) => (
              <span key={i}>{text.plain_text}</span>
            ))}
          </li>
        )
      case 'numbered_list_item':
        return (
          <li key={id} className="mb-2 text-zinc-200">
            {value.rich_text.map((text, i) => (
              <span key={i}>{text.plain_text}</span>
            ))}
          </li>
        )
      default:
        return (
          <div key={id} className="mb-4 text-zinc-200">
            ❓ Unsupported block ({type})
          </div>
        )
    }
  }

  return (
    <div className="space-y-4">
      {blocks.map((block) => renderBlock(block))}
    </div>
  )
}