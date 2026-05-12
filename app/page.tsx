import { PostFeed } from "@/components/Post/PostFeed";
import { MOCK_POSTS } from "@/lib/mocks";

export default function Home() {
  return (
    <main className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto w-full max-w-2xl">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Feed
          </h1>
          <p className="mt-1 text-sm text-muted">
            Latest posts from the community
          </p>
        </div>

        {/* Feed */}
        <PostFeed posts={MOCK_POSTS} />
      </div>
    </main>
  );
}
