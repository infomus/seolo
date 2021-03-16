import React, { useContext } from "react";
import logo from "../images/logo.png";
import "./styles/Navbar.css";
import { Link } from "react-router-dom";
import { useAuthListener } from "../hooks";
import { FirebaseContext } from "../context/firebase";
import { useDispatch } from "react-redux";
import { logout } from "../features/userSlice";

function Navbar() {
  const { firebase } = useContext(FirebaseContext);
  const { user } = useAuthListener();

  const dispatch = useDispatch();

  const handleAuthentication = () => {
    if (user) {

      dispatch(logout())
      firebase.auth().signOut();
    }
  };

  return (
    <div className="navbar">
      <nav className="navbar__navigation">
        <ul className="navbar__unordered">
          <li className="navbar__lists">
            <Link exact to="/">
              <img src={logo} alt="" />
            </Link>
          </li>
          <div className="signout-component">
            {user ? (
              <Link exact to="/UniversalDashboard">
                <li className="navbar__lists navbar__login">Dashboard</li>
              </Link>
            ) : null}
            {!user ? (
              <div className="loginButton">
                <div className="loginContainer">
                  <Link exact to="/Login">
                    <li className="navbar__lists navbar__login sign__In">
                      Log in
                    </li>
                  </Link>
                </div>

                <Link exact to="/Signup">
                  <li className="navbar__lists navbar__login sign__In">
                    Get Started
                  </li>
                </Link>
              </div>
            ) : (
              <button onClick={handleAuthentication}>
                <li className="navbar__lists navbar__login">Sign out</li>
              </button>
            )}
          </div>
        </ul>
      </nav>
    </div>
  );
}

export default Navbar;
