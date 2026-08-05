const fs = require("fs");
const path = require("path");

const distDir = path.join(process.cwd(), "dist");
fs.mkdirSync(distDir, { recursive: true });

const outputPublic = path.join(process.cwd(), ".output", "public");
if (fs.existsSync(outputPublic)) {
  fs.cpSync(outputPublic, distDir, { recursive: true });
}

const publicDir = path.join(process.cwd(), "public");
if (fs.existsSync(publicDir)) {
  fs.cpSync(publicDir, distDir, { recursive: true });
}

const buildAssets = path.join(distDir, "_build", "assets");
const assetsDir = path.join(distDir, "assets");
fs.mkdirSync(buildAssets, { recursive: true });
fs.mkdirSync(assetsDir, { recursive: true });

if (fs.existsSync(buildAssets)) {
  fs.cpSync(buildAssets, assetsDir, { recursive: true });
}
if (fs.existsSync(assetsDir)) {
  fs.cpSync(assetsDir, buildAssets, { recursive: true });
}

let indexPath = path.join(distDir, "index.html");

const candidateFiles = ["200.html", "404.html", "spa.html"];
for (const file of candidateFiles) {
  const fullPath = path.join(distDir, file);
  if (fs.existsSync(fullPath)) {
    fs.copyFileSync(fullPath, indexPath);
    break;
  }
}

if (!fs.existsSync(indexPath)) {
  console.log("Creating fallback index.html shell...");
  let jsScriptTag = "";
  let cssLinkTag = "";

  if (fs.existsSync(assetsDir)) {
    const files = fs.readdirSync(assetsDir);
    const jsFile = files.find((f) => f.endsWith(".js"));
    const cssFile = files.find((f) => f.endsWith(".css"));
    if (jsFile) jsScriptTag = `<script type="module" src="./assets/${jsFile}"></script>`;
    if (cssFile) cssLinkTag = `<link rel="stylesheet" href="./assets/${cssFile}">`;
  }

  const htmlContent = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mourad's Ville</title>
  ${cssLinkTag}
</head>
<body class="bg-background text-foreground">
  <div id="root"></div>
  <div id="app"></div>
  ${jsScriptTag}
</body>
</html>`;
  fs.writeFileSync(indexPath, htmlContent);
}

fs.copyFileSync(indexPath, path.join(distDir, "200.html"));
fs.copyFileSync(indexPath, path.join(distDir, "404.html"));

console.log("Static distribution directory successfully prepared with index.html!");
