import { createSlice, isRejected } from "@reduxjs/toolkit";

const initialState = {
  admin: {},
  createdAdmin: {},
  updatedAdmin: {},
  deletedAdmin: {},
  admins: {
    totalRecord: 0,
    totalReturn: 0,
    searchText: '',
    contents: []
  },
  page: 1,
  limit: 10,
  role: null,
  errorMessage: null,
  loading: null,
  isLoading: false,
  isAuthenticated: false,
  branchStore: []
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
      state.role = action.payload.role;
      state.loading = null;
      state.errorMessage = null;
      state.isAuthenticated = true;
    },

    failed: (state, action) => {
      state.errorMessage = action.payload;
      state.role = null;
      state.loading = null;
    },

    hasError: (state, action) => {
      state.errorMessage = action.payload.message;
      state.isLoading = false;
    },

    startLoading: (state, action) => {
      state.isLoading = true;
    },

    updatePageLimit: (state, action) => {
      state.page = action.payload.page
      state.limit = action.payload.limit
    },

    keep_login_admin_request: (state, action) => {
      state.admin = action;
      state.loading = null;
    },
    keep_login_admin_payload: (state, action) => {
      state.admin = action.payload;
      state.loading = null;
    },

    setAdminRole: (state, action) => {
        state.role = action.payload
    },

    listAdminSuccess: (state, action) => {
      state.admins = action.payload;
      state.isLoading = false;
    },

    createAdminSuccess: (state, action) => {
      state.admins.contents = [...state.admins.contents, action.payload]
      state.createdAdmin = action.payload
      state.isLoading = false
    },

    updateAdminSuccess: (state, action) => {
      // debugger
      state.admins.contents = state.admins.contents.map((obj) => obj.id === action.payload.id ? action.payload : obj )
      state.updatedAdmin = action.payload
      state.isLoading = false
    },

    deleteAdminSuccess: (state, action) => {
      // debugger;
      state.admins.contents = state.admins.contents.filter((x) => x.id != action.payload.id)
      state.deletedAdmin = action.payload
      state.isLoading = false
    },

    getBranchStoreSuccess: (state, action) => {
      state.branchStore = action.payload
      state.isLoading = false
    },

    // changePage: (state, action) => {
    //   state.page = action.payload;
    // },
    
   

    
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

export const { loginSuccess } = adminSlice.actions;

export default adminSlice.reducer;
