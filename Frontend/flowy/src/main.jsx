import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./styles/variable.css";
import "./styles/global.css";
import LandingPage from "./pages/LandingPage.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
