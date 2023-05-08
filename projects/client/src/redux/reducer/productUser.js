import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userProduct: {},
  errorMessage: null,
  loading: null,
  productId: null,
  search: null,
};

export const userProductSlice = createSlice({
  name: "userProduct",
  initialState,
  reducers: {
    getAllListProduct: (state, action) => {
      state.userProduct = action.payload;
      state.errorMessage = null;
    },
    failed: (state, action) => {
      state.errorMessage = action.payload;
      state.loading = false;
    },
    getLoading: (state) => {
      state.loading = true;
    },
    getLoadingFalse: (state) => {
      state.loading = false;
    },
    getProductDetail: (state, action) => {
      state.productId = action.payload;
    },
  },
});

export const {
  getAllListProduct,
  failed,
  findAll_productList_request,
  getLoading,
  getLoadingFalse,
  getProductDetail,
} = userProductSlice.actions;
export default userProductSlice.reducer;
