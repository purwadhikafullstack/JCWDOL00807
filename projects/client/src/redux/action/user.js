import { authSlice } from "../reducer/auth";
import axios from "axios";

export const loginUser = ({ email, password }) => {
  return async (dispatch) => {
    try {
      const getUserLogin = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/user/login?email=${email}&password=${password}`
      );
      dispatch(authSlice.actions.loginSuccess(getUserLogin.data));
    } catch (error) {
      dispatch(authSlice.actions.failed(error.response.data.message));
    }
  };
};

export const keep_login_request = "keep_login_request";
export const keep_login_payload = "keep_login_payload";

export const keepLogin = () => {
  try {
    return async (dispatch) => {
      dispatch({ type: keep_login_request });
      let getStorage = localStorage.my_Token;
      let response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/user/keep-login`,
        {
          headers: {
            Authorization: `${getStorage}`,
          },
        }
      );
      dispatch(authSlice.actions.keep_login_payload(response.data.data));
    };
  } catch (error) {
    console.log(error);
  }
};
