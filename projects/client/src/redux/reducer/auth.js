import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: {},
  errorMessage: null,
  loading: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    registerSuccess: (state, action) => {
      state.user = action.payload;
      console.log(state.user);
      state.loading = false;
    },
    loginSuccess: (state, action) => {
      state.user = action.payload;
      state.loading = null;
      state.errorMessage = null;
    },
    failed: (state, action) => {
      state.errorMessage = action.payload;
      state.loading = null;
    },
    keep_login_request: (state, action) => {
      state.user = action;
      state.loading = null;
    },
    keep_login_payload: (state, action) => {
      state.user = action.payload;
      state.loading = null;
    },
  },
});

export const { registerSuccess, loginSuccess } = authSlice.actions;
export default authSlice.reducer;
