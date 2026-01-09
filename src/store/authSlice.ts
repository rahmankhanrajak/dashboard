import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    accessToken: null,
    isAuthReady: false,
  },
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.isAuthReady = true;
    },

    setUser: (state, action) => {
      state.user = action.payload;
    },

    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },

    authReady: (state) => {
      state.isAuthReady = true;
    },

    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthReady = true;
    },
  },
});

export const {
  setCredentials,
  setUser,         
  setAccessToken,
  logout,
  authReady,
} = authSlice.actions;

export default authSlice.reducer;
