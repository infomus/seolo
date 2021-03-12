import React, { useState, useEffect, useContext, useMemo } from "react";

import { Link } from "react-router-dom";
import * as ROUTES from "../constants/routes";

import "./styles/UniversalDashboard.css";
import { useAuthListener } from "../hooks";

import { db } from "../firebase.prod";
import Docs from "./documentComponent/documents";
import { Avatar } from "@material-ui/core";
import { FirebaseContext } from "../context/firebase";
import RefreshIcon from "@material-ui/icons/Refresh";

import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { useHistory } from "react-router-dom";

import JumboData from '../fixtures/jumbo.json'
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

export default function MainDashboard() {
  const { user } = useAuthListener();
  const [documents, setDocuments] = useState([]);
  const [random, setRandom] = useState("Don't know what to write about");

  const { firebase } = useContext(FirebaseContext);
  const history = useHistory();


  const handleClick = () => {
    const values = Object.values(JumboData)
    const randomValue = values[parseInt(Math.random() * values.length)];
    
    setRandom(randomValue)

  };



  const handleSignIn = (event) => {
    event.preventDefault();

        if(emailAddress == user.email) {
          history.push("/DASHBOARD");

        } else {
          alert('Please use same credentials')
        }
  };

  useMemo(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        db.collection("users")
          .doc(firebase.auth().currentUser.uid)
          .collection("notes")
          .orderBy("timestamp", "desc")
          .onSnapshot((snapshot) =>
            setDocuments(
              snapshot.docs.map((doc) => ({
                id: doc.id,
                data: doc.data(),
              }))
            )
          );
      } else {
        console.log("cant find it");
      }
    });
  }, []);

  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <div className="sidebar-title">Welcome {user?.displayName}!</div>
      <div className="sidebar">
        <div className="sidebars">
          <div className="sidebars__top">
            <img
              src="https://images.unsplash.com/photo-1599944201038-b32b0bf6ebe5?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80"
              alt=""
            />
            <Avatar src={user?.photoUrl} className="sidebars__avatar">
              {user.email[0]}
            </Avatar>
            <h2>{user.displayName}</h2>
            <h4>{user.email}</h4>
          </div>

          <div className="sidebar__stats">
            <div className="sidebar__stat">
              <p>Journals</p>
              <p className="sidebar__statsNumber">{documents.length}</p>
            </div>
          </div>

          <div className="sidebar__stats">
            <div className="sidebar__stat">
              <div className="editor-button">
                {/* <Link exact to={ROUTES.DASHBOARD}> */}
                <button className="dashboard_button" onClick={handleOpen}>
                  {" "}
                  {documents.length == 0 ? "Start Here" : "Go to my Journals"}
                </button>
                {/* </Link> */}
              </div>
            </div>
          </div>

          <div className="sidebar__stats generator">
            <div className="sidebar__stat">
              <div className="generator">
                <div className="text_button">
                  <div className="generator__prompts">
                     {random}
                  </div>
                  <button onClick={handleClick}>
                    <RefreshIcon />
                    Generate
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="right-sidebar">
          <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className={classes.modal}
            open={open}
            onClose={handleClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
              timeout: 500,
            }}
          >
            <Fade in={open}>
              <div className={classes.paper}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  type="email"
                  autoFocus
                  onChange={({ target }) => setEmailAddress(target.value)}
                />

                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  autoComplete="off"
                  type="password"
                  id="password"
                  type="password"
                  onChange={({ target }) => setPassword(target.value)}
                  autoComplete="current-password"
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                  onClick={handleSignIn}
                >
                  Sign In
                </Button>
              </div>
            </Fade>
          </Modal>

          <div className="right-sidebar-bottom-column">
            <div className="Journal__header">
              {documents.length > 0 ? "Recent Journals" : "No journals"}
            </div>
            {documents.map(({ id, data: { timestamp, title } }) => (
              <Docs title={title} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

// {
//   documents.map(({id, data : {timestamp, title}}) => (
//     <>
//     <div>{title}</div>
//     </>
//   ))
// }