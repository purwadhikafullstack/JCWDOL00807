import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducer/auth";
import addressReducer from "./reducer/address";
import categoryReducer from "./reducer/category";
import productReducer from "./reducer/product";
import adminReducer from "./reducer/admin";
import userProductReducer from "./reducer/productUser";
import cartsReducer from "./reducer/carts";
import rajaongkirReducer from "./reducer/rajaongkir";
import ordersReducer from "./reducer/order";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    address: addressReducer,
    category: categoryReducer,
    product: productReducer,
    admin: adminReducer,
    userProduct: userProductReducer,
    carts: cartsReducer,
    rajaongkir: rajaongkirReducer,
    orders: ordersReducer
  },
});
