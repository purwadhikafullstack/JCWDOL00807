import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: {},
  errorMessage: "",
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
    failed: (state, action) => {
      state.errorMessage = action.payload;
      state.loading = false;
    },
  },
});

export const { registerSuccess } = authSlice.actions;
export default authSlice.reducer;
