import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  product: {},
  errorMessage: null,
  loading: null,
};

export const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    createProductSuccess: (state, action) => {
      state.product = action.payload;
      state.loading = false;
    },
    failed: (state, action) => {
      state.errorMessage = action.payload;
      state.loading = null;
    },
    editProductSuccess: (state, action) => {
      state.product = action.payload;
      state.loading = false;
    },
    getProductList: (state, action) => {
      state.product = action.payload;
      state.loading = false;
    },
  },
});

export const { createProductSuccess, editProductSuccess, getProductList } =
  productSlice.actions;
export default productSlice.reducer;
