import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createStore } from "redux";
import "./index.css";
import Home from "./Home";
import * as serviceWorker from "./serviceWorker";

const initialState = {
  files: [
    {
      name: "aaa.bbb"
    },
    {
      name: "ccc.ddd"
    }
  ],
  stepIndex: 1
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case "ADD_FILES":
      return {
        ...state,
        files: [...state.files, ...action.payload.files]
      };
    case "CLEAR_FILES":
      return {
        ...state,
        files: []
      };
    case "SET_STEP":
      return {
        ...state,
        stepIndex: action.payload.step
      };
    default:
      return state;
  }
}

const store = createStore(reducer);

ReactDOM.render(
  <Provider store={store}>
    <Home />
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
