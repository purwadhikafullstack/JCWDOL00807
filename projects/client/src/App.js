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
import { useEffect } from "react";
import { findAllCategory } from "./redux/action/categoriesProduct";
import ProductCRUD from "./pages/Product";
import CreateProduct from "./pages/CreateProduct";
import EditProduct from "./pages/EditProduct";
import ProductListByQuery from "./pages/ProductList";
import AdminLogin from "./pages/Admin-Login";
import ChangeUserPassword from "./pages/ChangeUserPassword";
import VoucherReferral from "./pages/VocReferral";
import CreateDiscount from "./pages/CreateDiscount";
import EditDiscount from "./pages/EditDiscount"
import CreateVoucher from "./pages/CreateVoucher"
import EditVoucher from "./pages/EditVoucher"
import DiscountList from"./pages/DiscountList"
import VoucherList from "./pages/VoucherList"
import { userProductList } from "./redux/action/userProduct";

function App() {
  const dispatch = useDispatch();
  let admin = useSelector((state) => state.admin);
  console.log(admin);

  useEffect(() => {
    dispatch(keepLogin());
    dispatch(keepLoginAdmin());
    dispatch(findAllAddress());
    dispatch(findAllCategory());
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
        <Route path="/claimReferral/:token" element={<VoucherReferral />} />
        <Route
          path="/admin/manage-discount/create"
          element={<CreateDiscount />}
        />
        <Route path="/admin/manage-discount/edit/:id" element={<EditDiscount/>}/>
        <Route
          path="/admin/manage-voucher/create"
          element={<CreateVoucher />}
        />
        <Route path="/admin/manage-voucher/edit/:id" element={<EditVoucher/>}/>
        <Route path="/admin/manage-discount" element={<DiscountList/>} />
        <Route path="/admin/manage-voucher" element={<VoucherList/>} />
      </Routes>
    </div>
  );
}

export default App;
