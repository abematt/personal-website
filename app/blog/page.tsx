import { notion } from '@/lib/notion'
import Link from 'next/link'

async function getPosts() {
  try {
    // Query for the pages
    const res = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID!,
      sorts: [
        {
          property: 'Date',
          direction: 'descending'
        }
      ]
    })

    return res.results
  } catch (error) {
    console.error('Error fetching posts:', error)
    throw error
  }
}

export default async function BlogIndexPage() {
  const posts = await getPosts()

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold mb-8">Blog</h1>
      <div className="space-y-6">
        {posts.map((post: any) => {
          const title =
            post.properties.Title.title[0]?.plain_text || 'Untitled'
          const slug =
            post.properties.Slug.rich_text[0]?.plain_text || '#'
          const date = post.properties.Date.date?.start
          
          // Format the date nicely
          const formattedDate = date 
            ? new Date(date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })
            : 'No date'

          return (
            <article key={post.id} className="border-b pb-6 last:border-b-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <h2 className="text-xl font-semibold">
                  <Link 
                    href={`/blog/${slug}`}
                    className="hover:underline"
                  >
                    {title}
                  </Link>
                </h2>
                <time 
                  dateTime={date} 
                  className="text-sm sm:text-right"
                >
                  {formattedDate}
                </time>
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}
  