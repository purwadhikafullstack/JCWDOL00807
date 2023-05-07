import axios from "axios";
import { categorySlice } from "../reducer/category";

export const findAll_category_request = "findAll_address_request";

export const findAllCategory = ({ sort, search, page }) => {
  return async (dispatch) => {
    dispatch({ type: findAll_category_request });

    try {
      let token = localStorage.my_Token;
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/categories/find-all?search=${search}&sort=${sort}&page=${page}&limit=5`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      // console.log(response);
      dispatch(categorySlice.actions.getAllCategorySuccess(response.data));
    } catch (error) {
      // console.log(error);
      console.log(error.response.data.message);
      dispatch(categorySlice.actions.failed(error.response.data.message));
    }
  };
};

export const handleStateError = (name) => {
  return async (dispatch) => {
    try {
      dispatch(categorySlice.actions.stateError(name));
    } catch (error) {
      console.log(error);
    }
  };
};

export const createCategory = (categoryName) => {
  return async (dispatch) => {
    try {
      let token = localStorage.my_Token;

      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/categories/products`,
        {
          name: categoryName,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      dispatch(findAllCategory({ sort: "", search: "", page: 0 }));
      console.log(response.data.message);
      dispatch(
        categorySlice.actions.createCategorySuccess(response.data.message)
      );
    } catch (error) {
      console.log(error);
      console.log(error.response.data.message);
      dispatch(categorySlice.actions.failed(error.response.data.message));
    }
  };
};

export const updateCategory = (categoryName, id_category) => {
  return async (dispatch) => {
    try {
      console.log(categoryName, id_category);
      let token = localStorage.my_Token;

      const response = await axios.patch(
        `${process.env.REACT_APP_API_BASE_URL}/categories/products/update/${id_category}`,
        {
          name: categoryName,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      dispatch(findAllCategory({ sort: "", search: "", page: 0 }));
      console.log(response.data.message);
      dispatch(
        categorySlice.actions.updateCategorySuccess(response.data.message)
      );
    } catch (error) {
      console.log(error);
      console.log(error.response.data.message);
      dispatch(categorySlice.actions.failed(error.response.data.message));
    }
  };
};

export const deleteCategory = (idCategory) => {
  return async (dispatch) => {
    try {
      console.log(idCategory);
      let token = localStorage.my_Token;

      const response = await axios.delete(
        `${process.env.REACT_APP_API_BASE_URL}/categories/products/delete/${idCategory}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      dispatch(findAllCategory({ sort: "", search: "", page: 0 }));
      console.log(response.data.message);
      dispatch(
        categorySlice.actions.deleteCategorySuccess(response.data.message)
      );
    } catch (error) {
      console.log(error);
      console.log(error.response.data.message);
      dispatch(categorySlice.actions.failed(error.response.data.message));
    }
  };
};
