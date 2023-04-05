import axios from "axios";
import { voucherSlice } from "../reducer/voucher";
import { toast } from "react-hot-toast";

export const createVoucher = ({ formData }, { token }) => {
  return async (dispatch) => {
    console.log(formData);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/discount/voucher`,
        formData,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      dispatch(voucherSlice.actions.createVoucherSuccess(response.data));

      console.log(response.data);
      toast(response.data.message);
      alert("Create Voucher Success");
      window.location.reload();
    } catch (error) {
      console.log(error);
      alert(error.message);
      console.log(error.response.data.message);
      toast(error.response.data.message);
      dispatch(voucherSlice.actions.failed(error.response.data.message));
    }
  };
};

export const updateVoucher = ({ formData }, { id }, { token }) => {
  return async (dispatch) => {
    console.log(formData);
    try {
      //   let token = localStorage.my_Token
      console.log(id);
      const response = await axios.patch(
        `${process.env.REACT_APP_API_BASE_URL}/discount/voucher/${id}`,
        formData,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      dispatch(voucherSlice.actions.updateVoucherSuccess(response.data));
      toast(response.data.message);
      console.log(response.data);
      alert("Edit Voucher Success");

      window.location.reload();
    } catch (error) {
      console.log(error);
      console.log(error.response.data.message);
      alert(error.message);
      toast(error.response.data.message);
      dispatch(voucherSlice.actions.failed(error.response.data.message));
    }
  };
};
