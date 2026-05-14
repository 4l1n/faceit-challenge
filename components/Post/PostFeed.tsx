"use client";

import { useEffect, useRef } from "react";
import type { Post } from "@/types/post";
import PostCard from "./PostCard";

interface PostFeedProps {
  posts: Post[];
  isLoading?: boolean;
  isLoadingMore?: boolean; 
  hasMore?: boolean;
  onLoadMore?: () => void;
}

const PostCardSkeleton: React.FC = () => (
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

const PostFeed: React.FC<PostFeedProps> = ({
  posts,
  isLoading = false,
  isLoadingMore = false,
  hasMore = false,
  onLoadMore,
}: PostFeedProps) => {
  const sentinelRef = useRef<HTMLDivElement>(null);

  // IntersectionObserver — fires onLoadMore when sentinel enters viewport
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !onLoadMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          onLoadMore();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, isLoadingMore, onLoadMore]);

  // Initial full-page skeleton
  if (isLoading && posts.length === 0) {
    return (
      <ul className="flex flex-col gap-4 w-full" aria-busy="true" aria-label="Loading posts">
        {Array.from({ length: 5 }).map((_, i) => (
          <li key={i}>
            <PostCardSkeleton />
          </li>
        ))}
      </ul>
    );
  }

  if (!isLoading && posts.length === 0) {
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

      {/* Skeleton footer shown while loading next page */}
      {isLoadingMore && (
        <>
          {Array.from({ length: 3 }).map((_, i) => (
            <li key={`skeleton-more-${i}`}>
              <PostCardSkeleton />
            </li>
          ))}
        </>
      )}

      {/* Invisible sentinel — triggers the next page load */}
      <div ref={sentinelRef} aria-hidden="true" />

      {/* End-of-feed message */}
      {!hasMore && posts.length > 0 && (
        <li className="py-8 text-center text-sm text-text select-none">
          You&apos;ve reached the end of the feed 🎉
        </li>
      )}
    </ul>
  );
};

export default PostFeed;
