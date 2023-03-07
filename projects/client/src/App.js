// import axios from "axios";
// import { useEffect, useState } from "react";
import Login from "./Pages/Login";
import Navbar from "./Component/Navbar";
import Home from "./Pages/Home";

import { Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { keepLogin } from "./redux/action/user";
import Footer from "./Component/Footer";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(keepLogin());
  }, [dispatch]);

  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
