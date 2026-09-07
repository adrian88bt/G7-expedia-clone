import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./login.css";
import firebase_app from "../01_firebase/config_firebase";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import { fetch_users, userRigister } from "../Redux/Authantication/auth.action";

const auth = getAuth(firebase_app);
const state = {
  email: "",
  password: "",
  user_name: "",
};

// Firebase error codes -> the messages we show under the form.
const errorMessage = (code) => {
  switch (code) {
    case "auth/email-already-in-use":
      return "User Alredy exist";
    case "auth/invalid-email":
      return "Email address is invalid !";
    case "auth/weak-password":
      return "Password must be at least 6 characters !";
    default:
      return "Could not create your account, please try again !";
  }
};

export const Register = () => {
  const [check, setCheck] = useState(state);
  const dispatch = useDispatch();
  const { isLoading } = useSelector((store) => {
    return {
      isLoading: store.LoginReducer.isLoading,
    };
  });

  const { email, password, user_name } = check;

  const handleRegisterUser = () => {
    const nextButton = document.querySelector("#nextButton");

    if (!email || !password || !user_name) {
      document.querySelector("#loginMesageSuccess").innerHTML = ``;
      document.querySelector("#loginMesageError").innerHTML =
        "Please fill in every field !";
      return;
    }

    nextButton.innerText = "Please wait...";
    nextButton.disabled = true;

    // Firebase stores the credentials; db.json only stores the profile.
    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        document.querySelector(
          "#loginMesageSuccess"
        ).innerHTML = `Account Created Successful`;
        document.querySelector("#loginMesageError").innerHTML = "";

        const newObj = {
          email,
          user_name,
          is_admin: false,
          number: "",
          dob: "",
          gender: "",
          marital_status: null,
        };

        // Wait for the profile to land in db.json before leaving the page.
        return dispatch(userRigister(newObj)).then(() => {
          setCheck(state);
          window.location = "/login";
        });
      })
      .catch((error) => {
        // A Firebase failure carries a code; anything else came from the
        // db.json POST, which means the account exists but the profile does not.
        document.querySelector("#loginMesageSuccess").innerHTML = ``;
        document.querySelector("#loginMesageError").innerHTML = error.code
          ? errorMessage(error.code)
          : "Account created, but saving your profile failed. Is json-server running ?";
        nextButton.innerText = "Continue";
        nextButton.disabled = false;
      });
  };

  const handleChange = (e) => {
    setCheck({ ...check, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    dispatch(fetch_users);
  }, []);

  return (
    <>
      <div className="mainLogin">
        <div className="loginBx">
          <div className="logoImgdivReg">
            <img
              className="imglogoReg"
              src="https://i.postimg.cc/QxksRNkQ/expedio-Logo.jpg"
              alt=""
            />
          </div>

          <div className="loginHead">
            <hr />
            <hr />
            <hr />
            <h1>Register</h1>
          </div>

          <div className="loginInputB">
            <label htmlFor="">Enter Your Full name</label>
            <span>
              <input
                type="text"
                name="user_name"
                value={user_name}
                onChange={(e) => handleChange(e)}
                placeholder="Full Name"
              />
            </span>
          </div>

          <div className="loginInputB">
            <label htmlFor="">Enter Your Email</label>
            <span>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => handleChange(e)}
                placeholder="Email"
              />
            </span>
          </div>

          <div className="loginInputB">
            <label htmlFor="">Your Password</label>
            <span>
              <input
                type="password"
                name="password"
                value={password}
                onChange={(e) => handleChange(e)}
                placeholder="At least 6 characters"
              />
              <button onClick={handleRegisterUser} id="nextButton">
                Continue
              </button>
            </span>
          </div>

          {isLoading ? <h1>Please wait...</h1> : ""}

          <div className="loginTerms">
            <Link to="/login">Already have an Account</Link>
            <div className="inpChecbx">
              <input className="inp" type="checkbox" /> <h2>Keep me signed in</h2>
            </div>
            <p>Selecting this checkbox will keep you signed into your account on this device until you sign out. Do not select this on shared devices.</p>
            <h6>By signing in, I agree to the Expedia <span> Terms and Conditions</span>, <span>Privacy Statement</span> and <span>Expedia Rewards Terms and Conditions</span>.</h6>
          </div>
          <br />
          <h3 id="loginMesageError"></h3>
          <h3 id="loginMesageSuccess"></h3>
        </div>
      </div>
    </>
  );
};
