import {
  CART_ADD,
  CART_CLEAR,
  CART_ERROR,
  CART_REMOVE,
  CART_REQUEST,
  CART_SUCCESS,
} from "./cart.actionType";

const initialState = {
  hotels: [],
  flights: [],
  isLoading: false,
  isError: false,
};

const listFor = (kind) => (kind === "hotel" ? "hotels" : "flights");

export const CartReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case CART_REQUEST:
      return { ...state, isLoading: true, isError: false };

    case CART_ERROR:
      return { ...state, isLoading: false, isError: true };

    case CART_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isError: false,
        hotels: payload.hotels,
        flights: payload.flights,
      };

    case CART_ADD: {
      const list = listFor(payload.kind);
      return { ...state, [list]: [...state[list], payload.item] };
    }

    case CART_REMOVE: {
      const list = listFor(payload.kind);
      return {
        ...state,
        [list]: state[list].filter((row) => row.id !== payload.id),
      };
    }

    case CART_CLEAR:
      return { ...state, hotels: [], flights: [] };

    default:
      return state;
  }
};
