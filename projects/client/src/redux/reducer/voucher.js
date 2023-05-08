import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  voucher: {},
  errorMessage: null,
  loading: null,
};

export const voucherSlice = createSlice({
  name: "voucher",
  initialState,
  reducers: {
    createVoucherSuccess: (state, action) => {
      state.product = action.payload;
      state.loading = false;
    },
    failed: (state, action) => {
      state.errorMessage = action.payload;
      state.loading = null;
    },
    updateVoucherSuccess: (state, action) => {
      state.product = action.payload;
      state.loading = false;
    },
  },
});

export const { createVoucherSuccess, updateVoucherSuccess } =
  voucherSlice.actions;
export default voucherSlice.reducer;
