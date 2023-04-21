import { useDispatch, useSelector } from "react-redux";
import { keepLogin } from "./redux/action/user";
import { keepLoginAdmin } from "./redux/action/admin";
import { findAllAddress } from "./redux/action/userAddress";
import { useEffect } from "react";
import { userProductList } from "./redux/action/userProduct";
import Router from "./routes";

function App() {
  const dispatch = useDispatch();
  let address = useSelector((state) => state.address);

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
    // eslint-disable-next-line
  }, [address]);

  useEffect(() => {
    dispatch(keepLogin());
    // dispatch(keepLoginAdmin());
    dispatch(findAllAddress());
    dispatch(userProductList());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  return (
    <div>
      <Router />
    </div>
  );
}

export default App;
