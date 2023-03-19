// Import necessary functions and objects from Redux Toolkit and Axios
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../api/axios";

// Create fetchPosts async thunk for fetching posts
export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
  const { data } = await axios.get("/posts");
  return data;
});

// Create fetchTags async thunk for fetching tags
export const fetchTags = createAsyncThunk("posts/fetchTags", async () => {
  const { data } = await axios.get("/tags");
  return data;
});

// Create fetchRemovePost async thunk for removing a post
export const fetchRemovePost = createAsyncThunk(
  "posts/fetchRemovePost",
  async (id) => {
    await axios.delete(`/posts/${id}`);
    return id;
  }
);

// Define initial state
const initialState = {
  posts: { items: [], status: "idle" },
  tags: { items: [], status: "idle" },
};

// Create posts slice
const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Handle fetchPosts pending, fulfilled and rejected states
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.posts.status = "loading";
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.posts.items = action.payload;
        state.posts.status = "loaded";
      })
      .addCase(fetchPosts.rejected, (state) => {
        state.posts.items = [];
        state.posts.status = "error";
      })

      // Handle fetchTags pending, fulfilled and rejected states
      .addCase(fetchTags.pending, (state) => {
        state.tags.status = "loading";
      })
      .addCase(fetchTags.fulfilled, (state, action) => {
        state.tags.items = action.payload;
        state.tags.status = "loaded";
      })
      .addCase(fetchTags.rejected, (state) => {
        state.tags.items = [];
        state.tags.status = "error";
      })

      // Handle fetchRemovePost fulfilled state
      .addCase(fetchRemovePost.fulfilled, (state, action) => {
        state.posts.items = state.posts.items.filter(
          (obj) => obj._id !== action.payload
        );
      });
  },
});

// Export the posts reducer
export const postsReducer = postsSlice.reducer;
