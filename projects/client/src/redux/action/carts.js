import axios from "axios";
import { cartSlice } from "../reducer/carts";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export const cartList = (branch_id) => {
  return async (dispatch) => {
    try {
      let token = localStorage.my_Token;
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/cart/list/${branch_id}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      dispatch(cartSlice.actions.listSuccess(response.data.data));
    } catch (error) {
      console.log(error);
      console.log(error.response.data.message);
      // alert(error.response.data.message);
      dispatch(cartSlice.actions.failed(error.response.data.message));
    }
  };
};

export const addToCart = (product_id, qty, branch_id) => {
  return async (dispatch) => {
    // debugger
    try {
      let token = localStorage.my_Token;
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/cart/add-to-cart`,
        {
          product_id,
          qty,
          branch_id,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      dispatch(cartSlice.actions.addToCartSuccess(response.data.data));
      // alert("Add to cart success");
      Swal.fire("Good Job!", "Add item to cart success", "success");
    } catch (error) {
      console.log(error);
      console.log(error.response.data.message);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `${error.response.data.message}`,
      });

      // alert(error.response.data.message);
      dispatch(cartSlice.actions.failed(error.response.data.message));
    }
  };
};

export const updateCartQty = (product_id, qty, branch_id) => {
  return async (dispatch) => {
    try {
      let token = localStorage.my_Token;
      const response = await axios.patch(
        `${process.env.REACT_APP_API_BASE_URL}/cart/updateQty`,
        {
          product_id,
          qty,
          branch_id,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      dispatch(cartSlice.actions.updateQtySuccess(response.data.data));
      // toast.success("Update cart success");
      Swal.fire("Good Job!", "Update item to cart success", "success");
    } catch (error) {
      console.log(error);
      console.log(error.response.data.message);
      // alert(error.response.data.message);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `${error.response.data.message}`,
      });

      dispatch(cartSlice.actions.failed(error.response.data.message));
    }
  };
};

export const deleteCartQty = (product_id, branch_id) => {
  return async (dispatch) => {
    try {
      let token = localStorage.my_Token;
      const response = await axios.delete(
        `${process.env.REACT_APP_API_BASE_URL}/cart/deleteQty/`,
        {
          headers: {
            Authorization: token,
          },
          data: {
            product_id,
            branch_id,
          },
        }
      );
      dispatch(cartSlice.actions.deleteQtySuccess(response.data.data));
      // toast.success("Delete item from cart success");
      Swal.fire("Good Job!", "Delete item from cart success", "success");
    } catch (error) {
      console.log(error);
      console.log(error.response.data.message);
      // alert(error.response.data.message);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `${error.response.data.message}`,
      });
      dispatch(cartSlice.actions.failed(error.response.data.message));
    }
  };
};

export const saveCartToCheckout = (checkout) => {
  return (dispatch) => {
    dispatch(cartSlice.actions.savetoCheckout(checkout));
  };
};
