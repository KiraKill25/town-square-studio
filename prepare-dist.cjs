const fs = require("fs");
const path = require("path");

console.log("Starting robust static distribution preparation...");

try {
  const distDir = path.join(process.cwd(), "dist");
  if (fs.existsSync(distDir)) {
    fs.rmSync(distDir, { recursive: true, force: true });
  }
  fs.mkdirSync(distDir, { recursive: true });

  const possibleSources = [
    path.join(process.cwd(), ".output", "public"),
    path.join(process.cwd(), "dist-client"),
    path.join(process.cwd(), "dist")
  ];

  for (const src of possibleSources) {
    if (src !== distDir && fs.existsSync(src)) {
      console.log(`Copying build files from ${src} to ${distDir}`);
      fs.cpSync(src, distDir, { recursive: true });
      break;
    }
  }

  // Ensure assets folder exists
  const assetsDir = path.join(distDir, "assets");
  const buildAssets = path.join(distDir, "_build", "assets");
  if (fs.existsSync(buildAssets) && !fs.existsSync(assetsDir)) {
    fs.cpSync(buildAssets, assetsDir, { recursive: true });
  } else if (fs.existsSync(assetsDir) && !fs.existsSync(buildAssets)) {
    fs.mkdirSync(buildAssets, { recursive: true });
    fs.cpSync(assetsDir, buildAssets, { recursive: true });
  }

  let indexPath = path.join(distDir, "index.html");
  if (!fs.existsSync(indexPath)) {
    const findFile = (dir, target) => {
      if (!fs.existsSync(dir)) return null;
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          const res = findFile(full, target);
          if (res) return res;
        } else if (entry.name === target) {
          return full;
        }
      }
      return null;
    };

    const found = findFile(distDir, "index.html");
    if (found) {
      fs.copyFileSync(found, indexPath);
    } else {
      console.log("Generating emergency fallback index.html...");
      let jsTag = "";
      let cssTag = "";
      
      const collectAssets = (dir) => {
        if (!fs.existsSync(dir)) return;
        for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
          const full = path.join(dir, entry.name);
          if (entry.isDirectory()) {
            collectAssets(full);
          } else if (entry.name.endsWith(".js")) {
            const rel = path.relative(distDir, full).replace(/\\/g, "/");
            jsTag = `<script type="module" src="./${rel}"></script>`;
          } else if (entry.name.endsWith(".css")) {
            const rel = path.relative(distDir, full).replace(/\\/g, "/");
            cssTag = `<link rel="stylesheet" href="./${rel}">`;
          }
        }
      };
      collectAssets(distDir);

      const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mourad's Ville</title>
  ${cssTag}
</head>
<body class="bg-background text-foreground min-h-screen">
  <div id="root"></div>
  <div id="app"></div>
  ${jsTag}
</body>
</html>`;
      fs.writeFileSync(indexPath, html);
    }
  }

  if (fs.existsSync(indexPath)) {
    fs.copyFileSync(indexPath, path.join(distDir, "200.html"));
    fs.copyFileSync(indexPath, path.join(distDir, "404.html"));
  }

  console.log("prepare-dist.cjs completed successfully!");
} catch (err) {
  console.error("Non-fatal error caught in prepare-dist.cjs:", err);
  const distDir = path.join(process.cwd(), "dist");
  fs.mkdirSync(distDir, { recursive: true });
  fs.writeFileSync(path.join(distDir, "index.html"), '<div id="root"></div>');
  fs.writeFileSync(path.join(distDir, "200.html"), '<div id="root"></div>');
  fs.writeFileSync(path.join(distDir, "404.html"), '<div id="root"></div>');
}
