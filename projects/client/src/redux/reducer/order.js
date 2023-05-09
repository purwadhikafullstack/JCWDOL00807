import { createSlice, isRejected } from "@reduxjs/toolkit";

const initialState = {
  order: {},
  orders: {
    totalRecord: 0,
    totalReturn: 0,
    searchText: "",
    contents: [],
  },
  page: 1,
  limit: 10,
  errorMessage: null,
  isLoading: false,
};

export const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
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
    listOrdersSuccess: (state, action) => {
      state.orders = action.payload;
      state.isLoading = false;
    },
    createOrderSuccess: (state, action) => {
      state.order = action.payload
      state.isLoading = false
    },
    uploadPaymentProofSuccess: (state, action) => {
      state.order = action.payload
      state.isLoading = false
    }
  },
});

export const {} = orderSlice.actions;

export default orderSlice.reducer;
