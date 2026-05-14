import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor, act } from "@testing-library/react";
import { Suspense } from "react";
import PostPage from "@/app/posts/[id]/page";
import { renderWithProviders } from "@/utils/test-utils";
import { notFound } from "next/navigation";

const mockPost = {
  id: 1,
  title: "Redux Post",
  body: "This post comes directly from Redux state",
  userId: 101,
  author: {
    id: 101,
    name: "User #101",
    avatarUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=101",
  },
};

const mockFetchedPost = {
  id: 2,
  title: "Fetched Post",
  body: "This post was fetched from the API",
  userId: 102,
};

describe("PostPage Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  it("loads post from Redux if available (coming from feed)", async () => {
    // Pre-populate Redux state with a post
    const preloadedState = {
      posts: {
        ids: [1],
        entities: {
          1: mockPost,
        },
        totalPosts: 1,
        status: "succeeded",
        error: null,
      },
    };

    await act(async () => {
      renderWithProviders(
        <Suspense fallback={<div>Loading params...</div>}>
          <PostPage params={Promise.resolve({ id: "1" })} />
        </Suspense>,
        { preloadedState }
      );
    });

    // Should render without API fetch, but wait for Suspense to resolve
    await waitFor(() => {
      expect(screen.getByText("Redux Post")).toBeInTheDocument();
    });
    expect(screen.getByText("This post comes directly from Redux state")).toBeInTheDocument();
    
    // Verify back link includes the scrollTo parameter
    const backLink = screen.getByRole("link", { name: /back to feed/i });
    expect(backLink).toHaveAttribute("href", "/?scrollTo=1");
    
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("fetches post from API if not in Redux (direct link)", async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockFetchedPost,
    });

    await act(async () => {
      renderWithProviders(
        <Suspense fallback={<div>Loading params...</div>}>
          <PostPage params={Promise.resolve({ id: "2" })} />
        </Suspense>
      );
    });

    await act(async () => {
      renderWithProviders(
        <Suspense fallback={<div>Loading params...</div>}>
          <PostPage params={Promise.resolve({ id: "2" })} />
        </Suspense>
      );
    });

    // Wait for fetch to resolve and data to display
    await waitFor(() => {
      expect(screen.getByText("Fetched Post")).toBeInTheDocument();
    });

    expect(global.fetch).toHaveBeenCalledWith("https://dummyjson.com/posts/2");
    
    // Check that the mapped author name is displayed
    expect(screen.getByText("User #102")).toBeInTheDocument();
  });

  it("calls notFound() when post fetch returns 404 (edge case)", async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 404,
    });

    await act(async () => {
      renderWithProviders(
        <Suspense fallback={<div>Loading params...</div>}>
          <PostPage params={Promise.resolve({ id: "999" })} />
        </Suspense>
      );
    });

    await waitFor(() => {
      expect(notFound).toHaveBeenCalled();
    });
  });
});
