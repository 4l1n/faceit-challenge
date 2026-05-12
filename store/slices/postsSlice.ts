import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import type { RootState } from "@/store";
import type {
  Post,
  PostsResponse,
} from "@/types/post";
import { POSTS_PER_PAGE } from "@/lib/contants";
import { API_BASE } from "@/lib/contants";



function mapPost(raw: Post): Post {
  return {
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
}

export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async (page: number) => {
    const skip = (page - 1) * POSTS_PER_PAGE;
    const res = await fetch(
      `${API_BASE}/posts?limit=${POSTS_PER_PAGE}&skip=${skip}`
    );

    if (!res.ok) throw new Error(`Failed to fetch posts: ${res.status}`);

    const data: PostsResponse = await res.json();

    return {
      posts: data.posts.map(mapPost),
      total: data.total,
      page,
    };
  }
);

const postsAdapter = createEntityAdapter<Post>();

interface PostsExtraState {
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  currentPage: number;
  totalPosts: number;
  postsPerPage: number;
}

const initialExtraState: PostsExtraState = {
  status: "idle",
  error: null,
  currentPage: 1,
  totalPosts: 0,
  postsPerPage: POSTS_PER_PAGE,
};

const postsSlice = createSlice({
  name: "posts",
  initialState: postsAdapter.getInitialState(initialExtraState),
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.currentPage = action.payload.page;
        state.totalPosts = action.payload.total;
        postsAdapter.setAll(state, action.payload.posts);
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Failed to fetch posts";
      });
  },
});

export default postsSlice.reducer;

export const {
  selectAll: selectAllPosts,
  selectById: selectPostById,
  selectIds: selectPostIds,
} = postsAdapter.getSelectors((state: RootState) => state.posts);

export const selectPostsStatus = (state: RootState) => state.posts.status;
export const selectPostsError = (state: RootState) => state.posts.error;
export const selectCurrentPage = (state: RootState) => state.posts.currentPage;
export const selectTotalPosts = (state: RootState) => state.posts.totalPosts;
export const selectPostsPerPage = (state: RootState) => state.posts.postsPerPage;
export const selectTotalPages = (state: RootState) => Math.ceil(state.posts.totalPosts / state.posts.postsPerPage);
