import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.townsquare.app",
  appName: "Town Square",
  webDir: "dist",
  server: {
    androidScheme: "https",
  },
};

export default config;
