import { Navigate, useRoutes } from "react-router-dom";

import GuestGuard from "../guards/GuestGuard";
import AuthGuard from "../guards/AuthGuard";
import RoleBasedGuard from "../guards/RoleBasedGuard";
import AdminLogin from "../pages/Admin-Login";
import AdminHome from "../pages/Admin-Home";
import AdminManagement from "../pages/Admin-Management";
import Home from "../pages/Home";
import Login from "../pages/Login";
import CreateProduct from "../pages/CreateProduct";
import ProductCRUD from "../pages/Product";
import EditProduct from "../pages/EditProduct";
import PageNotFound from "../pages/PageNotFound";
import OrderList from "../pages/OrderList";


export default function Router() {
    return useRoutes([
        // route admin
        {
            path: 'admin',
            children: [
                {
                    path: 'login',
                    element: (
                        <GuestGuard>
                            <AdminLogin />
                        </GuestGuard>
                    )
                },
                {
                    path: 'home',
                    element: (
                        <AuthGuard>
                            <RoleBasedGuard accessibleRoles={['super admin', 'admin branch']}>
                                <AdminHome />
                            </RoleBasedGuard>
                        </AuthGuard>
                    )
                },
                {
                    path: 'management',
                    element: (
                        <AuthGuard>
                            <RoleBasedGuard accessibleRoles={['super admin']} >
                                <AdminManagement />
                            </RoleBasedGuard>
                        </AuthGuard>
                    )
                },
                {
                    path: 'categories',
                    element: (
                        <AuthGuard>
                            <RoleBasedGuard accessibleRoles={['super admin']}>
                                <CreateProduct />
                            </RoleBasedGuard>
                        </AuthGuard>
                    )
                },
                {
                    path: 'manage-product',
                    element: (
                        <AuthGuard>
                            <RoleBasedGuard accessibleRoles={['super admin', 'admin branch']}>
                                <ProductCRUD />
                            </RoleBasedGuard>
                        </AuthGuard>
                    )
                },
                {
                    path: 'manage-product/create',
                    element: (
                        <AuthGuard>
                            <RoleBasedGuard accessibleRoles={['super admin', 'admin branch']}>
                                <CreateProduct />
                            </RoleBasedGuard>
                        </AuthGuard>
                    )
                },
                {
                    path: 'manage-product/edit/:id',
                    element: (
                        <AuthGuard>
                            <RoleBasedGuard accessibleRoles={['super admin', 'admin branch']}>
                                <EditProduct />
                            </RoleBasedGuard>
                        </AuthGuard>
                    )
                }
            ]
        },
        // home
        {
            path: '/',
            element: (
                <Home />
            )
        },
        // login user
        {
            path: 'login',
            element: (
                <GuestGuard>
                    <Login />
                </GuestGuard>
            )
        },
        {path: '404', element: (<PageNotFound />)}
        ,
        {
            path: 'order-list',
            element: (
                
                    <OrderList />
                           
            )
        }

    ])
}