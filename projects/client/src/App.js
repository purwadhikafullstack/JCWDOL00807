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

import { Route, Routes, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { keepLogin } from "./redux/action/user";
import { keepLoginAdmin } from "./redux/action/admin";
import AdminHome from "./pages/Admin-Home";
import { findAllAddress } from "./redux/action/userAddress";
import { useEffect } from "react";

import { findAllCategory } from "./redux/action/categoriesProduct";
import ProductCRUD from "./pages/Product";
import CreateProduct from "./pages/CreateProduct";
import EditProduct from "./pages/EditProduct";
import { getProductList } from "./redux/action/product";

import AdminLogin from "./pages/Admin-Login";
import AdminManagement from "./pages/Admin-Management"
// import PrivateRoute from "./components/PrivateRoute";
import adminSlice from "./redux/reducer/admin"

import Router from "./routes";

function App() {
  // const dispatch = useDispatch();
  // const { admin } = useSelector((state) => state.admin);
  // const { role, token } = admin;

  // console.log(admin)

  // useEffect(() => {
  //   dispatch(keepLogin());
  //   dispatch(keepLoginAdmin())
  //   dispatch(findAllAddress());
  //   dispatch(findAllCategory());
  //   // dispatch(getProductList());
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [dispatch]);

  return (
    <div>
      {/* <Routes>
        <Route path="/authentication/:token" element={<Verification />} />
        <Route path="/accounts/address" element={<UsersAddress />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/accounts/reset-password" element={<ForgotPassword />} />
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
        <Route path="/admin/home" element={<AdminHome />} />
        <Route path="/admin/categories" element={<CategoryProduct />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/management" element={<AdminManagement />} />
        
      </Routes> */}
      <Router />
    </div>
  );
}

export default App;
