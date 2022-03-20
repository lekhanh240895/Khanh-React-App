import "bootstrap/dist/css/bootstrap.min.css";
import "antd/dist/antd.css";
import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App.js";
import "./index.css";
import { AuthProvider } from "./contexts/AuthContext";
import { AppProvider } from "./contexts/AppContext.js";
import store from "../src/redux/store";
import { Provider } from "react-redux";
import 'emoji-mart/css/emoji-mart.css'

ReactDOM.render(
  <React.StrictMode>
    <AuthProvider>
      <AppProvider>
        <Provider store={store}>
          <App />
        </Provider>
      </AppProvider>
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

