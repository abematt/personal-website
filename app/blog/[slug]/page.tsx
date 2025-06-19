// app/blog/[slug]/page.tsx
import { getPageContentBySlug } from '@/lib/notion-posts'
import { SimpleNotionRenderer } from '@/components/ClientNotion'

export const dynamic = 'force-dynamic'

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const { blocks, title, date } = await getPageContentBySlug(params.slug)
  if (!blocks) return <div>Post not found</div>

  // Format the date nicely
  const formattedDate = date 
    ? new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : null

  return (
    <article className="prose prose-lg prose-invert mx-auto max-w-4xl">
      {/* Article Header */}
      <header className="mb-8 pb-8 border-b border-zinc-800">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
          {title}
        </h1>
        {formattedDate && (
          <time 
            dateTime={date || undefined} 
            className="text-lg text-zinc-400 font-medium"
          >
            {formattedDate}
          </time>
        )}
      </header>

      {/* Article Content */}
      <div className="notion-content">
        <SimpleNotionRenderer blocks={blocks} />
      </div>
    </article>
  )
}
