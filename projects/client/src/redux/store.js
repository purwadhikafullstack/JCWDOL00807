import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducer/auth";

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});
