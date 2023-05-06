import axios from "axios";
import { toast } from "react-hot-toast";
import { authSlice } from "../reducer/auth";
import Swal from "sweetalert2";

export const keep_login_request = "keep_login_request";
export const keep_login_payload = "keep_login_payload";
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
      // toast(response.data.message);
      Swal.fire("Good Job!", `${response.data.message}`, "success");
    } catch (error) {
      dispatch(authSlice.actions.failed(error.response.data.message));
      console.log(error);

      // toast(error.response.data.message);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `${error.response.data.message}`,
      });
    }
  };
};

export const loginUser = ({ response }) => {
  return async (dispatch) => {
    try {
      console.log(response);
      dispatch(authSlice.actions.loginSuccess(response.data));
    } catch (error) {
      console.log(error);
    }
  };
};

export const keepLogin = () => {
  return async (dispatch) => {
    dispatch(authSlice.actions.getLoading(true));
    try {
      dispatch({ type: keep_login_request });
      const token = localStorage.my_Token;
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/user/keep-login`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      dispatch(authSlice.actions.keep_login_payload(response.data.data));
    } catch (error) {
      console.log(error);
    }
  };
};

export const updateProfile = ({ formData }) => {
  return async (dispatch) => {
    try {
      let token = localStorage.my_Token;
      const response = await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}/user/profile`,
        formData,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      dispatch(keepLogin());
      dispatch(authSlice.actions.updateProfileSuccess(response.data));
    } catch (error) {
      console.log(error.response.data.message);
      dispatch(authSlice.actions.failed(error.response.data.message));
    }
  };
};

export const handleStateError = (name) => {
  return async (dispatch) => {
    try {
      dispatch(authSlice.actions.stateError(name));
      dispatch(keepLogin());
    } catch (error) {
      console.log(error);
    }
  };
};
