import { applyMiddleware, combineReducers, legacy_createStore } from "redux";
import thunk from "redux-thunk";

import { CartReducer } from "./CartReducer/cart.reducer";
import { FlightReducer } from "./AdminFlights/reducer";
import { HotelReducer } from "./AdminHotel/reducer";
import { LoginReducer } from "./Authantication/auth.reducer";
import { StayReducer } from "./StayReducer/reducer";

const rootReducer = combineReducers({
  CartReducer,
  FlightReducer,
  HotelReducer,
  LoginReducer,
  StayReducer,
});

export const store = legacy_createStore(rootReducer, applyMiddleware(thunk));
