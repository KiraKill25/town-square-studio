import { QueryClient } from "@tanstack/react-query";
import { createRouter, createHashHistory } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient();

  // Force Hash History inside Capacitor/Android APK environments
  const isMobileApp =
    typeof window !== "undefined" &&
    (window.location.protocol === "capacitor:" ||
      window.location.protocol === "file:" ||
      window.location.hostname === "localhost" ||
      window.location.href.includes("index.html") ||
      navigator.userAgent.includes("Capacitor") ||
      navigator.userAgent.includes("Android"));

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    history: isMobileApp ? createHashHistory() : undefined,
  });

  return router;
};
