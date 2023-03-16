import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducer/auth";
import addressReducer from "./reducer/address";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    address: addressReducer,
  },
});
