import axios from "axios";
import { toast } from "react-hot-toast";
import { orderSlice } from "../reducer/order";

export const listOrder = (page, limit, searchText) => {
  return async (dispatch) => {
    dispatch(orderSlice.actions.startLoading());
    try {
      let getStorage = localStorage.my_Token;
      let response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/order/order-list`,
        {
          params: {
            _page: page,
            _limit: limit,
            _search: searchText,
          },
          headers: {
            Authorization: `${getStorage}`,
          },
        }
      );
      // debugger;
      console.log(response);
      dispatch(orderSlice.actions.updatePageLimit({ page, limit }));
      dispatch(orderSlice.actions.listOrdersSuccess(response.data.data));
    } catch (error) {
      console.log(error);
      dispatch(orderSlice.actions.hasError(error));
    }
  };
};
