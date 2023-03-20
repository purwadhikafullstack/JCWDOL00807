import Register from "./pages/Register";
import Verification from "./pages/Verification.js";
import Home from "./pages/Home.js";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import UserProfile from "./pages/UserProfile.js";
import PageNotFound from "./pages/PageNotFound";
import Login from "./pages/Login";
import UsersAddress from "./pages/UsersAddress";
import CategoryProduct from "./pages/CategoryProduct.js";

import { Route, Routes } from "react-router-dom";
import { useDispatch } from "react-redux";
import { keepLogin } from "./redux/action/user";
import AdminHome from "./pages/Admin-Home";
import { findAllAddress } from "./redux/action/userAddress";
import { useEffect } from "react";

import { findAllCategory } from "./redux/action/categoriesProduct";
import ProductCRUD from "./pages/Product";
import CreateProduct from "./pages/CreateProduct";
import EditProduct from "./pages/EditProduct";
import { getProductList } from "./redux/action/product";


function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(keepLogin());
    dispatch(findAllAddress());
    dispatch(findAllCategory());
    // dispatch(getProductList());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  return (
    <div>
      <Routes>
        <Route path="/authentication/:token" element={<Verification />} />
        <Route path="/accounts/address" element={<UsersAddress />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/accounts/reset-password" element={<ForgotPassword />} />
        <Route path="/admin/home" element={<AdminHome />} />
        <Route path="/accounts/profile" element={<UserProfile />} />
        <Route path="/admin/manage-product" element={<ProductCRUD />} />
        <Route
          path="/admin/manage-product/create"
          element={<CreateProduct />}
        />
        <Route
          path="/admin/manage-product/edit/:id"
          element={<EditProduct />}
        />
        <Route path="*" element={<PageNotFound />} />
        <Route
          path="/accounts/reset-password/:token"
          element={<ResetPassword />}
        />
        <Route path="/admin/categories" element={<CategoryProduct />} />
      </Routes>
    </div>
  );
}

export default App;
