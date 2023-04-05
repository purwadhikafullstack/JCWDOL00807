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
import { useDispatch, useSelector } from "react-redux";
import { keepLogin } from "./redux/action/user";
import { keepLoginAdmin } from "./redux/action/admin";
import AdminHome from "./pages/Admin-Home";
import { findAllAddress } from "./redux/action/userAddress";
import { useEffect, useState } from "react";
import { findAllCategory } from "./redux/action/categoriesProduct";
import ProductCRUD from "./pages/Product";
import CreateProduct from "./pages/CreateProduct";
import EditProduct from "./pages/EditProduct";
import ProductListByQuery from "./pages/ProductList";
import AdminLogin from "./pages/Admin-Login";
import ChangeUserPassword from "./pages/ChangeUserPassword";
import { userProductList } from "./redux/action/userProduct";
import ProductList from "./pages/ProductListPage";
import ProductDetail from "./pages/ProductDetail";

function App() {
  const dispatch = useDispatch();
  let address = useSelector((state) => state.address);

  const geolocation = () => {
    if (!address.loading) {
      dispatch(userProductList({ lat: "-6.18234", lng: "106.8428715" }));
      if (address.userAddress.data) {
        let lat = address.userAddress.data[0]?.latitude;
        let lng = address.userAddress.data[0]?.longitude;
        dispatch(userProductList({ lat: lat, lng: lng }));
      } else {
        if ("geolocation" in navigator) {
          navigator.geolocation.getCurrentPosition(
            function (position) {
              var latitude = position.coords.latitude;
              var longitude = position.coords.longitude;
              dispatch(userProductList({ lat: latitude, lng: longitude }));
            },
            function (error) {
              console.log("cannot access location because user deny");
              dispatch(
                userProductList({ lat: "-6.18234", lng: "106.8428715" })
              );
            }
          );
        } else {
          console.log("Browser not support geolocation");
          dispatch(userProductList({ lat: "-6.18234", lng: "106.8428715" }));
        }
      }
    }
  };

  useEffect(() => {
    geolocation();
  }, [address]);

  useEffect(() => {
    dispatch(keepLogin());
    // dispatch(keepLoginAdmin());
    dispatch(findAllAddress());
    // dispatch(findAllCategory());
    dispatch(userProductList());
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
        <Route path="/admin/product-list" element={<ProductListByQuery />} />
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

        <Route path="/admin/login" element={<AdminLogin />} />

        <Route
          path="/accounts/change-password"
          element={<ChangeUserPassword />}
        />
        <Route path="/:name" element={<ProductList />} />
        <Route path="/product/:id" element={<ProductDetail />} />
      </Routes>
    </div>
  );
}

export default App;
