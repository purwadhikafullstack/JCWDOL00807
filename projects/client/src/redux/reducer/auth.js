import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: {},
  errorMessage: null,
  loading: false,
  addtional: null,
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
      state.loading = false;
      state.errorMessage = null;
      state.addtional = "login";
    },
    failed: (state, action) => {
      state.errorMessage = action.payload;
      state.loading = false;
    },
    keep_login_request: (state, action) => {
      state.user = action;
      state.loading = false;
    },
    keep_login_payload: (state, action) => {
      state.user = action.payload;
      state.loading = false;
      state.errorMessage = null;
      state.addtional = "keepLogin";
    },
    updateProfileSuccess: (state, action) => {
      state.user = action.payload;
      state.loading = null;
      state.errorMessage = null;
    },
    stateError: (state, action) => {
      state.user = action.payload;
      state.errorMessage = null;
      state.loading = false;
    },
    updateAddressSuccess: (state, action) => {
      state.user = action.payload;
      state.loading = null;
      state.errorMessage = null;
    },
    getLoading: (state) => {
      state.loading = true;
    },
  },
});

export const {
  registerSuccess,
  loginSuccess,
  updateProfileSuccess,
  updateAddressSuccess,
  getLoading,
} = authSlice.actions;
export default authSlice.reducer;
