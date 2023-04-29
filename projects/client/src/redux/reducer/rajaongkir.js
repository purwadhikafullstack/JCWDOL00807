import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  provinces: {},
  cities: {},
  costs: [],
  origin: {},
  errorMessage: null,
  loading: null,
};

export const rajaongkirSlice = createSlice({
  name: "rajaongkir",
  initialState,
  reducers: {
    provincesSuccess: (state, action) => {
      state.provinces = action.payload;
      state.loading = false;
    },

    citiesSuccess: (state, action) => {
      state.cities = action.payload;
      state.loading = false;
    },

    costsSuccess: (state, action) => {
      state.costs = action.payload.costs;
      state.loading = false;
    },
    originSuccess: (state, action) => {
        state.origin = action.payload;
        state.loading = false
    },
    failed: (state, action) => {
      state.errorMessage = action.payload;
      state.loading = null;
    },
  },
});

export const {
  provincesSuccess,
  citiesSuccess,
  costsSuccess,
  originSuccess,
  failed,
} = rajaongkirSlice.actions;
export default rajaongkirSlice.reducer;
