import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import "./i18n";
import { BrowserRouter } from 'react-router-dom';
import ScrollToHashElement from "./components/ScrollToHashElement";

import { ToastContainer } from "react-toastify";


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
     <ScrollToHashElement /> 
      <App />
    <ToastContainer />
    </BrowserRouter>
  </StrictMode>

);
