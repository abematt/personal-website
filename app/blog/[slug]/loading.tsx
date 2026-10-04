export default function Loading() {
  return (
    <div className="prose prose-lg prose-invert mx-auto max-w-4xl">
      <div className="animate-pulse">
        <div className="h-12 bg-hover rounded mb-4"></div>
        <div className="h-6 bg-hover rounded mb-8 w-1/3"></div>
        <div className="space-y-4">
          <div className="h-4 bg-hover rounded"></div>
          <div className="h-4 bg-hover rounded"></div>
          <div className="h-4 bg-hover rounded w-3/4"></div>
        </div>
      </div>
    </div>
  )
} 