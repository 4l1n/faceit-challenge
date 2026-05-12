import type { Post } from "@/types/post";
import PostCard from "./PostCard";

interface PostFeedProps {
  posts: Post[];
}

export function PostFeed({ posts }: PostFeedProps) {
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
