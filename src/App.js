import React from "react";
import "firebase/firestore";
import { db } from "./firebase.prod";
import SidebarComponent from "./sidebar/sidebar";
import EditorComponent from "./editor/editor";
import "./App.css";
import Home from "./homePage/Home";
import Navbar from "./navbar/Navbar";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import Login from "./Login/Login";
import Dashboard from "./react_quil/Dashboard";
import { firebase } from "./firebase.prod";

import * as ROUTES from "./constants/routes";
import test from "./testfolder/test";
import signUp from "./Login/signUp";

import { IsuserRedirect, ProtectedRoutes, ProtectedDashboard } from "./helpers/routesUser";

import { useAuthListener } from "./hooks";
import MainDashboard from "./mainPage/UniversalDashboard";
import ReactQuill from "react-quill";
import LearnMore from "./learn/learnMore";



export default function App() {
  const { user } = useAuthListener();

  return (
    <div className="app-container">
      <Router>
        <Navbar />
        <Switch>
          <Route exact path={ROUTES.HOME} component={Home} />

          <Route exact path = {ROUTES.LEARN} component = {LearnMore} />

          <IsuserRedirect
            user={user}
            loggedInPath={ROUTES.MAIN_DASH}
            path={ROUTES.LOGIN}
          >
            <Route exact path={ROUTES.LOGIN} component={Login} />
          </IsuserRedirect>
          <Route exact path={ROUTES.SIGN_UP} component={signUp} />

          <ProtectedRoutes user={user} path={ROUTES.MAIN_DASH}>
            <MainDashboard />
          </ProtectedRoutes>

          <ProtectedRoutes user={user} path={ROUTES.DASHBOARD}>
            <Dashboard />
          </ProtectedRoutes>

        </Switch>
      </Router>
    </div>
  );
}
