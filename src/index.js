import React from "react";
import { render } from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { FirebaseContext } from "./context/firebase";
import { firebase } from "./firebase.prod";
import store from "./features/store";
import { Provider } from 'react-redux';


render(
  <FirebaseContext.Provider value={{ firebase }}>
    <Provider store={store}>
      <App />
    </Provider>
  </FirebaseContext.Provider>,

  document.getElementById("Booklii-container")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
