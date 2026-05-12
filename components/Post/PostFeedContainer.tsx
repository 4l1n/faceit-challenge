"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchPosts,
  selectAllPosts,
  selectPostsStatus,
  selectPostsError,
  selectCurrentPage,
  selectTotalPages,
} from "@/store/slices/postsSlice";
import { Button } from "@/components/ui/button";
import PostFeed from "./PostFeed";

const PostFeedContainer: React.FC = () => {
  const dispatch = useAppDispatch();

  const posts = useAppSelector(selectAllPosts);
  const status = useAppSelector(selectPostsStatus);
  const error = useAppSelector(selectPostsError);
  const currentPage = useAppSelector(selectCurrentPage);
  const totalPages = useAppSelector(selectTotalPages);

  useEffect(function fetchPostsOnMount() {
    if (status === "idle") {
      dispatch(fetchPosts(1));
    }
  }, [dispatch, status]);

  const goToPage = (page: number) => {
    dispatch(fetchPosts(page));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
    <div className="flex flex-col gap-6">
      {/* Feed */}
      <PostFeed posts={posts} isLoading={status === "loading"} />
    </div>
  );
};

export default PostFeedContainer;
