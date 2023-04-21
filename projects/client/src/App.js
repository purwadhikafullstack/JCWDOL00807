import { Route, Routes, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { keepLogin } from "./redux/action/user";
import { keepLoginAdmin } from "./redux/action/admin";
import { findAllAddress } from "./redux/action/userAddress";
import { useEffect, useState } from "react";
import { userProductList } from "./redux/action/userProduct";
import { cartList } from "./redux/action/carts";
import { findAllCategory } from "./redux/action/categoriesProduct";
import { getOrigin } from "./redux/action/rajaongkir";
import ResetPassword from "./pages/ResetPassword";
import Login from "./pages/Login";
import Router from "./routes";

function App() {
  const dispatch = useDispatch();
  let address = useSelector((state) => state.address);
  let userProduct = useSelector((state) => state.userProduct.userProduct);
  const branch_id = userProduct?.data?.branch_id
  const branch_name = userProduct?.data?.branch

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
    dispatch(userProductList());
    // dispatch(cartList(branch_id));
    // dispatch(getOrigin(branch_name));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  useEffect(() => {
    dispatch(cartList(branch_id));
    dispatch(getOrigin(branch_name));
  }, [dispatch, branch_id])

  return (
    <div>
      <Router />
    </div>
  );
}

export default App;
