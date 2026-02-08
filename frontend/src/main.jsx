import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/global.css";
import "font-awesome/css/font-awesome.min.css";

// Add external scripts
const addExternalScript = (src, async = true, defer = true) => {
  const script = document.createElement("script");
  script.src = src;
  script.async = async;
  script.defer = defer;
  document.head.appendChild(script);
};

// Add Hubspot script
addExternalScript("//js-eu1.hs-scripts.com/146085103.js");

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
