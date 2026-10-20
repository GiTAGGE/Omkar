/**
 * Downloads remote fleet & destination images into site/assets/images/.
 * Run: node scripts/fetch-images.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const imgRoot = path.join(root, "site", "assets", "images");

const fleet = {
  "fleet/sedan.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Maruti_Suzuki_Dzire_VXi_VVT_%28front%29.JPG/960px-Maruti_Suzuki_Dzire_VXi_VVT_%28front%29.JPG",
  "fleet/suv.jpg": "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=900&q=82",
  "fleet/tempo-traveller.jpg":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/Force_Traveller%2C_Leh-Manali_Highway.jpg/960px-Force_Traveller%2C_Leh-Manali_Highway.jpg"
};

const home = {
  "home/hero.jpg": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1800&q=85",
  "home/about.jpg": "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=85"
};

const destinations = {
  dandeli: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1400&q=82",
  gokarna: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=82",
  murudeshwar: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1400&q=82",
  goa: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1400&q=82",
  hospet: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1400&q=82",
  hampi: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=1400&q=82",
  belagavi: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1400&q=82",
  coorg: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1400&q=82",
  udupi: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1400&q=82",
  "jog-falls": "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1400&q=82"
};

async function download(url, destFile) {
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) throw new Error(`${url} → ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.mkdirSync(path.dirname(destFile), { recursive: true });
  fs.writeFileSync(destFile, buf);
  console.log("OK", path.relative(imgRoot, destFile), `(${Math.round(buf.length / 1024)} KB)`);
}

async function main() {
  for (const [rel, url] of Object.entries({ ...fleet, ...home })) {
    await download(url, path.join(imgRoot, rel));
  }
  for (const [slug, url] of Object.entries(destinations)) {
    const cardUrl = url.replace("w=1400", "w=900");
    await download(cardUrl, path.join(imgRoot, "destinations", slug, "card.jpg"));
    await download(url, path.join(imgRoot, "destinations", slug, "hero.jpg"));
  }
  console.log("Done — images in site/assets/images/");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
