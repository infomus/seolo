import React, { useContext } from "react";
import { Link } from "react-router-dom";
import * as ROUTES from "../../constants/routes";
import { useAuthListener } from "../../hooks";
import styled from "styled-components";
import Moment from "react-moment";
import { Avatar } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import DashboardIcon from "@material-ui/icons/Dashboard";
import LockIcon from "@material-ui/icons/Lock";
import Divider from "@material-ui/core/Divider";
import { FirebaseContext } from "../../context/firebase";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../features/userSlice";
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import StarsIcon from '@material-ui/icons/Stars';

import logo from '../../images/logo.png'

import BorderColorIcon from "@material-ui/icons/BorderColor";

const Overlay = styled.div`
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: -1;
`;

export default function Profile({ open }) {
  const { user } = useAuthListener();

  const { firebase } = useContext(FirebaseContext);
  const history = useHistory();

  const dispatch = useDispatch();

  const handleAuthentication = () => {
    if (user) {
      dispatch(logout());
      firebase.auth().signOut();
    }
  };

  return (
    <div className="profile">
      <Overlay>
        <div className="profile-container">
          <div className="profile-inner-content">
            <Link exact to={ROUTES.HOME}>
              <div className="headertitle" style = {{color:'white'}}>JOURNALY</div>
            </Link>
            <div className="nameWrapper">
              <Divider />
              <div className="profile-information">
                <Avatar src={user?.photoUrl} className="sidebars__avatar">
                  {user?.email[0]}
                </Avatar>
                <h2>{user?.displayName}</h2>
              </div>
              <Divider />
            </div>
            <div className="profile-menu">
              <div className="menu-inner">
                <div className="menu-single">
                  <Link exact to={ROUTES.MAIN_DASH}>
                    <Button>
                      <DashboardIcon />
                      <div>Dashboard</div>
                    </Button>
                  </Link>
                </div>

                <div className="menu-single">
                  <Button onClick={open}>
                    <LockIcon />
                    <div>Journals</div>
                  </Button>
                </div>

                <div className="menu-single">
                  <Button disabled={true}>
                    <Link exact to="#">
                      <BorderColorIcon />
                      <div>Writing Prompts</div>
                    </Link>
                  </Button>
                </div>

                {/* <div className="menu-single">
                  <Button onClick={open}>
                    <StarsIcon />
                    <div>Short cuts</div>
                  </Button>
                </div> */}

                <div className="menu-single logout">
                  <Button onClick={handleAuthentication}>
                    <Link exact to="#">
                      <ExitToAppIcon className = 'logoutIcon' />
                      <div>Logout</div>
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Overlay>
    </div>
  );
}

{
  /* <div className="moment-time">
<span className="greetingDate">
  <Moment format="dddd, MMMM Do, YYYY"></Moment>
</span>
</div> */
}
