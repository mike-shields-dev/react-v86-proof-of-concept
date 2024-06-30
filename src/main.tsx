import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { V86EmulatorProvider } from "./context/V86EmulatorContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <V86EmulatorProvider>
      <App />
    </V86EmulatorProvider>
  </React.StrictMode>
);
