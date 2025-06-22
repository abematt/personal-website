import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="prose prose-lg prose-invert mx-auto max-w-4xl text-center">
      <h1>Post Not Found</h1>
      <p>The blog post you're looking for doesn't exist.</p>
      <Link href="/blog" className="text-blue-400 hover:underline">
        ← Back to Blog
      </Link>
    </div>
  )
} 