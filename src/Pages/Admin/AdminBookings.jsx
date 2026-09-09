import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { BASE_URL } from "../../baseurl";
import { formatRupees } from "../../cartTotals";
import "./adminProduct.css";

export const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    // Newest first, so the booking someone just made is at the top.
    axios
      .get(`${BASE_URL}/bookings?_sort=created_at&_order=desc`)
      .then((res) => setBookings(res.data))
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
        <h1><Link to={"/"}>Log out</Link></h1>
      </div>

      <div className="adminProductbox">
        <div className="head"><h1>All Bookings</h1></div>

        {loading ? <h1>Please wait...</h1> : ""}
        {failed ? <h1>Could not load bookings. Is json-server running ?</h1> : ""}
        {!loading && !failed && bookings.length === 0 ? (
          <h1>No bookings yet.</h1>
        ) : (
          ""
        )}

        {bookings.map((booking) => (
          <div key={booking.id} className="adminProductlist">
            <span>
              <b>#{booking.id}</b>
            </span>
            <span>
              {booking.guest_name}
              <br />
              {booking.guest_mobile}
            </span>
            <span>{booking.user_email}</span>
            <span>
              {booking.items?.map((item, i) => (
                <div key={i}>
                  {item.title} <i>({item.kind})</i>
                </div>
              ))}
            </span>
            <span>{formatRupees(booking.total)}</span>
            <span>{new Date(booking.created_at).toLocaleString()}</span>
            <span>{booking.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
