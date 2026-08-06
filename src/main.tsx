import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { StatusBar } from "@capacitor/status-bar";
import { SplashScreen } from "@capacitor/splash-screen";
import { KeepAwake } from "@capacitor-community/keep-awake";
import { getRouter } from "./router";
import "./styles.css";

// Instantly dismiss Android native splash screen as soon as script starts
SplashScreen.hide().catch(() => {});

// Hide status bar for full-screen mode
StatusBar.hide().catch(() => {});

// Keep screen awake while app is open
KeepAwake.keepAwake().catch(() => {});

function AppWithFullScreenSplash() {
  const [showSplash, setShowSplash] = useState(true);
  const router = getRouter();

  useEffect(() => {
    // Show edge-to-edge splash for 2.2 seconds on launch
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2200);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "#000000",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 999999,
          overflow: "hidden",
        }}
      >
        <img
          src="/icon.png"
          alt="Mourad's Ville"
          style={{
            width: "100%",
            maxWidth: "100vw",
            height: "auto",
            maxHeight: "100vh",
            objectFit: "contain",
          }}
        />
      </div>
    );
  }

  return <RouterProvider router={router} />;
}

const rootElement = document.getElementById("root");
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <AppWithFullScreenSplash />
    </React.StrictMode>
  );
}
