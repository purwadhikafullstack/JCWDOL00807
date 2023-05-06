import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  category: {},
  errorMessage: null,
  loading: null,
  message: null,
};

export const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    getAllCategorySuccess: (state, action) => {
      state.category = action.payload;
      state.loading = null;
      state.errorMessage = null;
    },
    findAll_category_request: (state, action) => {
      state.category = action;
      state.loading = null;
    },

    failed: (state, action) => {
      state.errorMessage = action.payload;
      state.loading = null;
    },
    stateError: (state) => {
      state.message = null;
      state.errorMessage = null;
    },
    createCategorySuccess: (state, action) => {
      state.message = action.payload;
      state.loading = null;
      state.errorMessage = null;
    },
    updateCategorySuccess: (state, action) => {
      state.message = action.payload;
      state.loading = null;
      state.errorMessage = null;
    },
    deleteCategorySuccess: (state, action) => {
      state.message = action.payload;
      state.loading = null;
      state.errorMessage = null;
    },
  },
});

export const {
  getAllCategorySuccess,
  failed,
  stateError,
  findAll_category_request,
  createCategorySuccess,
  updateCategorySuccess,
  deleteCategorySuccess,
} = categorySlice.actions;
export default categorySlice.reducer;
