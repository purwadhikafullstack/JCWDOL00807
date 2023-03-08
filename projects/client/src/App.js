import axios from "axios";
import logo from "./logo.svg";
import "./App.css";
import { useEffect, useState } from "react";
import Navbar from "./components/Navbar.js";
import Footer from "./components/Footer.js";
import Register from "./pages/Register";
import Verification from "./pages/Verification.js";
import Home from "./pages/Home.jsx";

import { Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useDispatch } from "react-redux";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    (async () => {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/greetings`
      );
      setMessage(data?.message || "");
    })();
  }, []);
  return (
    <div>
      <Navbar />
      <Footer />
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/authentication/:token" element={<Verification />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  );
}

export default App;
