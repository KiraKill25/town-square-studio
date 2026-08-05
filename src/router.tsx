import { QueryClient } from "@tanstack/react-query";
import { createRouter, createHashHistory } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient();

  // Detect if running inside Capacitor or offline webview environment
  const isOfflineWebview =
    typeof window !== "undefined" &&
    (window.location.protocol === "capacitor:" ||
      window.location.protocol === "file:" ||
      window.location.pathname.includes("index.html") ||
      typeof (window as any).Capacitor !== "undefined");

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    // Use Hash History inside Capacitor so routes match '#/' instead of failing on '/index.html'
    history: isOfflineWebview ? createHashHistory() : undefined,
  });

  return router;
};
