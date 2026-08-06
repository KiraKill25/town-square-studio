const fs = require("fs");
const path = require("path");

const distDir = path.join(process.cwd(), "dist");
// Clean dist directory
fs.rmSync(distDir, { recursive: true, force: true });
fs.mkdirSync(distDir, { recursive: true });

// Check where Vite output is placed (usually dist-client or .output/public)
const possibleOutputs = [
  path.join(process.cwd(), "dist-client"),
  path.join(process.cwd(), ".output", "public"),
  path.join(process.cwd(), "dist")
];

let sourceDir = "";
for (const dir of possibleOutputs) {
  if (fs.existsSync(path.join(dir, "index.html")) || fs.existsSync(path.join(dir, "_build"))) {
    sourceDir = dir;
    break;
  }
}

if (sourceDir && sourceDir !== distDir) {
  fs.cpSync(sourceDir, distDir, { recursive: true });
}

// Ensure assets directory is structured correctly for Capacitor
const buildAssets = path.join(distDir, "_build", "assets");
const assetsDir = path.join(distDir, "assets");

if (fs.existsSync(buildAssets) && !fs.existsSync(assetsDir)) {
  fs.cpSync(buildAssets, assetsDir, { recursive: true });
} else if (fs.existsSync(assetsDir) && !fs.existsSync(buildAssets)) {
  fs.mkdirSync(buildAssets, { recursive: true });
  fs.cpSync(assetsDir, buildAssets, { recursive: true });
}

let indexPath = path.join(distDir, "index.html");

// If index.html is missing, check subdirectories or create a bulletproof fallback with auto-discovered assets
if (!fs.existsSync(indexPath)) {
  const findHtml = (dir) => {
    if (!fs.existsSync(dir)) return null;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        const found = findHtml(fullPath);
        if (found) return found;
      } else if (entry.name === "index.html") {
        return fullPath;
      }
    }
    return null;
  };

  const foundIndex = findHtml(distDir);
  if (foundIndex) {
    fs.copyFileSync(foundIndex, indexPath);
  }
}

// If still no index.html, generate one dynamically linking whatever JS/CSS chunks exist
if (!fs.existsSync(indexPath)) {
  console.log("Generating explicit SPA index.html wrapper...");
  let jsScript = "";
  let cssLink = "";

  const searchForAssets = (dir) => {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir, { withFileTypes: true });
    for (const file of files) {
      const full = path.join(dir, file.name);
      if (file.isDirectory()) {
        searchForAssets(full);
      } else if (file.name.endsWith(".js")) {
        const rel = path.relative(distDir, full).replace(/\\/g, "/");
        jsScript = `<script type="module" src="./${rel}"></script>`;
      } else if (file.name.endsWith(".css")) {
        const rel = path.relative(distDir, full).replace(/\\/g, "/");
        cssLink = `<link rel="stylesheet" href="./${rel}">`;
      }
    }
  };

  searchForAssets(distDir);

  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mourad's Ville</title>
  ${cssLink}
</head>
<body class="bg-background text-foreground min-h-screen">
  <div id="root"></div>
  <div id="app"></div>
  ${jsScript}
</body>
</html>`;
  fs.writeFileSync(indexPath, html);
}

// Duplicate for router fallback inside WebView
if (fs.existsSync(indexPath)) {
  fs.copyFileSync(indexPath, path.join(distDir, "200.html"));
  fs.copyFileSync(indexPath, path.join(distDir, "404.html"));
}

console.log("Distribution folder successfully prepared for Capacitor!");
