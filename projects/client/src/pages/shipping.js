import React from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar2";
import Footer from "../components/Footer";
import BackdropResetPassword from "../components/BackdropResetPassword";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProvince, getCity, getCost } from "../redux/action/rajaongkir";
import { createOrder } from "../redux/action/order";
import { cartList } from "../redux/action/carts";

const Shipping = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const { checkout } = useSelector((state) => state.carts);
  const { provinces, cities, costs, origin } = useSelector((state) => state.rajaongkir);
  let userProduct = useSelector((state) => state.userProduct.userProduct);
  const branch_id = userProduct?.data?.branch_id;
  const branch_name = userProduct?.data?.branch;

  const [ city, setCity ] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedExpedisi, setSelectedExpedisi] = useState('');
  const [grandtotal, setGrandtotal] = useState(checkout.grandtotal);

  const handleClose = () => {
    setMessage("");
  };

  useEffect(() => {
    dispatch(getProvince())
    dispatch(getCity())
  }, [dispatch]);

  const handleProvinceChange = (value) => {
    const filteredCities = cities.city.filter(x => x.province_id == value);
    setCity(filteredCities)
  }

  const handleExpedisiChange = (value) => {
    setSelectedExpedisi(value)
    dispatch(getCost(origin.city_id, selectedCity, checkout.totalweight, value))
  }

  const handleCostChange = (value) => {
    const filteredCost = costs.filter(x => x.service == value);
    const ongkir = filteredCost[0].cost[0].value
    const newGrandtotal = checkout.grandtotal + ongkir
    setGrandtotal(newGrandtotal)
  }

  const handleClickCreateOrder = async () => {
    const dataInsert = {
        detailOrder : checkout.detailOrder,
        products_id: checkout.products_id,
        isFromCart: checkout.isFromCart,
        grandtotal,
        branch_name,
        branch_id
    }
    const response = await dispatch(createOrder(dataInsert));
    const { status, data } = response;
    const { message } = data;
    if (status === 200) {
        dispatch(cartList())
        navigate('/upload/payment-proof');
    } else {
        setMessage(message)
    }
  }


  return (
    <>
      <Navbar />
      <div className="container mx-auto mt-10">
        <div className="flex shadow-md my-10">
          <div className="w-3/5 bg-white px-10 py-10">
            <div className="flex justify-between border-b pb-8">
              <h1 className="font-semibold text-2xl">Order Detail</h1>
              <h2 className="font-semibold text-2xl">{checkout.count} Items</h2>
            </div>
            <div className="flex mt-10 mb-5">
              <h3 className="font-semibold text-gray-600 text-xs uppercase w-2/5">
                Product Details
              </h3>
              <h3 className="font-semibold text-center text-gray-600 text-xs uppercase w-1/5 ">
                Quantity
              </h3>
              <h3 className="font-semibold text-center text-gray-600 text-xs uppercase w-1/5 ">
                Price
              </h3>
              <h3 className="font-semibold text-center text-gray-600 text-xs uppercase w-1/5">
                Total
              </h3>
            </div>
            {checkout?.detailOrder?.map((val, idx) => {
              const total = parseInt(val.price_per_item) * parseInt(val.qty);
              return (
                <div className="flex items-center hover:bg-gray-100 -mx-8 px-6 py-5">
                  <div className="flex w-2/5">
                    <div className="flex flex-col justify-between ml-4 flex-grow">
                      <span className="font-bold text-sm">
                        {val.product_name}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-center items-center">
                    <input
                      className="mx-2 border text-center w-8"
                      type="text"
                      value={val.qty}
                      disabled
                    />
                  </div>
                  <span className="text-center w-1/5 font-semibold text-sm">
                    Rp. {val.price_per_item}
                  </span>
                  <span className="text-center w-1/5 font-semibold text-sm">
                    Rp. {total}
                  </span>
                </div>
              );
            })}

            <a
              href="#"
              className="flex font-semibold text-indigo-600 text-sm mt-10"
            >
              <svg
                className="fill-current mr-2 text-indigo-600 w-4"
                viewBox="0 0 448 512"
              >
                <path d="M134.059 296H436c6.627 0 12-5.373 12-12v-56c0-6.627-5.373-12-12-12H134.059v-46.059c0-21.382-25.851-32.09-40.971-16.971L7.029 239.029c-9.373 9.373-9.373 24.569 0 33.941l86.059 86.059c15.119 15.119 40.971 4.411 40.971-16.971V296z" />
              </svg>
              Back
            </a>
          </div>

          <div id="summary" className="w-2/4 px-8 py-8">
            <h1 className="font-semibold text-2xl border-b pb-8">
              Order Summary
            </h1>
            <div className="flex justify-between mt-10 mb-5">
              <span className="font-semibold text-sm uppercase">
                Items {checkout.count}
              </span>
              <span className="font-semibold text-sm"> Rp. {grandtotal}</span>
            </div>
            <div>
              <label className="font-medium inline-block mb-3 text-sm uppercase">
                Select Destination
              </label>
              <select className="block p-2 text-gray-600 w-full text-sm" onChange={(e) => handleProvinceChange(e.target.value)}>
                {provinces?.province?.map((val) => {
                    return (
                        <option value={val.province_id}>{val.province}</option>
                    )
                })}
              </select>
              <select className="block p-2 text-gray-600 w-full text-sm" onChange={(e) => setSelectedCity(e.target.value)}>
                {city.map((val) => {
                    return (
                        <option value={val.city_id}>{val.city_name}</option>
                    )
                })}
              </select>
            </div>

            <div>
              <label className="font-medium inline-block mb-3 text-sm uppercase">
                Select Expedition
              </label>
              <select className="block p-2 text-gray-600 w-full text-sm" onChange={(e) => handleExpedisiChange(e.target.value)}>
                <option value="jne">JNE</option>
                <option value="pos">POS</option>
                <option value="tiki">TIKI</option>
              </select>
              <select className="block p-2 text-gray-600 w-full text-sm" onChange={(e) => handleCostChange(e.target.value)}>
                {costs?.map((val) => {
                    return (
                        <option value={val.service}>{val.description} - {val.cost[0].value} (estimasi {val.cost[0].etd} hari)</option>
                    )
                })}
              </select>
            </div>
            <div className="border-t mt-8">
              <div className="flex font-semibold justify-between py-6 text-sm uppercase">
                <span>Total cost</span>
                <span> Rp. {grandtotal}</span>
              </div>
              <button className="bg-indigo-500 font-semibold hover:bg-indigo-600 py-3 text-sm text-white uppercase w-full" onClick={() => handleClickCreateOrder()}>
                Create Order
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
      {message ? (
        <BackdropResetPassword message={message} handleClose={handleClose} />
      ) : null}
    </>
  );
};

export default Shipping;
