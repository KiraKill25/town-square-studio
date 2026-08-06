const fs = require("fs");
const path = require("path");

console.log("Preparing static assets for Capacitor...");

const distDir = path.join(process.cwd(), "dist");
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir, { recursive: true });

// Copy static assets from Nitro/Vite output
const outputPublic = path.join(process.cwd(), ".output", "public");

if (fs.existsSync(outputPublic)) {
  console.log(`Copying files from ${outputPublic} to ${distDir}`);
  fs.cpSync(outputPublic, distDir, { recursive: true });
} else {
  console.error("ERROR: .output/public directory was not generated!");
}

// Generate index.html if missing
const indexPath = path.join(distDir, "index.html");

if (!fs.existsSync(indexPath)) {
  console.log("index.html missing. Automatically generating SPA index.html...");

  const assetsDir = path.join(distDir, "assets");
  let jsFile = "";
  let cssFile = "";

  if (fs.existsSync(assetsDir)) {
    const files = fs.readdirSync(assetsDir);
    
    // Pick the main bundle JS file
    const jsFiles = files.filter((f) => f.endsWith(".js"));
    jsFile =
      jsFiles.find((f) => f.startsWith("index-")) ||
      jsFiles.sort(
        (a, b) =>
          fs.statSync(path.join(assetsDir, b)).size -
          fs.statSync(path.join(assetsDir, a)).size
      )[0] ||
      "";

    // Pick the main CSS stylesheet
    const cssFiles = files.filter((f) => f.endsWith(".css"));
    cssFile = cssFiles.find((f) => f.startsWith("styles-")) || cssFiles[0] || "";
  }

  const htmlContent = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <title>Town Square</title>
    ${cssFile ? `<link rel="stylesheet" href="./assets/${cssFile}">` : ""}
  </head>
  <body>
    <div id="root"></div>
    ${jsFile ? `<script type="module" src="./assets/${jsFile}"></script>` : ""}
  </body>
</html>`;

  fs.writeFileSync(indexPath, htmlContent, "utf8");
  console.log(`Generated index.html successfully (JS: ${jsFile}, CSS: ${cssFile})`);
}

// Create routing fallback files
fs.copyFileSync(indexPath, path.join(distDir, "200.html"));
fs.copyFileSync(indexPath, path.join(distDir, "404.html"));
console.log("Capacitor static assets ready in dist/!");
