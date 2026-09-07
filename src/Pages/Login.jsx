import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./login.css";
import firebase_app from "../01_firebase/config_firebase";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import { fetch_users, login_user } from "../Redux/Authantication/auth.action";

const auth = getAuth(firebase_app);
const state = {
  email: "",
  password: "",
};

// Firebase error codes -> the messages we show under the form.
const errorMessage = (code) => {
  switch (code) {
    case "auth/invalid-email":
      return "Email address is invalid !";
    case "auth/user-not-found":
      return "User does not exist Please Create Your Account !";
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Email or password is incorrect !";
    case "auth/too-many-requests":
      return "Too many attempts, please try again later !";
    default:
      return "Could not sign in, please try again !";
  }
};

export const Login = () => {
  const [check, setCheck] = useState(state);
  const dispatch = useDispatch();
  const { isAuth, activeUser, user } = useSelector((store) => {
    return {
      isAuth: store.LoginReducer.isAuth,
      activeUser: store.LoginReducer.activeUser,
      user: store.LoginReducer.user,
    };
  });

  const { email, password } = check;

  // Firebase holds the credentials, db.json holds the profile. Match them on email.
  const findProfile = (signedInEmail) => {
    for (let i = 0; i <= user.length - 1; i++) {
      if (user[i].email === signedInEmail) {
        return user[i];
      }
    }
    return { email: signedInEmail, user_name: signedInEmail };
  };

  function handleSignIn() {
    const nextText = document.querySelector("#nextText");

    if (!email || !password) {
      document.querySelector("#loginMesageSuccess").innerHTML = ``;
      document.querySelector("#loginMesageError").innerHTML =
        "Please enter your email and password !";
      return;
    }

    nextText.innerText = "Please wait...";
    nextText.disabled = true;

    signInWithEmailAndPassword(auth, email, password)
      .then((result) => {
        document.querySelector(
          "#loginMesageSuccess"
        ).innerHTML = `Verifyed Successful`;
        document.querySelector("#loginMesageError").innerHTML = "";

        dispatch(login_user(findProfile(result.user.email)));
      })
      .catch((error) => {
        document.querySelector("#loginMesageSuccess").innerHTML = ``;
        document.querySelector("#loginMesageError").innerHTML = errorMessage(
          error.code
        );
        nextText.innerText = "SignIn";
        nextText.disabled = false;
      });
  }

  const handleChange = (e) => {
    setCheck({ ...check, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    dispatch(fetch_users);
    if (isAuth) {
      // Admins land on the dashboard, everyone else on the home page.
      window.location = activeUser.is_admin ? "/admin" : "/";
    }
  }, [isAuth]);

  return (
    <>
      <div className="mainLogin">
        <div className="loginBx">
          <div className="logoImgdiv">
            <img
              className="imglogo"
              src="https://i.postimg.cc/QxksRNkQ/expedio-Logo.jpg"
              alt=""
            />
          </div>

          <div className="loginHead">
            <hr />
            <hr />
            <hr />
            <h1>SignIn</h1>
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
            <label htmlFor="">Enter Your Password</label>
            <span>
              <input
                type="password"
                name="password"
                value={password}
                onChange={(e) => handleChange(e)}
                placeholder="Password"
              />
              <button onClick={handleSignIn} id="nextText">
                SignIn
              </button>
            </span>
          </div>

          <div className="loginTerms">
            <Link to="/register">Don't have an Account</Link>
            <div className="inpChecbx">
              <input className="inp" type="checkbox" /> <h2>Keep me signed in</h2>
            </div>
            <p>Selecting this checkbox will keep you signed into your account on this device until you sign out. Do not select this on shared devices.</p>
            <h6>By signing in, I agree to the Expedia <span> Terms and Conditions</span>, <span>Privacy Statement</span> and <span>Expedia Rewards Terms and Conditions</span>.</h6>
          </div>
          <h3 id="loginMesageError"></h3>
          <h3 id="loginMesageSuccess"></h3>
        </div>
      </div>
    </>
  );
};
