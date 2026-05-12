import type { Post } from "@/types/post";
import PostCard from "./PostCard";

interface PostFeedProps {
  posts: Post[];
  isLoading?: boolean;
}

// Skeleton card shown while posts are being fetched
const PostCardSkeleton: React.FC = () => {
  return (
    <div className="w-full rounded-xl border border-border bg-surface p-4 animate-pulse">
      <div className="flex items-center gap-3 mb-3">
        <div className="size-10 rounded-full bg-neutral-200 dark:bg-neutral-700" />
        <div className="flex flex-col gap-1.5 flex-1">
          <div className="h-3 w-28 rounded bg-neutral-200 dark:bg-neutral-700" />
          <div className="h-2.5 w-16 rounded bg-neutral-200 dark:bg-neutral-700" />
        </div>
      </div>
      <div className="h-3.5 w-3/4 rounded bg-neutral-200 dark:bg-neutral-700 mb-2" />
      <div className="h-3 w-full rounded bg-neutral-200 dark:bg-neutral-700" />
      <div className="h-3 w-5/6 rounded bg-neutral-200 dark:bg-neutral-700 mt-1.5" />
    </div>
  );
}

const PostFeed: React.FC<PostFeedProps> = ({ posts, isLoading = false }: PostFeedProps) => {
  if (isLoading) {
    return (
      <ul className="flex flex-col gap-4 w-full" aria-busy="true" aria-label="Loading posts">
        {Array.from({ length: 20 }).map((_, i) => (
          <li key={i}>
            <PostCardSkeleton />
          </li>
        ))}
      </ul>
    );
  }

  if (posts.length === 0) {
    return (
      <p className="text-center text-muted py-12 text-sm">
        No posts yet. Be the first to share something!
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-4 w-full">
      {posts.map((post) => (
        <li key={post.id}>
          <PostCard post={post} />
        </li>
      ))}
    </ul>
  );
}

export default PostFeed;
