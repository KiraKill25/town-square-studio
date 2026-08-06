const fs = require("fs");
const path = require("path");

console.log("Preparing static files for Capacitor SPA...");

const distDir = path.join(process.cwd(), "dist");
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir, { recursive: true });

// Nitro outputs the static frontend to .output/public during a static build
const outputPublic = path.join(process.cwd(), ".output", "public");
const clientDist = path.join(process.cwd(), "dist-client");

let sourceDir = "";
if (fs.existsSync(outputPublic)) {
  sourceDir = outputPublic;
} else if (fs.existsSync(clientDist)) {
  sourceDir = clientDist;
}

if (sourceDir) {
  console.log(`Copying static assets from ${sourceDir} to ${distDir}`);
  fs.cpSync(sourceDir, distDir, { recursive: true });
} else {
  console.log("Warning: No standard output folder found, using current directory root files if available.");
}

// Ensure index.html exists for Capacitor router fallback
const indexPath = path.join(distDir, "index.html");
if (fs.existsSync(indexPath)) {
  fs.copyFileSync(indexPath, path.join(distDir, "200.html"));
  fs.copyFileSync(indexPath, path.join(distDir, "404.html"));
  console.log("SPA fallback routing files (200.html/404.html) successfully created!");
} else {
  console.error("CRITICAL: index.html was not found in the build output!");
}
