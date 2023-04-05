import axios from "axios";
import { toast } from "react-hot-toast";
import { adminSlice } from "../reducer/admin";
import jwtDecode from "jwt-decode";
import { useNavigate } from "react-router-dom";

export const keep_login_admin_request = "keep_login_admin_request";
export const keep_login_admin_payload = "keep_login_admin_payload";


const validateToken = (accessToken) => {};

export const loginAdmin = ({ email, password }) => {
  return async (dispatch) => {
    console.log(email, password);
    try {
      const getAdminLogin = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/admin/login?email=${email}&password=${password}`
      );
      console.log(getAdminLogin.data.token);
      console.log(getAdminLogin.data);

      // Meneruskan informasi role pengguna ke action creator loginSuccess
      dispatch(adminSlice.actions.loginSuccess(getAdminLogin.data));
    } catch (error) {
      console.log(error);
      dispatch(adminSlice.actions.failed(error.response.data.message));
      toast.error(error.response.data.message);
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
      console.log(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };
};


export const listAdminByRole = (page, limit, searchText) => {
  return async (dispatch) => {
    dispatch(adminSlice.actions.startLoading());
    try {
      let getStorage = localStorage.my_Token;
      let response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/admin/management`,
        {
          params: {
            role: "admin branch",
            _page: page,
            _limit: limit,
            _search: searchText
          },
          headers: {
            Authorization: `${getStorage}`,
          },
        }
      );
      // debugger;
      // console.log(response.data.data);
      dispatch(adminSlice.actions.updatePageLimit({page, limit}));
      dispatch(adminSlice.actions.listAdminSuccess(response.data.data));
    } catch (error) {
      console.log(error);
      dispatch(adminSlice.actions.hasError(error));
    }
  };
};
export const createAdminByRole = (data) => {
  return async (dispatch) => {
    // debugger;
    dispatch(adminSlice.actions.startLoading());
    try {
      let getStorage = localStorage.my_Token;
      let response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/admin/create-admin-branch`,
        data,
        {
          headers: {
            Authorization: `${getStorage}`,
          },
        }
      );
      console.log(response.data.data);
      dispatch(adminSlice.actions.createAdminSuccess(response.data.data));
      return response;
    } catch (error) {
      dispatch(adminSlice.actions.hasError(error.response.data));
      return error.response;
    }
  };
};

export const updateAdminByRole = (dataUpdate, id) => {
  return async (dispatch) => {
    dispatch(adminSlice.actions.startLoading());
    try {
      let getStorage = localStorage.my_Token;
      let response = await axios.patch(
        `${process.env.REACT_APP_API_BASE_URL}/admin/update-admin-branch`,
        dataUpdate,
        {
          params: {
            id
          },
          headers: {
            Authorization: `${getStorage}`,
          },
        }
      );
      console.log(response.data.data);
      dispatch(adminSlice.actions.updateAdminSuccess(response.data.data));
      return response;
    } catch (error) {
      console.log(error);
      dispatch(adminSlice.actions.hasError(error));
      return error.response;
    }
  };
};

export const deleteAdminByRole = (id) => {
  return async (dispatch) => {
    dispatch(adminSlice.actions.startLoading());
    try {
      let getStorage = localStorage.my_Token;
      let response = await axios.delete(
        `${process.env.REACT_APP_API_BASE_URL}/admin/delete-admin-branch`,
        {
          params: {
            id
          },
          headers: {
            Authorization: `${getStorage}`,
          },
        }
      );
      console.log(response.data.data);
      dispatch(adminSlice.actions.deleteAdminSuccess(response.data.data));
      window.location.reload()
    } catch (error) {
      console.log(error);
      dispatch(adminSlice.actions.hasError(error));
    }
  };
};

export const getBranchStore = () => {
  return async (dispatch) => {
    dispatch(adminSlice.actions.startLoading());
    try {
      let getStorage = localStorage.my_Token;
      let response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/admin/branch-store`,
        {
          headers: {
            Authorization: `${getStorage}`,
          },
        }
      );
      console.log(response.data.data);
      dispatch(adminSlice.actions.getBranchStoreSuccess(response.data.data));
    } catch (error) {
      console.log(error);
      dispatch(adminSlice.actions.hasError(error));
    }
  };
};



export const handleStateError = (name) => {
  return async (dispatch) => {
    try {
      dispatch(adminSlice.actions.stateError(name));
      dispatch(keepLoginAdmin());
    } catch (error) {
      console.log(error);
    }
  };
};
