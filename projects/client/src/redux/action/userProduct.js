import axios from "axios";
import { userProductSlice } from "../reducer/productUser";

export const userProductList = (data) => {
  return async (dispatch) => {
    dispatch(userProductSlice.actions.getLoading(true));
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/user/list-product?latitude=${data.lat}&longitude=${data.lng}`
      );

      dispatch(userProductSlice.actions.getAllListProduct(response.data));
      dispatch(userProductSlice.actions.getLoadingFalse(false));
    } catch (error) {
      dispatch(userProductSlice.actions.getLoading(true));
      dispatch(userProductSlice.actions.failed(error.response));
    }
  };
};

export const userProductDetail = (id) => {
  return async (dispatch) => {
    dispatch(userProductSlice.actions.getProductDetail(id));
  };
};
