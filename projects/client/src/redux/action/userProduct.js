import axios from "axios";
import { userProductSlice } from "../reducer/productUser";

export const findAll_productList_request = "findAll_productList_request";

export const userProductList = (data) => {
  return async (dispatch) => {
    // dispatch({ type: findAll_category_request });
    try {
      console.log(data);
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/user/list-product?latitude=${data.lat}&longitude=${data.lng}`
      );
      console.log(response);
      dispatch(userProductSlice.actions.getAllListProduct(response.data));
    } catch (error) {
      console.log(error);
      console.log(error.response.data.message);
      //   dispatch(categorySlice.actions.failed(error.response.data.message));
    }
  };
};
