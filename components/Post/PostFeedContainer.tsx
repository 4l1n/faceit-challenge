"use client";

import { useCallback, useEffect } from "react";
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
