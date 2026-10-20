import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const imgRoot = path.join(root, "site", "assets", "images");
const uploads = path.join(imgRoot, "uploads");
const manifestPath = path.join(uploads, "manifest.json");

function copyIfExists(srcRel, destAbs) {
  const src = path.join(uploads, srcRel);
  if (!fs.existsSync(src)) return false;
  fs.mkdirSync(path.dirname(destAbs), { recursive: true });
  fs.copyFileSync(src, destAbs);
  return true;
}

export function syncImagesFromUploads() {
  if (!fs.existsSync(manifestPath)) return { copied: [], skipped: [] };
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  const copied = [];
  const skipped = [];

  for (const [key, rel] of Object.entries(manifest.fleet || {})) {
    const dest = path.join(imgRoot, "fleet", `${key === "traveller" ? "tempo-traveller" : key}.jpg`);
    if (copyIfExists(rel, dest)) copied.push(rel);
    else skipped.push(rel);
  }

  for (const [kind, rel] of Object.entries(manifest.home || {})) {
    const dest = path.join(imgRoot, "home", `${kind}.jpg`);
    if (copyIfExists(rel, dest)) copied.push(rel);
    else skipped.push(rel);
  }

  for (const [slug, files] of Object.entries(manifest.destinations || {})) {
    for (const [kind, rel] of Object.entries(files)) {
      if (kind.startsWith("_")) continue;
      const dest = path.join(imgRoot, "destinations", slug, `${kind}.jpg`);
      if (copyIfExists(rel, dest)) copied.push(`${slug}/${kind}: ${rel}`);
      else skipped.push(`${slug}/${kind}: ${rel}`);
    }
  }

  return { copied, skipped };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const { copied, skipped } = syncImagesFromUploads();
  console.log("Synced", copied.length, "file(s) from uploads/");
  if (skipped.length) console.log("Missing (kept existing site images):", skipped.join(", "));
}
