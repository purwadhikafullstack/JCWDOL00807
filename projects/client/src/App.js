import { useEffect } from "react";
import Navbar from "./components/Navbar.js";
import Footer from "./components/Footer.js";
import Register from "./pages/Register";
import Verification from "./pages/Verification.js";
import Home from "./pages/Home.js";
import { Route, Routes } from "react-router-dom";
import { useDispatch } from "react-redux";
import { keepLogin } from "./redux/action/user";

import Login from "./pages/Login";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(keepLogin());
  }, [dispatch]);

  return (
    <div>
      <Navbar />
      <Footer />
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/authentication/:token" element={<Verification />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
