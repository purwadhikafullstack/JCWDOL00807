import axios from "axios";
import { productSlice } from "../reducer/product";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export const createProduct = ({ formData }, { token }) => {
  return async (dispatch) => {
    try {
      //   let token = localStorage.my_Token;
      console.log(formData);
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/admin/product`,
        formData,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      console.log("a");
      dispatch(productSlice.actions.createProductSuccess(response.data));

      console.log(response);
      Swal.fire("Good Job!", "Create Product Success", "success");
      window.location.reload();
    } catch (error) {
      console.log(error);
      console.log(error.response.data.message);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `${error.response.data.message}`,
      });
      dispatch(productSlice.actions.failed(error.response.data.message));
    }
  };
};

export const editProduct = ({ formData }, { id_product }, { token }) => {
  return async (dispatch) => {
    console.log(formData);
    // const navigate = useNavigate();
    try {
      //   let token = localStorage.my_Token;
      const response = await axios.patch(
        `${process.env.REACT_APP_API_BASE_URL}/admin/product/${id_product}`,
        formData,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      dispatch(productSlice.actions.editProductSuccess(response.data));
      // toast(response.data.message);
      Swal.fire("Good Job!", `${response.data.message}`, "success");

      console.log(response.data);
      // navigate("/admin/manage-product");
      window.location.reload();
    } catch (error) {
      console.log(error);
      console.log(error.response.data.message);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `${error.response.data.message}`,
      });
      dispatch(productSlice.actions.failed(error.response.data.message));
    }
  };
};

export const updateStock = (data) => {
  return async (dispatch) => {
    try {
      console.log(data);

      let token = localStorage.my_Token;

      const response = await axios.patch(
        `${process.env.REACT_APP_API_BASE_URL}/admin/product-stock/update/${data.id_product}?stock=${data.stock}&description=${data.description}`,
        {},
        {
          headers: {
            Authorization: token,
          },
        }
      );
      console.log(response);
      dispatch(productSlice.actions.updateCategorySuccess(response.data));
    } catch (error) {
      console.log(error);
      console.log(error.response.data.message);
      dispatch(productSlice.actions.failed(error.response.data.message));
    }
  };
};
