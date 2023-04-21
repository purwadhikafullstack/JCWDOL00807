import React from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar2";
import Footer from "../components/Footer";
import BackdropResetPassword from "../components/BackdropResetPassword";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
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
  const branch_id = userProduct?.data?.branch_id
  let grandtotal = 0;
  let totalweight = 0;

  const min = 1;
  const max = 100;

  const handleClose = () => {
    setMessage("");
    navigate("/login");
  };

  const handleUpdateQty = (product_id, qty) => {
    const value = Math.max(min, Math.min(max, Number(qty)));
    dispatch(updateCartQty(product_id, value, branch_id));
  };

  const handleDelete = (product_id) => {
    dispatch(deleteCartQty(product_id, branch_id));
  };

  const handleQuantityChange = (event, product_id) => {
    const value = Math.max(min, Math.min(max, Number(event.target.value)));
    dispatch(updateCartQty(product_id, value, branch_id));
  };

  const handleQuantityBlur = (event, product_id) => {
    const value = Math.max(min, Math.min(max, Number(event.target.value)));
    if (!isNaN(value)) {
      dispatch(updateCartQty(product_id, value, branch_id));
    } else {
      dispatch(updateCartQty(product_id, 1, branch_id));
    }
  };

  const handleCheckout = () => {
    const checkout = {
        detailOrder: carts.map(cart => {
            return {
                product_name: cart.product_name,
                qty: cart.qty,
                discount_type: null,
                voucher_type: null,
                price_per_item: cart.price,
                weight: cart.product_weight,
            }
        }),
        products_id: carts.map(cart => {
            return {
                product_id: cart.item_products_id,
            }
        }),
        count,
        isFromCart: true,
        grandtotal,
        totalweight
    }
    console.log(checkout);
    dispatch(saveCartToCheckout(checkout));
    navigate("/shipping")
  }

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
                val.product_image.replace("Admin/", "");
              const total = parseInt(val.price) * parseInt(val.qty);
              grandtotal = grandtotal + total;
              const weightInGram = parseInt(val.product_weight) * 1000;
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
                        handleUpdateQty(val.item_products_id, val.qty - 1)
                      }
                    >
                      -
                    </button>
                    <input
                      className="mx-2 border text-center w-8"
                      type="text"
                      value={val.qty}
                      onChange={(event) => handleQuantityChange(event, val.item_products_id)}
                      onBlur={(event) => handleQuantityBlur(event, val.item_products_id)}
                    />
                    <button
                      className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r"
                      onClick={() =>
                        handleUpdateQty(val.item_products_id, val.qty + 1)
                      }
                    >
                      +
                    </button>
                  </div>
                  <span className="text-center w-1/5 font-semibold text-sm">
                    Rp. {val.price}
                  </span>
                  <span className="text-center w-1/5 font-semibold text-sm">
                    Rp. {total}
                  </span>
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
              <span className="font-semibold text-sm"> Rp. {grandtotal}</span>
            </div>
            {/* <div>
              <label className="font-medium inline-block mb-3 text-sm uppercase">
                Shipping
              </label>
              <select className="block p-2 text-gray-600 w-full text-sm">
                <option>Standard shipping - $10.00</option>
              </select>
            </div> */}
            <div className="py-10">
              <label
                for="promo"
                className="font-semibold inline-block mb-3 text-sm uppercase"
              >
                Promo Code
              </label>
              <input
                type="text"
                id="promo"
                placeholder="Enter your code"
                className="p-2 text-sm w-full"
              />
            </div>
            <button className="bg-red-500 hover:bg-red-600 px-5 py-2 text-sm text-white uppercase">
              Apply
            </button>
            <div className="border-t mt-8">
              <div className="flex font-semibold justify-between py-6 text-sm uppercase">
                <span>Total cost</span>
                <span> Rp. {grandtotal}</span>
              </div>
              <button onClick={() => handleCheckout()} className="bg-indigo-500 font-semibold hover:bg-indigo-600 py-3 text-sm text-white uppercase w-full">
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
