import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import {configureStore} from '@reduxjs/toolkit';

import "./index.css";
import App from "./App";
import reducers from "./reducers";

// thunk- for async operations in redux

const store = configureStore({reducer:reducers,middleware:(()=>[thunk])});
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
