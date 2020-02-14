import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import firebase from "firebase/app";

var config = {
  apiKey: "AIzaSyBX_mk550HbfHyfQ1nbYbHrr3PHxrDkwsk",
  authDomain: "shamlub-b010b.firebaseapp.com",
  databaseURL: "https://shamlub-b010b.firebaseio.com",
  projectId: "shamlub-b010b",
  storageBucket: "shamlub-b010b.appspot.com",
  messagingSenderId: "625674111044",
  appId: "1:625674111044:web:37474eac78f61da5765411",
  measurementId: "G-122RXGD4Z0"
};

firebase.initializeApp(config);

ReactDOM.render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
