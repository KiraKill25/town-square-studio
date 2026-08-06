import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { StatusBar } from "@capacitor/status-bar";
import { getRouter } from "./router";
import "./styles.css";

// Hide the Android status bar for full-screen mode
StatusBar.hide().catch(() => {});

const router = getRouter();

const rootElement = document.getElementById("root");
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
}
