import { copyFile, mkdir } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const distDir = path.join(root, "dist");

await mkdir(distDir, { recursive: true });

// Firebase Hosting can serve /404.html when a deep-link doesn't match a static file.
// Copying dist/index.html -> dist/404.html makes client-side routing work even if rewrites are misconfigured.
await copyFile(path.join(distDir, "index.html"), path.join(distDir, "404.html"));

console.log("postbuild: copied dist/index.html -> dist/404.html");


