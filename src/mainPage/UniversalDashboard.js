import React, { useState, useEffect, useContext, useMemo } from "react";

import { Link } from "react-router-dom";
import * as ROUTES from "../constants/routes";

import "./styles/UniversalDashboard.css";
import { useAuthListener } from "../hooks";

import { db } from "../firebase.prod";
import Docs from "./documentComponent/documents";
import { FirebaseContext } from "../context/firebase";
import RefreshIcon from "@material-ui/icons/Refresh";

import { useHistory } from "react-router-dom";

import JumboData from "../fixtures/jumbo.json";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import { useDispatch } from "react-redux";
import { logout } from "../features/userSlice";

import Moment from "react-moment";

import LockOutlinedIcon from "@material-ui/icons/LockOutlined";

import sha256 from "crypto-js/sha256";

// All the new imports below
import HomeIcon from "@material-ui/icons/Home";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";

import { IconButton } from "@material-ui/core";
import TransitionsModal from "../modal/Modal";
import MouseOverPopover from "../Popover/HoverPopOver/PopHover";
import Profile from "./profile/Profile";
import ModalAuth from "./modal/Modal";
import LeftColumn from "./dashboardLeft/LeftDashboard";
import BasicTable from "./dataTable/Data";

import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";

import ReactQuill from "react-quill";
import QuickNotes from "./QuickSelfReflection/QuickNotes";

import CryptoJS from "crypto-js";
import CryptoAES from "crypto-js/aes";
import Prompt from "./writing_prompt/Prompt";

export default function MainDashboard() {
  const [documents, setDocuments] = useState([]);
  const [random, setRandom] = useState("Don't know what to write about");
  const { user } = useAuthListener();

  const { firebase } = useContext(FirebaseContext);

  const handleClick = () => {
    const values = Object.values(JumboData);
    const randomValue = values[parseInt(Math.random() * values.length)];

    setRandom(randomValue);
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

  const [open, setOpen] = React.useState(false);
  const [greeting, setGreeting] = useState("");

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    getHour();
  }, []);

  const getHour = () => {
    let curDate = new Date();
    curDate = curDate.getHours();

    if (curDate >= 1 && curDate < 12) {
      setGreeting("Good Morning");
    } else if (curDate >= 12 && curDate < 18) {
      setGreeting("Good Afternoon");
    } else {
      setGreeting("Good Evening");
    }
  };

  return (
    <>
      <div className="universal">
        <div className="universal-dashboard">
          {/* <LeftColumn /> */}

          <ModalAuth open={open} close={handleClose} />

          <Profile open={handleOpen} />

          <div className="journal-content">
            <div className="journal-inner-content">
              <div className="Overview">Overview</div>
              <div className="top-column">
                <div className="greeting">
                  {greeting}, {user?.displayName}!
                </div>
                <Moment format="dddd, MMMM Do, YYYY"></Moment>
              </div>
              <div className="Journal__header">
                {documents.length > 0 ? "Recent Journals" : "No journals"}
              </div>
              <div className="journal-column">
                <div className="tableHeader">
                  <div>Title</div>
                  <div>Last edited</div>
                </div>
                {documents.map(({ id, data: { timestamp, title } }) => (
                  <>
                    <BasicTable
                      Title="Title"
                      title2="Last edited"
                      name={documents}
                      id={id}
                      timestamp={timestamp.toDate().toString()}
                      title={title}
                      onClick={open}
                      close={handleClose}
                      key={id}
                    />
                  </>
                ))}
              </div>
              <div className = 'writing-container'>
                <QuickNotes />
                <Prompt />

              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
