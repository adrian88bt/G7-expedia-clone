import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { BASE_URL } from "../../baseurl";
import "./adminProduct.css";

export const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    Promise.all([
      axios.get(`${BASE_URL}/users`),
      axios.get(`${BASE_URL}/bookings`),
    ])
      .then(([userRes, bookingRes]) => {
        setUsers(userRes.data);
        setBookings(bookingRes.data);
      })
      .catch(() => setFailed(true))
      .finally(() => setLoading(false));
  }, []);

  const bookingsFor = (email) =>
    bookings.filter((booking) => booking.user_email === email).length;

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
        <div className="head"><h1>All Users</h1></div>

        {loading ? <h1>Please wait...</h1> : ""}
        {failed ? <h1>Could not load users. Is json-server running ?</h1> : ""}

        {users.map((user) => (
          <div key={user.id} className="adminProductlist">
            <span><b>#{user.id}</b></span>
            <span>{user.user_name}</span>
            <span>{user.email}</span>
            <span>{user.is_admin ? "Admin" : "Customer"}</span>
            <span>{user.number ? user.number : "no phone on file"}</span>
            <span>
              {bookingsFor(user.email) === 1
                ? "1 booking"
                : `${bookingsFor(user.email)} bookings`}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
