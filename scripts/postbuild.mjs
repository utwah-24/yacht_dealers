import { copyFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { spawn } from "node:child_process";

const root = process.cwd();
const distDir = path.join(root, "dist");

function runNodeScript(scriptName) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [path.join(root, "scripts", scriptName)], {
      cwd: root,
      stdio: "inherit",
    });
    child.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${scriptName} exited with code ${code}`));
    });
  });
}

await mkdir(distDir, { recursive: true });

// Per-boat HTML with Open Graph tags for link previews (WhatsApp, iMessage, etc.)
await runNodeScript("generate-boat-share-pages.mjs");

// Firebase Hosting can serve /404.html when a deep-link doesn't match a static file.
// Copying dist/index.html -> dist/404.html makes client-side routing work even if rewrites are misconfigured.
await copyFile(path.join(distDir, "index.html"), path.join(distDir, "404.html"));

console.log("postbuild: copied dist/index.html -> dist/404.html");


