"use client";

import { useCallback, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchPosts,
  selectAllPosts,
  selectPostsStatus,
  selectPostsError,
  selectCurrentPage,
  selectHasMore,
} from "@/store/slices/postsSlice";
import { Button } from "@/components/ui/button";
import PostFeed from "./PostFeed";

const PostFeedContainer: React.FC = () => {
  const dispatch = useAppDispatch();

  const posts = useAppSelector(selectAllPosts);
  const status = useAppSelector(selectPostsStatus);
  const error = useAppSelector(selectPostsError);
  const currentPage = useAppSelector(selectCurrentPage);
  const hasMore = useAppSelector(selectHasMore);

  useEffect(function fetchPostsOnMount() {
    if (status === "idle") {
      dispatch(fetchPosts(1));
    }
  }, [dispatch, status]);

  // Track whether we've already scrolled so new posts arriving via infinite
  // scroll don't re-trigger the scroll-to logic.
  const didScrollRef = useRef(false);

  // Scroll to the post indicated by ?scrollTo=<id> in the URL.
  // useEffect + rAF ensures this runs after Next.js finishes its navigation
  // cycle (which would otherwise reset scroll to top with scroll={true}).
  useEffect(function scrollToReturnedPost() {
    if (didScrollRef.current || posts.length === 0) return;

    const params = new URLSearchParams(window.location.search);
    const targetId = params.get("scrollTo");
    if (!targetId) return;

    const el = document.getElementById(`post-${targetId}`);
    if (!el) return;

    didScrollRef.current = true;

    // rAF defers until the browser has finished layout/paint
    requestAnimationFrame(() => {
      el.scrollIntoView({ behavior: "instant", block: "center" });
    });

    // Clean the ?scrollTo param from the URL without a full page reload
    params.delete("scrollTo");
    const newUrl = params.toString() ? `/?${params}` : "/";
    window.history.replaceState(null, "", newUrl);
  }, [posts.length]);

  // Called by PostFeed when the sentinel enters the viewport
  const handleLoadMore = useCallback(() => {
    if (status !== "loading" && hasMore) {
      dispatch(fetchPosts(currentPage + 1));
    }
  }, [dispatch, status, hasMore, currentPage]);

  if (status === "failed") {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <p className="text-danger font-medium">Failed to load posts.</p>
        <p className="text-sm text-muted">{error}</p>
        <Button variant="outline" onClick={() => dispatch(fetchPosts(currentPage))}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <PostFeed
      posts={posts}
      isLoading={status === "loading" && posts.length === 0}
      isLoadingMore={status === "loading" && posts.length > 0}
      hasMore={hasMore}
      onLoadMore={handleLoadMore}
    />
  );
};

export default PostFeedContainer;
