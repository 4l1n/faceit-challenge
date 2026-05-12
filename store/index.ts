import { configureStore } from "@reduxjs/toolkit";
// import postsReducer from "./slices/postsSlice";

export const store = configureStore({
  reducer: {
    // posts: postsReducer,
  },
});

// Type to correctly infer the root state of the store
export type RootState = ReturnType<typeof store.getState>;
// Type to correctly infer the dispatch type of the store
export type AppDispatch = typeof store.dispatch;
