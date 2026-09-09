import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { BASE_URL } from "../../baseurl";
import { cartTotals, formatRupees, lineTotal } from "../../cartTotals";
import "./adminProduct.css";

// Carts are stored per product type, so pull both and group them by owner to
// see what each customer is sitting on but has not booked yet.
const groupByOwner = (hotels, flights) => {
  const owners = {};

  const put = (row, kind) => {
    const email = row.user_email || "unclaimed";
    if (!owners[email]) owners[email] = { email, hotels: [], flights: [] };
    owners[email][kind].push(row);
  };

  hotels.forEach((row) => put(row, "hotels"));
  flights.forEach((row) => put(row, "flights"));

  return Object.values(owners);
};

export const AdminCarts = () => {
  const [carts, setCarts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    Promise.all([
      axios.get(`${BASE_URL}/hotelcart`),
      axios.get(`${BASE_URL}/flightcart`),
    ])
      .then(([hotelRes, flightRes]) =>
        setCarts(groupByOwner(hotelRes.data, flightRes.data))
      )
      .catch(() => setFailed(true))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="adminProductMain">
      <div className="adminSideBr">
        <h1><Link to={"/admin"}>Home</Link></h1>
        <h1><Link to={"/admin/adminflight"}>Add Flight</Link></h1>
        <h1><Link to={"/admin/adminstay"}>Add Stays</Link></h1>
        <h1><Link to={"/admin/products"}>All Flights</Link></h1>
        <h1><Link to={"/admin/hotels"}>All Hotels</Link></h1>
        <h1><Link to={"/admin/bookings"}>All Bookings</Link></h1>
        <h1><Link to={"/admin/carts"}>All Carts</Link></h1>
        <h1><Link to={"/admin/users"}>All Users</Link></h1>
        <h1><Link to={"/"}>Log out</Link></h1>
      </div>

      <div className="adminProductbox">
        <div className="head"><h1>All Carts</h1></div>

        {loading ? <h1>Please wait...</h1> : ""}
        {failed ? <h1>Could not load carts. Is json-server running ?</h1> : ""}
        {!loading && !failed && carts.length === 0 ? (
          <h1>Nobody has anything in their cart.</h1>
        ) : (
          ""
        )}

        {carts.map((cart) => {
          const totals = cartTotals(cart.hotels, cart.flights);
          return (
            <div key={cart.email} className="adminProductlist">
              <span><b>{cart.email}</b></span>
              <span>
                {cart.hotels.map((hotel) => (
                  <div key={`h-${hotel.id}`}>
                    {hotel.name} <i>(stay)</i> {formatRupees(lineTotal(hotel))}
                  </div>
                ))}
                {cart.flights.map((flight) => (
                  <div key={`f-${flight.id}`}>
                    {flight.airline} {flight.number} <i>(flight)</i>{" "}
                    {formatRupees(lineTotal(flight))}
                  </div>
                ))}
              </span>
              <span>
                {totals.count === 1 ? "1 item" : `${totals.count} items`}
              </span>
              <span><b>{formatRupees(totals.total)}</b></span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
