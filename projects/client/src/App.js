import Navbar from "./components/Navbar.js";
import Footer from "./components/Footer.js";
import Register from "./pages/Register";
import Verification from "./pages/Verification.js";
import Home from "./pages/Home.js";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import SidebarAdmin from "./components/SidebarAdmin";
import UserProfile from "./pages/UserProfile.js";
import PageNotFound from "./pages/PageNotFound";
import Login from "./pages/Login";
import UsersAddress from "./pages/UsersAddress";

import { Route, Routes } from "react-router-dom";
import { useDispatch } from "react-redux";
import { keepLogin } from "./redux/action/user";
import { findAllAddress } from "./redux/action/userAddress";
import { useEffect } from "react";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(keepLogin());
    dispatch(findAllAddress());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/authentication/:token" element={<Verification />} />
        <Route path="/accounts/address" element={<UsersAddress />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home-admin" element={<SidebarAdmin />} />
        <Route path="/" element={<Home />} />
        <Route path="/accounts/forgot-password" element={<ForgotPassword />} />
        <Route path="/accounts/reset-password" element={<ForgotPassword />} />
        <Route path="/accounts/profile" element={<UserProfile />} />
        <Route path="*" element={<PageNotFound />} />
        <Route
          path="/accounts/reset-password/:token"
          element={<ResetPassword />}
        />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
