import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // Import BrowserRouter
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* Wrap the App component with BrowserRouter to enable routing */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
