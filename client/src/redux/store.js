// Import configureStore from Redux Toolkit
import { configureStore } from "@reduxjs/toolkit";
// Import the posts reducer from the posts slice
import { postsReducer } from "./slices/posts";
// Import the auth reducer from the auth slice
import { authReducer } from "./slices/auth";

// Create and export a Redux store using the configureStore function
// Combine the reducers for posts and auth into the rootReducer
export default configureStore({
  reducer: {
    posts: postsReducer, // Assign the posts reducer to the posts state
    auth: authReducer,   // Assign the auth reducer to the auth state
  },
});
