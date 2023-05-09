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
  addToCart,
  cartList,
  updateCartQty,
  deleteCartQty,
  saveCartToCheckout,
} from "../redux/action/carts";

const CartList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const { carts, count, cart } = useSelector((state) => state.carts);
  let userProduct = useSelector((state) => state.userProduct.userProduct);
  const branch_id = userProduct?.data?.branch_id;
  let grandtotal = 0;
  let totalweight = 0;

  const min = 1;
  const max = 100;

  const handleClose = () => {
    setMessage("");
  };

  const handleUpdateQty = async (product_id, qty, stock) => {
    const value = Math.max(min, Math.min(max, Number(qty)));
    if (value > stock) {
      setMessage("Out of stock");
    } else {
      await dispatch(updateCartQty(product_id, value, branch_id));
      await dispatch(cartList(branch_id));
    }
  };

  const handleDelete = async (product_id) => {
    await dispatch(deleteCartQty(product_id, branch_id));
    await dispatch(cartList(branch_id));
  };

  const handleQuantityChange = async (event, product_id, stock) => {
    const value = Math.max(min, Math.min(max, Number(event?.target?.value)));
    if (value > stock) {
      setMessage("Out of stock");
    } else {
      if (!isNaN(value)) {
        await dispatch(updateCartQty(product_id, value, branch_id));
        await dispatch(cartList(branch_id));
      } else {
        await dispatch(updateCartQty(product_id, 1, branch_id));
        await dispatch(cartList(branch_id));
      }
    }
  };

  // const handleQuantityBlur = async (event, product_id, stock) => {
  //   const value = Math.max(min, Math.min(max, Number(event.target.value)));
  //   if (value > stock) {
  //     setMessage("Out of stock");
  //   } else {
  //     if (!isNaN(value)) {
  //       await dispatch(updateCartQty(product_id, value, branch_id));
  //       await dispatch(cartList(branch_id));
  //     } else {
  //       await dispatch(updateCartQty(product_id, 1, branch_id));
  //       await dispatch(cartList(branch_id));
  //     }
  //   }
  // };

  const handleCheckout = () => {
    const checkout = {
      detailOrder: carts.map((cart) => {
        return {
          product_name: cart.product_name,
          qty: cart.qty,
          discount_type: cart.discount_type,
          voucher_type: null,
          price_per_item: cart.price_after_discount,
          weight: cart.product_weight,
        };
      }),
      products_id: carts.map((cart) => {
        return {
          product_id: cart.item_products_id,
        };
      }),
      count,
      isFromCart: true,
      grandtotal,
      totalweight,
    };
    console.log(checkout);
    dispatch(saveCartToCheckout(checkout));
    navigate("/shipping");
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto mt-10">
        <div className="flex shadow-md my-10">
          <div className="w-3/4 bg-white px-10 py-10">
            <div className="flex justify-between border-b pb-8">
              <h1 className="font-semibold text-2xl">Shopping Cart</h1>
              <h2 className="font-semibold text-2xl">{count} Items</h2>
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
            {carts?.map((val, idx) => {
              const imageUrl =
                "http://localhost:8000/" +
                val?.product_image?.replace("Admin/", "");
              const total =
                parseInt(val?.price_after_discount) * parseInt(val?.qty);
              grandtotal = grandtotal + total;
              const weightInGram = parseInt(val?.product_weight) * 1000;
              totalweight = totalweight + weightInGram;

              return (
                <div className="flex items-center hover:bg-gray-100 -mx-8 px-6 py-5">
                  <div className="flex w-2/5">
                    <div className="w-20">
                      <img className="h-24" src={imageUrl} alt="" />
                    </div>
                    <div className="flex flex-col justify-between ml-4 flex-grow">
                      <span className="font-bold text-sm">
                        {val.product_name}
                      </span>
                      <a
                        href="#"
                        className="font-semibold hover:text-red-500 text-gray-500 text-xs"
                        onClick={() => handleDelete(val.item_products_id)}
                      >
                        Remove
                      </a>
                    </div>
                  </div>
                  <div className="flex justify-center items-center">
                    <button
                      className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l"
                      onClick={() =>
                        handleUpdateQty(
                          val.item_products_id,
                          val.qty - 1,
                          val.product_stock
                        )
                      }
                    >
                      -
                    </button>
                    <input
                      className="mx-2 border text-center w-8"
                      type="text"
                      value={val.qty}
                      onChange={(event) =>
                        handleQuantityChange(
                          event,
                          val.item_products_id,
                          val.product_stock
                        )
                      }
                      // onBlur={(event) =>
                      //   handleQuantityBlur(
                      //     event,
                      //     val.item_products_id,
                      //     val.product_stock
                      //   )
                      // }
                    />
                    <button
                      className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r"
                      onClick={() =>
                        handleUpdateQty(
                          val.item_products_id,
                          val.qty + 1,
                          val.product_stock
                        )
                      }
                    >
                      +
                    </button>
                  </div>
                  <CurrencyFormat
                    className="text-center w-1/5 font-semibold text-sm"
                    value={parseInt(val?.price_after_discount)}
                    displayType={"text"}
                    thousandSeparator={true}
                    prefix={"Rp. "}
                  />
                  <CurrencyFormat
                    className="text-center w-1/5 font-semibold text-sm"
                    value={parseInt(total)}
                    displayType={"text"}
                    thousandSeparator={true}
                    prefix={"Rp. "}
                  />
                </div>
              );
            })}

            <a
              href="/"
              className="flex font-semibold text-indigo-600 text-sm mt-10"
            >
              <svg
                className="fill-current mr-2 text-indigo-600 w-4"
                viewBox="0 0 448 512"
              >
                <path d="M134.059 296H436c6.627 0 12-5.373 12-12v-56c0-6.627-5.373-12-12-12H134.059v-46.059c0-21.382-25.851-32.09-40.971-16.971L7.029 239.029c-9.373 9.373-9.373 24.569 0 33.941l86.059 86.059c15.119 15.119 40.971 4.411 40.971-16.971V296z" />
              </svg>
              Continue Shopping
            </a>
          </div>

          <div id="summary" className="w-1/4 px-8 py-10">
            <h1 className="font-semibold text-2xl border-b pb-8">
              Order Summary
            </h1>
            <div className="flex justify-between mt-10 mb-5">
              <span className="font-semibold text-sm uppercase">
                Items {count}
              </span>
              <CurrencyFormat
                className="font-semibold text-sm"
                value={grandtotal}
                displayType={"text"}
                thousandSeparator={true}
                prefix={"Rp. "}
              />
            </div>
            <div className="border-t mt-8">
              <div className="flex font-semibold justify-between py-6 text-sm uppercase">
                <span>Total cost</span>
                <CurrencyFormat
                  className="font-semibold text-sm"
                  value={grandtotal}
                  displayType={"text"}
                  thousandSeparator={true}
                  prefix={"Rp. "}
                />
              </div>
              <button
                onClick={() => handleCheckout()}
                className="bg-indigo-500 font-semibold hover:bg-indigo-600 py-3 text-sm text-white uppercase w-full"
              >
                Checkout
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

export default CartList;
