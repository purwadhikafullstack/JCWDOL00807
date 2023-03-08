import axios from "axios";
import { toast } from "react-hot-toast";
import { authSlice } from "../reducer/auth";

export const registerUser = ({
  name,
  email,
  password,
  repeatPassword,
  phone_number,
  referral_code,
}) => {
  return async (dispatch) => {
    try {
      console.log(name, email, password, phone_number);
      let response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/users/register`,
        { name, email, password, phone_number, ref_code: referral_code }
      );
      console.log(response.data);
      dispatch(authSlice.actions.registerSuccess(response.data));
      toast(response.data.message);
    } catch (error) {
      dispatch(authSlice.actions.failed(error.response.data.message));
      console.log(error);
      toast(error.response.data.message);
    }
  };
};
