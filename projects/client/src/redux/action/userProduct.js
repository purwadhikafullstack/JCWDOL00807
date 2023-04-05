import axios from "axios";
import { userProductSlice } from "../reducer/productUser";
import { useSelector, useDispatch } from "react-redux";

export const findAll_productList_request = "findAll_productList_request";

export const userProductList = (data) => {
  return async (dispatch) => {
    // dispatch({ type: findAll_category_request });
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
