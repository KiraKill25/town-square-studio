import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { StatusBar } from "@capacitor/status-bar";
import { SplashScreen } from "@capacitor/splash-screen";
import { KeepAwake } from "@capacitor-community/keep-awake";
import { getRouter } from "./router";
import "./styles.css";

// Hide the Android status bar for full-screen mode
StatusBar.hide().catch(() => {});

// Keep screen awake (prevent phone screen from turning off while app is running)
KeepAwake.keepAwake().catch(() => {});

// Hide the splash screen automatically after 2 seconds
setTimeout(() => {
  SplashScreen.hide().catch(() => {});
}, 2000);

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
