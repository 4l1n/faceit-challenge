import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PostFeedContainer from "@/components/Post/PostFeedContainer";
import { renderWithProviders } from "@/utils/test-utils";
import { toast } from "sonner";
import { API_BASE } from "@/lib/contants";

// Mock sonner
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
  },
}));

const mockPostsResponse = {
  posts: [
    {
      id: 1,
      title: "Test Post 1",
      body: "Body of test post 1",
      userId: 101,
    },
    {
      id: 2,
      title: "Test Post 2",
      body: "Body of test post 2",
      userId: 102,
    },
  ],
  total: 2,
  skip: 0,
  limit: 20,
};

describe("PostFeedContainer Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("fetches and displays posts on mount", async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockPostsResponse,
    });

    renderWithProviders(<PostFeedContainer />);

    // Shows loading skeleton initially
    expect(screen.getByLabelText(/loading posts/i)).toBeInTheDocument();

    // Wait for fetch to complete and posts to render
    await waitFor(() => {
      expect(screen.getByText("Test Post 1")).toBeInTheDocument();
      expect(screen.getByText("Test Post 2")).toBeInTheDocument();
    });

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining(`${API_BASE}/posts`)
    );
  });

  it("prepends a real-time fake post and highlights it after 15 seconds", async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockPostsResponse,
    });

    renderWithProviders(<PostFeedContainer />);

    await waitFor(() => {
      expect(screen.getByText("Test Post 1")).toBeInTheDocument();
    });

    // Advance timers by 15 seconds to trigger real-time fake post
    act(() => {
      vi.advanceTimersByTime(15000);
    });

    // Verify the new post is rendered
    expect(screen.getByText("Real-time Update!")).toBeInTheDocument();

    // Verify it has the highlight animation class
    const newPostCard = screen.getByText("Real-time Update!").closest(".animate-highlight");
    expect(newPostCard).toBeInTheDocument();

    // Verify the toast was called
    expect(toast.success).toHaveBeenCalledWith(
      "New post arrived!",
      expect.objectContaining({
        description: "System User just posted something new.",
      })
    );
  });

  it("scrolls to top when toast action is clicked", async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockPostsResponse,
    });

    renderWithProviders(<PostFeedContainer />);
    await waitFor(() => expect(screen.getByText("Test Post 1")).toBeInTheDocument());

    act(() => {
      vi.advanceTimersByTime(15000);
    });

    // Extract the action onClick from the mocked toast call
    const toastCallArgs = (toast.success as any).mock.calls[0];
    const toastOptions = toastCallArgs[1];
    
    // Simulate user clicking "View" on the toast
    act(() => {
      toastOptions.action.onClick();
    });

    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
  });

  it("scrolls to specific post when returning from detail page (url params)", async () => {
    // Mock the URL query parameter
    const originalLocation = window.location;
    Object.defineProperty(window, "location", {
      value: { ...originalLocation, search: "?scrollTo=2" },
      writable: true,
    });

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockPostsResponse,
    });

    // Mock document.getElementById to return a fake element
    const mockElement = { scrollIntoView: vi.fn() };
    vi.spyOn(document, "getElementById").mockImplementation((id) => {
      if (id === "post-2") return mockElement as any;
      return null;
    });

    renderWithProviders(<PostFeedContainer />);

    // Wait for the posts to load, which should trigger the useLayoutEffect
    await waitFor(() => {
      expect(screen.getByText("Test Post 2")).toBeInTheDocument();
    });

    expect(document.getElementById).toHaveBeenCalledWith("post-2");
    
    // We use requestAnimationFrame in the component, so we must wait for it to fire
    await waitFor(() => {
      expect(mockElement.scrollIntoView).toHaveBeenCalledWith({ behavior: "instant", block: "center" });
    });

    // Restore original window location
    Object.defineProperty(window, "location", {
      value: originalLocation,
      writable: true,
    });
  });
});
