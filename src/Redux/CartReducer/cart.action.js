import axios from "axios";
import { BASE_URL } from "../../baseurl";
import {
  CART_ADD,
  CART_CLEAR,
  CART_ERROR,
  CART_REMOVE,
  CART_REQUEST,
  CART_SUCCESS,
} from "./cart.actionType";

// The cart lives in db.json as two collections, one per product type. Every row
// is stamped with the owner's email so one person's cart isn't everyone's.
const collectionFor = (kind) => (kind === "hotel" ? "hotelcart" : "flightcart");

export const fetchCart = (email) => async (dispatch) => {
  dispatch({ type: CART_REQUEST });
  try {
    const owner = `user_email=${encodeURIComponent(email)}`;
    const [hotels, flights] = await Promise.all([
      axios.get(`${BASE_URL}/hotelcart?${owner}`),
      axios.get(`${BASE_URL}/flightcart?${owner}`),
    ]);
    dispatch({
      type: CART_SUCCESS,
      payload: { hotels: hotels.data, flights: flights.data },
    });
  } catch (err) {
    dispatch({ type: CART_ERROR });
  }
};

export const addToCart = (kind, item, email) => async (dispatch) => {
  // Drop the catalogue id before posting. json-server keeps whatever id it is
  // handed, so reusing it would clash with a row already in the cart and the
  // POST would fail. Keep it as catalog_id so we can still trace the original.
  const { id, ...rest } = item;
  const res = await axios.post(`${BASE_URL}/${collectionFor(kind)}`, {
    ...rest,
    catalog_id: id,
    user_email: email,
  });
  dispatch({ type: CART_ADD, payload: { kind, item: res.data } });
  return res.data;
};

export const removeFromCart = (kind, id) => async (dispatch) => {
  await axios.delete(`${BASE_URL}/${collectionFor(kind)}/${id}`);
  dispatch({ type: CART_REMOVE, payload: { kind, id } });
};

// Checkout turns the cart into a booking, then empties it.
export const placeBooking = (booking, hotels, flights) => async (dispatch) => {
  const res = await axios.post(`${BASE_URL}/bookings`, booking);
  await Promise.all([
    ...hotels.map((row) => axios.delete(`${BASE_URL}/hotelcart/${row.id}`)),
    ...flights.map((row) => axios.delete(`${BASE_URL}/flightcart/${row.id}`)),
  ]);
  dispatch({ type: CART_CLEAR });
  return res.data;
};
