import { notFound } from "next/navigation";
import Link from "next/link";
import { MOCK_POSTS } from "@/lib/mocks";
import PostCard from "@/components/Post/PostCard";

interface PostPageProps {
  params: Promise<{ id: string }>;
}

const PostPage: React.FC<PostPageProps> = async ({ params }: PostPageProps) => {
  const { id } = await params;
  const post = MOCK_POSTS.find((p) => p.id === id);

  if (!post) notFound();

  return (
    <main className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto w-full max-w-2xl">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors mb-8"
        >
          ← Back to feed
        </Link>

        <PostCard post={post} postPage />
      </div>
    </main>
  );
}

export default PostPage;
