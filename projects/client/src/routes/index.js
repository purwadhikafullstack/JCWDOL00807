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
import UserChangePassword from "../pages/UserChangePassword";
import VoucherReferral from "../pages/VocReferral";
import CreateDiscount from "../pages/CreateDiscount";
import EditDiscount from "../pages/EditDiscount";
import CreateVoucher from "../pages/CreateVoucher";
import EditVoucher from "../pages/EditVoucher";
import DiscountList from "../pages/DiscountList";
import VoucherList from "../pages/VoucherList";
import UserProductList from "../pages/UserProductList";
import UserProductDetail from "../pages/UserProductDetail";
import DetailOrderListByQuery from "../pages/DetailOrderList";
import UserDetailOrderListByQuery from "../pages/UserDetailOrderList";
import UserOrderListByQuery from "../pages/UserOrderList";
import AdminSales from "../pages/Admin-Sales";
import CartList from "../pages/CartList";
import Shipping from "../pages/Shippings";
import PaymentSuccess from "../pages/PaymentSuccess";
import UploadPaymentProof from "../pages/UploadPaymentProof";
import HistoryStockByQuery from "../pages/HistoryStock";
import TokenGuard from "../guards/TokenGuard";

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
            <GuestGuard isAdmin={true}>
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
          path: "sales",
          element: (
            <AuthGuard>
              <RoleBasedGuard accessibleRoles={["super admin", "admin branch"]}>
                <AdminSales />
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
              <RoleBasedGuard accessibleRoles={["admin branch"]}>
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
          path: "detail-order-list/:id",
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
        {
          path: "history-stock-logs",
          element: (
            <AuthGuard>
              <RoleBasedGuard accessibleRoles={["super admin", "admin branch"]}>
                <HistoryStockByQuery />
              </RoleBasedGuard>
            </AuthGuard>
          )
        }
      ],
    },

    // USER
    // login user
    {
      path: "login",
      element: (
        <GuestGuard isAdmin={false}>
          <Login />
        </GuestGuard>
      ),
    },

    // register user
    {
      path: "/register",
      element: (
        <GuestGuard isAdmin={false}>
          <Register />
        </GuestGuard>
      ),
    },

    // {
    //   path: "/accounts/reset-password/:token",
    //   element: <ResetPassword />,
    // },

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
        {
          path: "reset-password/:token",
          element: (
            <TokenGuard>
              <ResetPassword />
            </TokenGuard>
          ),
        },
        {
          path: "change-password",
          element: (
            <AuthGuard>
              <RoleBasedGuard accessibleRoles={["user"]}>
                <UserChangePassword />
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
    {
      path: "shopping-cart",
      element: (
        <AuthGuard>
          <CartList />
        </AuthGuard>
      ),
    },
    {
      path: "shipping",
      element: (
        <AuthGuard>
          <Shipping />
        </AuthGuard>
      ),
    },
    { path: "payment-success", element: <PaymentSuccess /> },
    { path: "upload/payment-proof", element: <UploadPaymentProof /> },
    { path: "404", element: <PageNotFound /> },
    { path: "/authentication/:token", element: <Verification /> },
    { path: "*", element: <PageNotFound /> },
    { path: "/product-list/:name", element: <UserProductList /> },
    { path: "/product/:name", element: <UserProductDetail /> },
    { path: "/claimReferral/:token", element: <VoucherReferral /> },
  ]);
}
