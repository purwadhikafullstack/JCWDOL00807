import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  discount: {},
  errorMessage: null,
  loading: null,
};

export const discountSlice = createSlice({
  name: "discount",
  initialState,
  reducers: {
    createDiscountSuccess: (state, action) => {
      state.product = action.payload;
      state.loading = false;
    },
    failed: (state, action) => {
      state.errorMessage = action.payload;
      state.loading = null;
    },
    updateDiscountSuccess: (state, action) => {
      state.product = action.payload;
      state.loading = false;
    },
  },
});

export const { createDiscountSuccess, updateDiscountSuccess } =
  discountSlice.actions;
export default discountSlice.reducer;
