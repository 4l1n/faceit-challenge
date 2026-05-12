"use client";

import { use, useEffect, useState } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import PostCard from "@/components/Post/PostCard";
import type { Post } from "@/types/post";
import { useAppSelector } from "@/store/hooks";
import { selectPostById } from "@/store/slices/postsSlice";

interface PostPageProps {
  params: Promise<{ id: string }>;
}

// Be aware, we're loading the post in two steps:
// 1. Try to get it from Redux (client-side)
// 2. If not found, fetch it from the API (client-side)
// This is not ideal, but it works for now, we should save the post
// we should update the store after fetching it from the API through some thunk.

const PostPage: React.FC<PostPageProps> = ({ params }) => {
  const { id } = use(params);

  const reduxPost = useAppSelector((state) => selectPostById(state, Number(id)));

  const [fetchedPost, setFetchedPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(!reduxPost);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (reduxPost) {
      setIsLoading(false);
      return;
    }

    const fetchPost = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`https://dummyjson.com/posts/${id}`);
        
        if (!res.ok) {
          if (res.status === 404) setError(true);
          throw new Error("Failed to fetch post");
        }

        const raw = await res.json();

        const formattedPost: Post = {
          id: raw.id,
          userId: raw.userId,
          title: raw.title,
          body: raw.body,
          author: {
            id: raw.userId || raw.id,
            name: `User #${raw.userId}`,
            avatarUrl: `https://api.dicebear.com/9.x/avataaars/svg?seed=${raw.userId}`,
          },
        };

        setFetchedPost(formattedPost);
      } catch (err) {
        console.error("Error fetching post:", err);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [id, reduxPost]);

  const post = reduxPost || fetchedPost;

  if (error) notFound();

  if (isLoading || !post) {
    return (
      <main className="min-h-screen bg-background px-4 py-10 flex justify-center items-center">
        <div className="text-muted-foreground animate-pulse">Loading post...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto w-full max-w-2xl">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm hover:opacity-80 transition-colors mb-8"
        >
          ← Back to feed
        </Link>

        <PostCard post={post} postPage />
      </div>
    </main>
  );
};

export default PostPage;
