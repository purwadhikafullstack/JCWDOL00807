import React from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import Navbar from "../components/NavbarUser";
import Footer from "../components/Footer";
import BackdropResetPassword from "../components/BackdropResetPassword";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import CurrencyFormat from "react-currency-format";

import {
  getProvince,
  getCity,
  getCost,
  getCityByAddress,
  costToDefault,
  citiesToDefault,
} from "../redux/action/rajaongkir";
import { createOrder } from "../redux/action/order";
import { cartList } from "../redux/action/carts";

const Shipping = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const { checkout } = useSelector((state) => state.carts);
  let { cities, costs, origin } = useSelector((state) => state.rajaongkir);
  let userProduct = useSelector((state) => state.userProduct.userProduct);
  const userAddress = useSelector((state) => state.address.userAddress);
  const branch_id = userProduct?.data?.branch_id;
  const branch_name = userProduct?.data?.branch;

  const [grandtotal, setGrandtotal] = useState(checkout.grandtotal);
  const [ongkir, setOngkir] = useState(0);
  const [voucher, setVoucher] = useState([]);
  const [selectedVoucher, setSelectedVoucher] = useState({});
  const [persenValue, setPersenValue] = useState(0);

  // console.log(cities);

  const handleClose = () => {
    setMessage("");
  };

  const handleUserAddress = (value) => {
    if (value == "0") {
      dispatch(citiesToDefault());
    } else {
      const filteredAddress = userAddress.data.filter((x) => x.id == value);
      dispatch(getCityByAddress(filteredAddress[0].city));
    }
  };

  const handleExpedisiChange = (value) => {
    if (value == "0") {
      dispatch(costToDefault());
    } else {
      dispatch(
        getCost(origin.city_id, cities.city_id, checkout.totalweight, value)
      );
    }
  };

  const handleCostChange = (value) => {
    if (value == "0") {
      setOngkir(0);
      if (selectedVoucher?.cut_nominal || false) {
        if (selectedVoucher.cut_nominal != 0) {
          const newGrandtotal = checkout.grandtotal - selectedVoucher.cut_nominal
          setGrandtotal(newGrandtotal);
        }
      } else {
        setGrandtotal(checkout.grandtotal);
      }

      if (selectedVoucher?.cut_percentage || false) {
        const cutPersen = selectedVoucher.cut_percentage;
        const oldGrantotal = checkout.grandtotal;
        const nominalPersen = oldGrantotal * cutPersen;
        const newGrandtotal = oldGrantotal - nominalPersen;
        setPersenValue(nominalPersen);
        setGrandtotal(newGrandtotal);
      } else {
        setGrandtotal(checkout.grandtotal);
      }

    } else {
      const filteredCost = costs.filter((x) => x.service == value);
      const ongkir = filteredCost[0].cost[0].value;
      const newGrandtotalWithOngkir = checkout.grandtotal + ongkir;
      setOngkir(ongkir);
      setGrandtotal(newGrandtotalWithOngkir);

      if (selectedVoucher?.cut_nominal || false) {
        if (selectedVoucher.cut_nominal != 0) {
          const newGrandtotal = checkout.grandtotal + ongkir - selectedVoucher.cut_nominal
          setGrandtotal(newGrandtotal);
        }
      }

      if (selectedVoucher?.cut_percentage || false) {
        const cutPersen = selectedVoucher.cut_percentage;
        const oldGrantotal = checkout.grandtotal;
        const nominalPersen = oldGrantotal * cutPersen;
        const newGrandtotal = oldGrantotal + ongkir - nominalPersen;
        setPersenValue(nominalPersen);
        setGrandtotal(newGrandtotal);
      }
      
    }
  };



  const handleClickCreateOrder = async () => {
    if (ongkir == 0) {
      return setMessage("Silahkan pilih jasa ekspedisi terlebih dahulu.");
    }
    const dataInsert = {
      detailOrder: checkout.detailOrder.map((val) => {
        return {
          product_name: val.product_name,
          qty: val.qty,
          discount_type: val.discount_type,
          voucher_type: selectedVoucher.voucher_type || null,
          price_per_item: val.price_per_item,
          weight: val.weight,
        }
      }),
      products_id: checkout.products_id,
      isFromCart: checkout.isFromCart,
      grandtotal,
      branch_name,
      branch_id,
    };
    const response = await dispatch(createOrder(dataInsert));
    const { status, data } = response;
    const { message } = data;
    if (status === 200) {
      dispatch(cartList());
      navigate("/upload/payment-proof");
    } else {
      setMessage(message);
    }
  };
  let total = 0;
  checkout?.detailOrder?.forEach((val, idx) => {
    total += parseInt(val.price_per_item) * parseInt(val.qty);
  });

  const getVoucherUser = async () => {
    try {
      const token = localStorage.getItem("my_Token");
      let response = await axios.get(
        `
      ${process.env.REACT_APP_API_BASE_URL}/transaction/voucher-user
      `,
        {
          headers: {
            authorization: token,
          },
        }
      );
      const { data } = response?.data;
      setVoucher(data);

    } catch (error) {
      console.log(error);
    }
  };

  const handleSelectedVoucher = (value) => {
    if (value == "0") {
      setSelectedVoucher({})
      setPersenValue(0)
      setGrandtotal(checkout.grandtotal + ongkir);
    } else {
      const filteredVoucher = voucher.filter((x) => x.id == value);
      setSelectedVoucher(filteredVoucher[0]);
      if (filteredVoucher[0].cut_percentage != null) {
        const cutPersen = filteredVoucher[0].cut_percentage;
        const oldGrantotal = checkout.grandtotal;
        const nominalPersen = oldGrantotal * cutPersen;
        const newGrandtotal = oldGrantotal + ongkir - nominalPersen;
        setPersenValue(nominalPersen);
        setGrandtotal(newGrandtotal);
      }

      if (filteredVoucher[0].cut_nominal != null && filteredVoucher[0].cut_nominal != 0) {
        const cutNominal = filteredVoucher[0].cut_nominal;
        const oldGrantotal = checkout.grandtotal;
        const newGrandtotal = oldGrantotal + ongkir - cutNominal;
        setGrandtotal(newGrandtotal);
      }
    }
  };

  useEffect(() => {
    (async () => {
      await getVoucherUser();
    })();
  },[]);

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
              <h3 className="font-semibold text-center text-gray-600 text-xs uppercase w-1/5 ">
                Weight
              </h3>
              <h3 className="font-semibold text-center text-gray-600 text-xs uppercase w-1/5">
                Subtotal Product
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
                  <CurrencyFormat
                    className="text-center w-1/5 font-semibold text-sm"
                    value={val.price_per_item}
                    displayType={"text"}
                    thousandSeparator={true}
                    prefix={"Rp. "}
                  />
                  <span className="text-center w-1/5 font-semibold text-sm">
                    {val.weight} Kg
                  </span>
                  <CurrencyFormat
                    className="text-center w-1/5 font-semibold text-sm"
                    value={total}
                    displayType={"text"}
                    thousandSeparator={true}
                    prefix={"Rp. "}
                  />
                </div>
              );
            })}

            <Link
              to={"/shopping-cart"}
              className="flex font-semibold text-indigo-600 text-sm mt-10"
            >
              <svg
                className="fill-current mr-2 text-indigo-600 w-4"
                viewBox="0 0 448 512"
              >
                <path d="M134.059 296H436c6.627 0 12-5.373 12-12v-56c0-6.627-5.373-12-12-12H134.059v-46.059c0-21.382-25.851-32.09-40.971-16.971L7.029 239.029c-9.373 9.373-9.373 24.569 0 33.941l86.059 86.059c15.119 15.119 40.971 4.411 40.971-16.971V296z" />
              </svg>
              Back
            </Link>
          </div>

          <div id="summary" className="w-2/4 px-8 py-8">
            <h1 className="font-semibold text-2xl border-b pb-8">
              Order Summary
            </h1>
            <div className="flex justify-between mt-10 mb-5">
              <span className="font-semibold text-sm uppercase">
                Items {checkout.count}
              </span>
              <CurrencyFormat
                className="font-semibold text-sm"
                value={grandtotal}
                displayType={"text"}
                thousandSeparator={true}
                prefix={"Rp. "}
              />
            </div>
            <div className="py-5">
              <label
                for="promo"
                className="font-semibold inline-block mb-3 text-sm uppercase"
              >
                Voucher
              </label>
              <select className="block p-2 text-gray-600 w-full text-sm"
              onChange={(e) => handleSelectedVoucher(e.target.value)}
              >
                <option value="0">-- select Voucher --</option>
                {voucher?.map((val) => {
                  return (
                    <option value={val.id}>
                      {val.voucher_type}, {val.description}
                    </option>
                  );
                })}
              </select>
            </div>
            <div>
              <label className="font-medium inline-block mb-3 text-sm uppercase">
                Select Destination
              </label>
              <select
                className="block p-2 text-gray-600 w-full text-sm"
                onChange={(e) => handleUserAddress(e.target.value)}
              >
                <option value="0">-- select destination --</option>
                {userAddress?.data?.map((val) => {
                  return (
                    <option value={val.id}>
                      {val.street_address}, {val.city}, {val.province},{" "}
                      {val.country} - {val.postal_code}
                    </option>
                  );
                })}
              </select>
            </div>
            <div>
              <label className="font-medium inline-block mb-3 text-sm uppercase">
                Select Expedition
              </label>
              <select
                className="block p-2 text-gray-600 w-full text-sm"
                onChange={(e) => handleExpedisiChange(e.target.value)}
              >
                <option value="0">-- select expedition --</option>
                <option value="jne">JNE</option>
                <option value="pos">POS</option>
                <option value="tiki">TIKI</option>
              </select>
              <select
                className="block p-2 text-gray-600 w-full text-sm"
                onChange={(e) => handleCostChange(e.target.value)}
              >
                <option value="0">-- select jasa --</option>
                {costs?.map((val) => {
                  const total =
                    parseInt(val.price_per_item) * parseInt(val.qty);

                  return (
                    <option value={val.service}>
                      {val.description} - {val.cost[0].value} (estimasi{" "}
                      {val.cost[0].etd} hari)
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="border-t mt-8">
              <div className="flex font-semibold justify-between py-1 text-sm uppercase">
                <span>Voucher <span style={{ fontSize: "10px", fontStyle: "italic" }}>{`( ${selectedVoucher.description || '-'} )`}</span></span>
                <CurrencyFormat
                  className="text-sm"
                  value={selectedVoucher.cut_nominal || persenValue || 0}
                  displayType={"text"}
                  thousandSeparator={true}
                  prefix={'Rp. -'}
                />
              </div>
              <div className="flex font-semibold justify-between py-1 text-sm uppercase">
                <span>Ongkir</span>
                <CurrencyFormat
                  className="text-sm"
                  value={ongkir}
                  displayType={"text"}
                  thousandSeparator={true}
                  prefix={"Rp. "}
                />
              </div>
              <div className="flex font-semibold justify-between py-1 text-sm uppercase">
                <span>Total </span>
                <CurrencyFormat
                  className="text-sm"
                  value={total}
                  displayType={"text"}
                  thousandSeparator={true}
                  prefix={"Rp. "}
                />
              </div>
              <div className="flex font-semibold justify-between py-6 text-sm uppercase">
                <span>Total cost</span>
                <CurrencyFormat
                  className="font-semibold text-lg"
                  value={grandtotal}
                  displayType={"text"}
                  thousandSeparator={true}
                  prefix={"Rp. "}
                />
              </div>
              <button
                className="bg-indigo-500 font-semibold hover:bg-indigo-600 py-3 text-sm text-white uppercase w-full"
                onClick={() => handleClickCreateOrder()}
              >
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
