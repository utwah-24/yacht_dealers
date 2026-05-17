import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const distDir = path.join(root, "dist");
const manifestPath = path.join(root, "public/og/manifest.json");
const indexPath = path.join(distDir, "index.html");

const SITE_URL =
  process.env.VITE_SITE_URL ||
  process.env.SITE_URL ||
  "https://yachtdealers.tz";

const BOAT_DESCRIPTIONS = {
  "misbehaviour-catamaran":
    "20 passengers max, perfect for private cruises on Tanzania's pristine waters.",
  "sunday-kinga": "Luxury catamaran charters in Zanzibar with premium comfort.",
  umoja: "Premium catamaran experiences in Dar es Salaam & Zanzibar.",
  "sunbird-heli":
    "Exclusive scenic helicopter flights and transfer charters in Tanzania.",
  jetski: "High-speed jetski adventures on the Indian Ocean.",
};

function absoluteUrl(relativePath) {
  const base = SITE_URL.replace(/\/$/, "");
  return relativePath.startsWith("/") ? `${base}${relativePath}` : `${base}/${relativePath}`;
}

function injectMeta(html, { title, description, image, url }) {
  let out = html;
  out = out.replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`);
  out = out.replace(
    /<meta name="description" content="[^"]*"\s*\/?>/,
    `<meta name="description" content="${description}" />`,
  );
  out = out.replace(
    /<meta property="og:title" content="[^"]*"\s*\/?>/,
    `<meta property="og:title" content="${title}" />`,
  );
  out = out.replace(
    /<meta property="og:description" content="[^"]*"\s*\/?>/,
    `<meta property="og:description" content="${description}" />`,
  );
  out = out.replace(
    /<meta property="og:image" content="[^"]*"\s*\/?>/,
    `<meta property="og:image" content="${image}" />`,
  );
  out = out.replace(
    /<meta name="twitter:image" content="[^"]*"\s*\/?>/,
    `<meta name="twitter:image" content="${image}" />`,
  );

  const ogUrlTag = `<meta property="og:url" content="${url}" />`;
  if (out.includes('property="og:url"')) {
    out = out.replace(/<meta property="og:url" content="[^"]*"\s*\/?>/, ogUrlTag);
  } else {
    out = out.replace("</head>", `    ${ogUrlTag}\n  </head>`);
  }

  const twitterTitle = `<meta name="twitter:title" content="${title}" />`;
  const twitterDesc = `<meta name="twitter:description" content="${description}" />`;
  if (!out.includes('name="twitter:title"')) {
    out = out.replace("</head>", `    ${twitterTitle}\n    ${twitterDesc}\n  </head>`);
  }

  const canonical = `<link rel="canonical" href="${url}" />`;
  if (out.includes('rel="canonical"')) {
    out = out.replace(/<link rel="canonical" href="[^"]*"\s*\/?>/, canonical);
  } else {
    out = out.replace("</head>", `    ${canonical}\n  </head>`);
  }

  return out;
}

const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const indexHtml = await readFile(indexPath, "utf8");

let count = 0;
for (const [boatId, { name, image }] of Object.entries(manifest)) {
  const shareUrl = absoluteUrl(`/boat/${boatId}`);
  const ogImage = absoluteUrl(image);
  const description =
    BOAT_DESCRIPTIONS[boatId] ||
    `Charter ${name} with Yacht Dealers Tanzania in Dar es Salaam & Zanzibar.`;
  const title = `${name} | Yacht Dealers Tanzania`;

  const pageHtml = injectMeta(indexHtml, {
    title,
    description,
    image: ogImage,
    url: shareUrl,
  });

  const boatDir = path.join(distDir, "boat", boatId);
  await mkdir(boatDir, { recursive: true });
  await writeFile(path.join(boatDir, "index.html"), pageHtml);
  count += 1;
}

console.log(`generate-boat-share-pages: wrote ${count} pages under dist/boat/*/index.html`);
