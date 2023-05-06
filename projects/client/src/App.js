import { useDispatch, useSelector } from "react-redux";
import { keepLogin } from "./redux/action/user";
import { keepLoginAdmin } from "./redux/action/admin";
import { findAllAddress } from "./redux/action/userAddress";
import { useEffect } from "react";
import { userProductList } from "./redux/action/userProduct";
import { cartList } from "./redux/action/carts";
import { getOrigin } from "./redux/action/rajaongkir";
import Router from "./routes";

function App() {
  const dispatch = useDispatch();
  let address = useSelector((state) => state.address);
  let userProduct = useSelector((state) => state.userProduct);
  let user = useSelector((state) => state.auth);
  const branch_id = userProduct?.userProduct?.data?.branch_id;
  const branch_name = userProduct?.userProduct?.data?.branch;

  const geolocation = () => {
    if (!address.loading) {
      if (address?.userAddress?.data) {
        let lat = address.userAddress.data[0]?.latitude;
        let lng = address.userAddress.data[0]?.longitude;
        dispatch(userProductList({ lat: lat, lng: lng }));
      } else if (!address.userAddress.data) {
        dispatch(userProductList({ lat: "-6.18234", lng: "106.8428715" }));
        if ("geolocation" in navigator) {
          navigator.geolocation.getCurrentPosition(
            function (position) {
              const latitude = position.coords.latitude;
              const longitude = position.coords.longitude;

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
    const timeOut = setTimeout(() => {
      geolocation();
    }, 1000);
    return () => {
      clearTimeout(timeOut);
    };
    // eslint-disable-next-line
  }, [address, user.addtional]);

  useEffect(() => {
    // dispatch(keepLogin());
    dispatch(userProductList());
    // dispatch(keepLoginAdmin())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  useEffect(() => {
    dispatch(findAllAddress());
  }, [dispatch, user.addtional]);

  useEffect(() => {
    dispatch(cartList(branch_id));
    dispatch(getOrigin(branch_name));
    // eslint-disable-next-line
  }, [dispatch, branch_id]);

  return (
    <div>
      <Router />
    </div>
  );
}

export default App;
