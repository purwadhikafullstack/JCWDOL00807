import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  carts: [],
  count: 0,
  cart: {},
  checkout: {},
  errorMessage: null,
  loading: null,
};

export const cartSlice = createSlice({
  name: "carts",
  initialState,
  reducers: {
    listSuccess: (state, action) => {
      state.carts = action.payload.carts;
      state.count = action.payload.count;
      state.loading = false;
    },
    addToCartSuccess: (state, action) => {
      state.cart = action.payload;
      state.loading = false;
    },
    updateQtySuccess: (state, action) => {
      // debugger
      const {item_products_id, qty} = action.payload
      let newCart = state.carts.map((item) => {
        item.qty = item.item_products_id == item_products_id ? qty : item.qty
        return item
      });
      state.carts = newCart
      state.loading = false;
    },
    deleteQtySuccess: (state, action) => {
      const { item_products_id } = action.payload;
      const updatedCarts = state.carts.filter(
        (cart) => cart.item_products_id !== item_products_id
      );
      state.carts = updatedCarts;
      state.count = updatedCarts.length;
      state.loading = false;
    },
    savetoCheckout: (state, action) => {
      state.checkout = action.payload
      state.loading = false
    },
    failed: (state, action) => {
      state.errorMessage = action.payload;
      state.loading = null;
    },

  },
});

export const { listSuccess, addToCartSuccess, updateQtySuccess, deleteQtySuccess, savetoCheckout, failed } = cartSlice.actions;
export default cartSlice.reducer;
