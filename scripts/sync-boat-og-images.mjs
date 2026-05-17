import { copyFile, mkdir, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const catamaransDir = path.join(root, "src/assets/Catamarans");
const ogDir = path.join(root, "public/og");

const BOAT_NAMES = {
  "misbehaviour-catamaran": "MISBEHAVIOUR CATAMARAN",
  "sunday-kinga": "SUNDAY KINGA CATAMARAN",
  umoja: "UMOJA CATAMARAN",
  "albion-catamaran": "ALBION CATAMARAN",
  "amani-luxury": "AMANI LUXURY CATAMARAN",
  "sunbird-heli": "SUNBIRD HELI",
  "butterfly-catamaran": "BUTTERFLY CATAMARAN",
  "helia-44-catamaran": "HELIA 44 CATAMARAN",
  "knlyps-catamaran": "KNLYPS CATAMARAN",
  "queen-of-zanzibar": "QUEEN OF ZANZIBAR",
  "seamanta-catamaran": "SEAMANTA CATAMARAN",
  "vaatea-catamaran": "VAATEA CATAMARAN",
  "pelagic-catamaran": "PELAGIC CATAMARAN",
  "constatine-luxury-boat": "CONSTATINE LUXURY BOAT",
  jetski: "JETSKI",
};

const IMAGE_EXT = /\.(png|jpe?g|webp)$/i;

function folderToBoatId(folderName) {
  return folderName
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(" catamaran", "")
    .replace(" catamaran", "");
}

function isBoatImage(fileName) {
  const lower = fileName.toLowerCase();
  const boatKeywords = ["boat", "heli", "front", "side", "plan", "extra", "back", "img"];
  return boatKeywords.some((k) => lower.includes(k)) && !lower.includes("interior");
}

function imagePriority(fileName) {
  const lower = fileName.toLowerCase();
  if (lower.includes("boat1")) return 0;
  if (lower.includes("boat")) return 1;
  if (lower.includes("heli_img1") || lower.includes("heli1")) return 0;
  if (lower.includes("heli")) return 1;
  if (lower.includes("front")) return 2;
  if (lower.includes("side")) return 3;
  return 10;
}

async function pickBestBoatImage(folderPath) {
  const files = await readdir(folderPath);
  const candidates = files
    .filter((f) => IMAGE_EXT.test(f) && isBoatImage(f))
    .sort((a, b) => imagePriority(a) - imagePriority(b) || a.localeCompare(b));
  return candidates[0] ? path.join(folderPath, candidates[0]) : null;
}

await mkdir(ogDir, { recursive: true });

const manifest = {};
const folders = await readdir(catamaransDir, { withFileTypes: true });

for (const entry of folders) {
  if (!entry.isDirectory()) continue;
  const boatId = folderToBoatId(entry.name);
  if (!BOAT_NAMES[boatId]) continue;

  const sourcePath = await pickBestBoatImage(path.join(catamaransDir, entry.name));
  if (!sourcePath) continue;

  const destPath = path.join(ogDir, `${boatId}.jpg`);
  await copyFile(sourcePath, destPath);
  manifest[boatId] = {
    name: BOAT_NAMES[boatId],
    image: `/og/${boatId}.jpg`,
  };
}

await writeFile(path.join(ogDir, "manifest.json"), JSON.stringify(manifest, null, 2));
console.log(`sync-boat-og: copied ${Object.keys(manifest).length} preview images to public/og/`);
