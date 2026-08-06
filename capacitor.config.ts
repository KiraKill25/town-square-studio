import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.townsquare.app",
  appName: "Mourad's Ville",
  webDir: "dist",
  server: {
    androidScheme: "https",
  },
};

export default config;
