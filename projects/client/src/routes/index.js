import { Navigate, useRoutes } from "react-router-dom";
import AdminHome from "../pages/Admin-Home";
import GuestGuard from "../guards/GuestGuard";
import AuthGuard from "../guards/AuthGuard";
import RoleBasedGuard from "../guards/RoleBasedGuard";
import AdminLogin from "../pages/Admin-Login";
import AdminManagement from "../pages/Admin-Management";
import Home from "../pages/Home";
import CreateProduct from "../pages/CreateProduct";
import EditProduct from "../pages/EditProduct";
import OrderList from "../pages/OrderList";
import Register from "../pages/Register";
import Verification from "../pages/Verification.js";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import UserProfile from "../pages/UserProfile.js";
import PageNotFound from "../pages/PageNotFound";
import Login from "../pages/Login";
import UsersAddress from "../pages/UsersAddress";
import CategoryProduct from "../pages/CategoryProduct.js";
import ProductCRUD from "../pages/Product";
import ProductListByQuery from "../pages/ProductList";
import ChangeUserPassword from "../pages/ChangeUserPassword";
import VoucherReferral from "../pages/VocReferral";
import CreateDiscount from "../pages/CreateDiscount";
import EditDiscount from "../pages/EditDiscount";
import CreateVoucher from "../pages/CreateVoucher";
import EditVoucher from "../pages/EditVoucher";
import DiscountList from "../pages/DiscountList";
import VoucherList from "../pages/VoucherList";
import ProductList from "../pages/ProductListPage";
import ProductDetail from "../pages/ProductDetail";
import DetailOrderListByQuery from "../pages/DetailOrderList";
import UserDetailOrderListByQuery from "../pages/UserDetailOrderList";
import UserOrderListByQuery from "../pages/UserOrderList";

// debugger
export default function Router() {
  return useRoutes([
    // route admin
    // home
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "admin",
      children: [
        {
          path: "login",
          element: (
            <GuestGuard>
              <AdminLogin />
            </GuestGuard>
          ),
        },
        {
          path: "home",
          element: (
            <AuthGuard>
              <RoleBasedGuard accessibleRoles={["super admin", "admin branch"]}>
                <AdminHome />
              </RoleBasedGuard>
            </AuthGuard>
          ),
        },
        {
          path: "management",
          element: (
            <AuthGuard>
              <RoleBasedGuard accessibleRoles={["super admin"]}>
                <AdminManagement />
              </RoleBasedGuard>
            </AuthGuard>
          ),
        },
        {
          path: "categories",
          element: (
            <AuthGuard>
              <RoleBasedGuard accessibleRoles={["super admin"]}>
                <CategoryProduct />
              </RoleBasedGuard>
            </AuthGuard>
          ),
        },
        {
          path: "manage-product",
          element: (
            <AuthGuard>
              <RoleBasedGuard accessibleRoles={["super admin", "admin branch"]}>
                <ProductCRUD />
              </RoleBasedGuard>
            </AuthGuard>
          ),
        },
        {
          path: "manage-product/create",
          element: (
            <AuthGuard>
              <RoleBasedGuard accessibleRoles={["super admin", "admin branch"]}>
                <CreateProduct />
              </RoleBasedGuard>
            </AuthGuard>
          ),
        },
        {
          path: "manage-product/edit/:id",
          element: (
            <AuthGuard>
              <RoleBasedGuard accessibleRoles={["super admin", "admin branch"]}>
                <EditProduct />
              </RoleBasedGuard>
            </AuthGuard>
          ),
        },
        {
          path: "manage-discount/create",
          element: (
            <AuthGuard>
              <CreateDiscount />
            </AuthGuard>
          ),
        },
        {
          path: "manage-discount/edit/:id",
          element: (
            <AuthGuard>
              <RoleBasedGuard accessibleRoles={["super admin", "admin branch"]}>
                <EditDiscount />
              </RoleBasedGuard>
            </AuthGuard>
          ),
        },
        {
          path: "manage-voucher/create",
          element: (
            <AuthGuard>
              <RoleBasedGuard accessibleRoles={["super admin", "admin branch"]}>
                <CreateVoucher />
              </RoleBasedGuard>
            </AuthGuard>
          ),
        },
        {
          path: "manage-voucher/edit/:id",
          element: (
            <AuthGuard>
              <RoleBasedGuard accessibleRoles={["super admin", "admin branch"]}>
                <EditVoucher />
              </RoleBasedGuard>
            </AuthGuard>
          ),
        },
        {
          path: "manage-discount",
          element: (
            <AuthGuard>
              <RoleBasedGuard accessibleRoles={["super admin", "admin branch"]}>
                <DiscountList />
              </RoleBasedGuard>
            </AuthGuard>
          ),
        },
        {
          path: "order-list",
          element: (
            <AuthGuard>
              <RoleBasedGuard accessibleRoles={["super admin", "admin branch"]}>
                <OrderList />
              </RoleBasedGuard>
            </AuthGuard>
          ),
        },
        {
          path: "detail-order-list",
          element: (
            <AuthGuard>
              <RoleBasedGuard accessibleRoles={["super admin", "admin branch"]}>
                <DetailOrderListByQuery />
              </RoleBasedGuard>
            </AuthGuard>
          ),
        },
        {
          path: "product-list",
          element: (
            <AuthGuard>
              <RoleBasedGuard accessibleRoles={["super admin", "admin branch"]}>
                <ProductListByQuery />
              </RoleBasedGuard>
            </AuthGuard>
          ),
        },
        {
          path: "manage-voucher",
          element: (
            <AuthGuard>
              <RoleBasedGuard accessibleRoles={["super admin", "admin branch"]}>
                <VoucherList />
              </RoleBasedGuard>
            </AuthGuard>
          ),
        },
      ],
    },

    // USER
    // login user
    {
      path: "login",
      element: (
        <GuestGuard>
          <Login />
        </GuestGuard>
      ),
    },

    // register user
    {
      path: "/register",
      element: (
        <GuestGuard>
          <Register />
        </GuestGuard>
      ),
    },

    {
      path: "/accounts/reset-password/:token",
      element: <ResetPassword />,
    },

    {
      path: "accounts",
      children: [
        {
          path: "address",
          element: (
            <AuthGuard>
              <RoleBasedGuard accessibleRoles={["user"]}>
                <UsersAddress />
              </RoleBasedGuard>
            </AuthGuard>
          ),
        },
        // {
        //   path: "reset-password",
        //   element: (
        //     <AuthGuard>
        //     <RoleBasedGuard accessibleRoles={["user"]}>
        //         <ForgotPassword />
        //       </RoleBasedGuard>
        //     </AuthGuard>
        //   ),
        // },
        {
          path: "profile",
          element: (
            <AuthGuard>
              <RoleBasedGuard accessibleRoles={["user"]}>
                <UserProfile />
              </RoleBasedGuard>
            </AuthGuard>
          ),
        },
        // {
        //   path: "reset-password/:token",
        //   element: (
        //     <AuthGuard>
        //       <RoleBasedGuard accessibleRoles={["user"]}>
        //         <ResetPassword />
        //       </RoleBasedGuard>
        //     </AuthGuard>
        //   ),
        // },
        {
          path: "change-password",
          element: (
            <AuthGuard>
              <RoleBasedGuard accessibleRoles={["user"]}>
                <ChangeUserPassword />
              </RoleBasedGuard>
            </AuthGuard>
          ),
        },
        {
          path: "order-list",
          element: (
            <AuthGuard>
              <RoleBasedGuard accessibleRoles={["user"]}>
                <UserOrderListByQuery />
              </RoleBasedGuard>
            </AuthGuard>
          ),
        },
        {
          path: "detail-order-list/:id",
          element: (
            <AuthGuard>
              <UserDetailOrderListByQuery />
            </AuthGuard>
          ),
        },
        {
          path: "reset-password",
          element: (
            <GuestGuard>
              <ForgotPassword />
            </GuestGuard>
          ),
        },
      ],
    },

    { path: "404", element: <PageNotFound /> },
    { path: "/authentication/:token", element: <Verification /> },
    { path: "*", element: <PageNotFound /> },
    { path: "/:name", element: <ProductList /> },
    { path: "/product/:id", element: <ProductDetail /> },
    { path: "/claimReferral/:token", element: <VoucherReferral /> },
  ]);
}
