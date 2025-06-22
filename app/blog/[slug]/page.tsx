// app/blog/[slug]/page.tsx
import { getPageContentBySlug } from '@/lib/notion-posts'
import { SimpleNotionRenderer } from '@/components/ClientNotion'
import { notion } from '@/lib/notion'
import { notFound } from 'next/navigation'

export const revalidate = 300 

export default async function BlogPost({ params }: { params: { slug: string } }) {
  try {
    const { blocks, title, date } = await getPageContentBySlug(params.slug)
    
    // Properly handle not found cases
    if (!blocks || !title) {
      notFound()
    }

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
  } catch (error) {
    console.error('Error loading blog post:', error)
    throw error // This will trigger the error boundary
  }
}

// Add this to pre-generate static paths
export async function generateStaticParams() {
  try {
    const res = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID!,
    })
    
    return res.results.map((post: any) => ({
      slug: post.properties.Slug?.formula?.string || '',
    })).filter(param => param.slug) // Filter out empty slugs
  } catch (error) {
    console.error('Error generating static params:', error)
    return []
  }
}
