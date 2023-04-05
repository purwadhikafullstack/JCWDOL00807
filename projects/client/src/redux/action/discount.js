import axios from "axios";
import { discountSlice } from "../reducer/discount";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const createDiscount = ({
  discount_type,
  description,
  cut_nominal,
  cut_percentage,
  start,
  end,
  token,
  idProduct,
}) => {
  return async (dispatch) => {
    console.log(discount_type, description, cut_nominal, start, end);

    try {
      //   let token = localStorage.my_Token;

      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/discount/discount`,
        {
          discount_type,
          description,
          cut_nominal,
          cut_percentage,
          start,
          end,
          idProduct,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      dispatch(discountSlice.actions.createDiscountSuccess(response.data));

      console.log(response.data);
      alert("Create Discount Success");

      window.location.reload();
    } catch (error) {
      console.log(error);
      //   alert(error.message);
      console.log(error.response.data.message);
      alert(error.response.data.message);
      dispatch(discountSlice.actions.failed(error.response.data.message));
    }
  };
};

export const updateDiscount = ({
  discount_type,
  description,
  cut_nominal,
  cut_percentage,
  start,
  end,
  id,
  token,
}) => {
  return async (dispatch) => {
    console.log(
      discount_type,
      description,
      cut_nominal,
      cut_percentage,
      start,
      end
    );

    try {
      //   let token = localStorage.my_Token;

      const response = await axios.patch(
        `${process.env.REACT_APP_API_BASE_URL}/discount/discount/${id}`,
        { discount_type, description, cut_nominal, cut_percentage, start, end },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      dispatch(discountSlice.actions.updateDiscountSuccess(response.data));

      console.log(response.data);
      alert("Update Discount Success");

      window.location.reload();
    } catch (error) {
      console.log(error);
      console.log(error.response.data.message);
      alert(error.response.data.message);
      dispatch(discountSlice.actions.failed(error.response.data.message));
    }
  };
};
