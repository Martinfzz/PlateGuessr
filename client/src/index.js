import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import store from "./app/store";
import { Provider } from "react-redux";
import AppRoutes from "routes/AppRoutes";
import { AuthContextProvider } from "./context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <Provider store={store}>
        <ToastContainer icon={false} limit={3} />
        <AppRoutes />
      </Provider>
    </AuthContextProvider>
  </React.StrictMode>
);
