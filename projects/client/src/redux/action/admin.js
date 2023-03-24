import axios from "axios";
import { toast } from "react-hot-toast";
import { adminSlice } from "../reducer/admin";
import { useNavigate,  } from "react-router-dom";

export const keep_login_admin_request = "keep_login_admin_request";
export const keep_login_admin_payload = "keep_login_admin_payload";

// export const registerUser = ({
//   name,
//   email,
//   password,
//   repeatPassword,
//   phone_number,
//   referral_code,
// }) => {
//   return async (dispatch) => {
//     try {
//       console.log(name, email, password, phone_number);
//       let response = await axios.post(
//         `${process.env.REACT_APP_API_BASE_URL}/users/register`,
//         { name, email, password, phone_number, ref_code: referral_code }
//       );
//       console.log(response.data);
//       dispatch(authSlice.actions.registerSuccess(response.data));
//       toast(response.data.message);
//     } catch (error) {
//       dispatch(authSlice.actions.failed(error.response.data.message));
//       console.log(error);
//       toast(error.response.data.message);
//     }
//   };
// };



export const loginAdmin = ({ email, password }) => {
    return async (dispatch) => {
        console.log(email, password)
        try {
            const getAdminLogin = await axios.get(
                `${process.env.REACT_APP_API_BASE_URL}/admin/login?email=${email}&password=${password}`
            );
            console.log(getAdminLogin.data.token)
            console.log(getAdminLogin.data)

            // Meneruskan informasi role pengguna ke action creator loginSuccess
            dispatch(adminSlice.actions.loginSuccess( getAdminLogin.data));

        } catch (error) {   
            console.log(error);
            dispatch(adminSlice.actions.failed(error.response.data.message));
        }
    };
};



export const keepLoginAdmin = () => {
  return async (dispatch) => {
    try {
      dispatch({ type: keep_login_admin_request });
      let getStorage = localStorage.my_Token;
      let response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/admin/keep-login`,
        {
          headers: {
            Authorization: `${getStorage}`,
          },
        }
      );
      dispatch(adminSlice.actions.keep_login_admin_payload(response.data.data));
      console.log(response.data.data)
    } catch (error) {
      console.log(error);
    }
  };
};


export const setUserRole = (role) => ({
    type: 'SET_USER_ROLE',
    payload: role,
  });


// export const updateProfile = ({ formData }) => {
//   return async (dispatch) => {
//     try {
//       let token = localStorage.my_Token;
//       const response = await axios.put(
//         `${process.env.REACT_APP_API_BASE_URL}/user/profile`,
//         formData,
//         {
//           headers: {
//             Authorization: token,
//           },
//         }
//       );
//       dispatch(keepLogin());
//       dispatch(authSlice.actions.updateProfileSuccess(response.data));
//     } catch (error) {
//       console.log(error.response.data.message);
//       dispatch(authSlice.actions.failed(error.response.data.message));
//     }
//   };
// };

export const handleStateError = (name) => {
  return async (dispatch) => {
    try {
      dispatch(adminSlice.actions.stateError(name));
    //   dispatch(keepLogin());
    } catch (error) {
      console.log(error);
    }
  };
};
