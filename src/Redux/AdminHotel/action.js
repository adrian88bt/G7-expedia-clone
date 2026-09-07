import axios from "axios";
import { BASE_URL } from "../../baseurl";
import {
  HOTEL_FAILURE,
  HOTEL_REQUEST,
  GET_HOTEL_SUCCESS,
  POST_HOTEL_SUCCESS,
  NEW_GET_HOTELS_SUCCESS,
  DELETE_HOTEL,
} from "./actionType";

export const getHotelSuccess = (payload) => {
  return { type: GET_HOTEL_SUCCESS, payload };
};

export const postHotelSuccess = (payload) => {
  return { type: POST_HOTEL_SUCCESS };
};

export const hotelRequest = () => {
  return { type: HOTEL_REQUEST };
};

export const hotelFailure = () => {
  return { type: HOTEL_FAILURE };
};

export const fetch_hotel = (payload) => {
  return { type: NEW_GET_HOTELS_SUCCESS, payload };
};

//
export const handleDeleteHotel = (payload) => {
  return { type: DELETE_HOTEL, payload };
};

//

export const addHotel = (payload) => (dispatch) => {
  dispatch(hotelRequest());

  axios
    .post(`${BASE_URL}/hotel`, payload)
    .then(() => {
      dispatch(postHotelSuccess());
    })
    .catch((err) => {
      dispatch(hotelFailure());
    });
};

export const fetchingHotels = (limit) => (dispatch) => {
  axios
    .get(`${BASE_URL}/hotel?_limit=${limit}`)
    .then((res) => {
      //   console.log(res.data);
      dispatch(fetch_hotel(res.data));
    })
    .catch((err) => {
      console.log(err);
    });
};

export const DeleteHotel = (deleteId) => async (dispatch) => {
  try {
    const res = await fetch(
      `${BASE_URL}/hotel/${deleteId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    let data = await res.json();
    console.log(data);
    dispatch(handleDeleteHotel(deleteId));
  } catch (e) {
    console.log(e);
  }
};
