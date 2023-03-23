import { createSlice } from "@reduxjs/toolkit";


const initialState = {
  admin: {},
  errorMessage: null,
  loading: null,
};

export const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    // registerSuccess: (state, action) => {
    //   state.admin = action.payload;
    //   console.log(state.user);
    //   state.loading = false;
    // },
    loginSuccess: (state, action) => {
      state.admin = action.payload;
    //   state.role = action.payload.role;
      state.loading = null;
      state.errorMessage = null;
    },
    failed: (state, action) => {
      state.errorMessage = action.payload;
      state.role = null;
      state.loading = null;
    },
    keep_login_admin_request: (state, action) => {
      state.admin = action;
      state.loading = null;
    },
    keep_login_admin_payload: (state, action) => {
      state.admin = action.payload;
      state.loading = null;
    },
    // updateProfileSuccess: (state, action) => {
    //   state.user = action.payload;
    //   state.loading = null;
    //   state.errorMessage = null;
    // },
    // stateError: (state, action) => {
    //   state.user = action.payload;
    //   state.errorMessage = null;
    // },
    // updateAddressSuccess: (state, action) => {
    //   state.user = action.payload;
    //   state.loading = null;
    //   state.errorMessage = null;
    // },
  },
});

export const {
//   registerSuccess,
  loginSuccess,
//   updateProfileSuccess,
//   updateAddressSuccess,
} = adminSlice.actions;

export default adminSlice.reducer;
