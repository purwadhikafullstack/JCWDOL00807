import axios from "axios";
import { rajaongkirSlice } from "../reducer/rajaongkir";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export const getProvince = (id) => {
  return async (dispatch) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/raja-ongkir/province`,
        {
          params: {
            province_id: id || "",
          },
        }
      );
      dispatch(
        rajaongkirSlice.actions.provincesSuccess(response.data.data.rajaongkir)
      );
    } catch (error) {
      console.log(error);
      console.log(error.response.data.message);
      alert(error.response.data.message);
      dispatch(rajaongkirSlice.actions.failed(error.response.data.message));
    }
  };
};

export const getCity = (province_id, city_id) => {
  return async (dispatch) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/raja-ongkir/city`,
        {
          params: {
            province_id: province_id || "",
            city_id: city_id || "",
          },
        }
      );
      dispatch(
        rajaongkirSlice.actions.citiesSuccess(response.data.data.rajaongkir)
      );
    } catch (error) {
      console.log(error);
      console.log(error.response.data.message);
      // alert(error.response.data.message);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `${error.response.data.message}`,
      });

      dispatch(rajaongkirSlice.actions.failed(error.response.data.message));
    }
  };
};

export const getCost = (origin, destination, weight, courier) => {
  return async (dispatch) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/raja-ongkir/cost`,
        {
          origin,
          destination,
          weight,
          courier,
        }
      );
      dispatch(
        rajaongkirSlice.actions.costsSuccess(response.data.data.rajaongkir)
      );
    } catch (error) {
      console.log(error);
      console.log(error.response.data.message);
      // alert(error.response.data.message);
      dispatch(rajaongkirSlice.actions.failed(error.response.data.message));
    }
  };
};

export const getOrigin = (branch_name) => {
  return async (dispatch) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/raja-ongkir/getorigin`,
        {
          params: {
            branch: branch_name,
          },
        }
      );
      dispatch(rajaongkirSlice.actions.originSuccess(response.data.data));
    } catch (error) {
      console.log(error);
      console.log(error.response.data.message);
      // alert(error.response.data.message);
      dispatch(rajaongkirSlice.actions.failed(error.response.data.message));
    }
  };
};

export const getCityByAddress = (cityName) => {
  return async (dispatch) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/raja-ongkir/getcity`,
        {
          params: {
            cityname: cityName,
          },
        }
      );
      dispatch(rajaongkirSlice.actions.citiesSuccess(response.data.data));
    } catch (error) {
      console.log(error);
      console.log(error.response.data.message);
      // alert(error.response.data.message);
      dispatch(rajaongkirSlice.actions.failed(error.response.data.message));
    }
  };
};

export const costToDefault = () => {
  return (dispatch) => {
    dispatch(rajaongkirSlice.actions.costsDefault());
  };
};

export const citiesToDefault = () => {
  return (dispatch) => {
    dispatch(rajaongkirSlice.actions.citiesDefault());
  };
};
