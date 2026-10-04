import { getPosts } from '@/lib/notion-posts'
import Link from 'next/link'

export const revalidate = 300

export default async function BlogIndexPage() {
  const posts = await getPosts()

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold mb-8">Blog</h1>
      <div className="space-y-6">
        {posts.map((post) => {
          // Format the date nicely
          const formattedDate = post.date
            ? new Date(post.date).toLocaleDateString('en-US', {
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
                    href={`/blog/${post.slug}`}
                    className="hover:underline"
                  >
                    {post.title}
                  </Link>
                </h2>
                <time
                  dateTime={post.date ?? undefined}
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
