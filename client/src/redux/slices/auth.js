// Import necessary functions and libraries
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../api/axios";

// Define the fetchAuth async thunk for logging in
export const fetchAuth = createAsyncThunk("auth/fetchAuth", async (params) => {
  const { data } = await axios.post("/auth/login", params);
  return data;
});

// Define the fetchRegister async thunk for registration
export const fetchRegister = createAsyncThunk(
  "auth/fetchRegister",
  async (params) => {
    const { data } = await axios.post("/auth/register", params);
    return data;
  }
);

// Define the fetchAuthMe async thunk for fetching current user data
export const fetchAuthMe = createAsyncThunk("auth/fetchAuthMe", async () => {
  const { data } = await axios.get("/auth/me");
  return data;
});

// Define the initial state for the auth slice
const initialState = {
  data: null,
  status: "loading",
};

// Helper function to set state to loading
const setLoading = (state) => {
  state.status = "loading";
  state.data = null;
};

// Helper function to set state to loaded with action payload
const setLoaded = (state, action) => {
  state.status = "loaded";
  state.data = action.payload;
};

// Helper function to set state to error
const setError = (state) => {
  state.status = "error";
  state.data = null;
};

// Define the auth slice using createSlice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Define the logOut reducer to remove user data from the state
    logOut: (state) => {
      state.data = null;
    },
  },
  extraReducers: (builder) => {
    // Add cases for the fetchAuth, fetchAuthMe, and fetchRegister thunks
    // with their respective state updates
    builder
      .addCase(fetchAuth.pending, setLoading)
      .addCase(fetchAuth.fulfilled, setLoaded)
      .addCase(fetchAuth.rejected, setError)
      .addCase(fetchAuthMe.pending, setLoading)
      .addCase(fetchAuthMe.fulfilled, setLoaded)
      .addCase(fetchAuthMe.rejected, setError)
      .addCase(fetchRegister.pending, setLoading)
      .addCase(fetchRegister.fulfilled, setLoaded)
      .addCase(fetchRegister.rejected, setError);
  },
});

// Define a selector to check if a user is authenticated
export const selectIsAuth = (state) => Boolean(state.auth.data);

// Export the auth reducer and logOut action
export const authReducer = authSlice.reducer;
export const { logOut } = authSlice.actions;
