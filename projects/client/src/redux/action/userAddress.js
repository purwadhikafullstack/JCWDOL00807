import axios from "axios";
import { addressSlice } from "../reducer/address";

export const findAll_address_request = "findAll_address_request";
export const findAll_address_payload = "findAll_address_payload";

export const handleStateError = (name) => {
  return async (dispatch) => {
    try {
      dispatch(addressSlice.actions.stateError(name));
    } catch (error) {
      console.log(error);
    }
  };
};

export const findAllAddress = () => {
  return async (dispatch) => {
    dispatch({ type: findAll_address_request });
    // loading jadikeun true
    // dispatch(addressSlice.actions.loadingAddress(true));
    // dispatch(addressSlice.actions.getAllAddress());
    try {
      let token = localStorage.my_Token;

      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/user-address/find-all`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      dispatch(addressSlice.actions.getAllAddress(response.data));
      // loading jadikeun false
    } catch (error) {
      console.log(error);
      // console.log(error.response.data.message);
      dispatch(addressSlice.actions.failed(error.response.data));
      // loading jadikeun false
    }
  };
};

export const createUserAddress = ({ formData }) => {
  return async (dispatch) => {
    console.log(formData);
    try {
      let token = localStorage.my_Token;

      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/user-address/create-address`,

        formData,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      dispatch(findAllAddress());
      dispatch(
        addressSlice.actions.updateAddressSuccess(response.data.message)
      );

      console.log(response.data);
    } catch (error) {
      console.log(error);
      console.log(error.response.data.message);
      dispatch(addressSlice.actions.failed(error.response.data.message));
    }
  };
};

export const updateUserAddress = ({ formData }, { id_address }) => {
  return async (dispatch) => {
    try {
      let token = localStorage.my_Token;
      const response = await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}/user-address/update-address/${id_address}`,
        formData,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      dispatch(findAllAddress());
      dispatch(addressSlice.actions.editAddressSuccess(response.data.message));
    } catch (error) {
      console.log(error);
      console.log(error.response.data.message);
      dispatch(addressSlice.actions.failed(error.response.data.message));
    }
  };
};

export const deleteUserAddress = ({ id_address }) => {
  return async (dispatch) => {
    console.log(id_address);
    try {
      let token = localStorage.my_Token;
      const response = await axios.delete(
        `${process.env.REACT_APP_API_BASE_URL}/user-address/remove-address/${id_address}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      dispatch(findAllAddress());
      dispatch(addressSlice.actions.editAddressSuccess(response.data.message));
      console.log(response.data);
    } catch (error) {
      console.log(error);
      console.log(error.response.data.message);
      dispatch(addressSlice.actions.failed(error.response.data.message));
    }
  };
};
