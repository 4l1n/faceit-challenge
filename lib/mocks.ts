import type { Post } from "@/types/post";

// Array of mock posts until dummy JSON API is ready
export const MOCK_POSTS: Post[] = [
  {
    id: "1",
    author: {
      id: "a1",
      name: "Alex Mercer",
      avatarUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=Alex",
    },
    body: "Just hit Diamond in CS2 after grinding for three weeks straight. The ranked system finally feels rewarding — the climb is real but totally worth it. Who else is pushing for Faceit level 10 this season?",
    createdAt: "2026-05-12T10:00:00Z",
  },
];
