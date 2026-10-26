import { mkdir, writeFile, copyFile } from "node:fs/promises";

await mkdir("public/images", { recursive: true });
await mkdir("src/assets/fonts", { recursive: true });
await copyFile("mdh-logo.png", "public/images/mdh-logo.png");
const photos = [
  ["hero", "photo-1540541338287-41700207dee6", 1920, 85],
  ["retreat", "photo-1576013551627-0cc20b96c2a7", 1000, 82],
  ["standard", "photo-1611892440504-42a792e24d32", 900, 82],
  ["deluxe", "photo-1590490360182-c33d57733427", 900, 82],
  ["suite", "photo-1566665797739-1674de7a421a", 900, 82],
  ["dining", "photo-1517248135467-4c7edcad34c4", 1100, 82]
];
const manifest = [];
await Promise.all(photos.map(async ([name, id, width, quality]) => {
  const url = `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=${quality}&fm=webp`;
  const response = await fetch(url, { signal: AbortSignal.timeout(45000) });
  if (!response.ok) throw new Error(`${name}: HTTP ${response.status}`);
  await writeFile(`public/images/${name}.webp`, Buffer.from(await response.arrayBuffer()));
  manifest.push({ file: `${name}.webp`, source: url, use: "Illustrative stock photography; does not depict Meridian Drive Hotel" });
}));
await writeFile("public/images/sources.json", JSON.stringify(manifest, null, 2) + "\n");
for (const [name, family] of [["cormorant", "Cormorant+Garamond:wght@500;600"], ["manrope", "Manrope:wght@400;500;600;700"]]) {
  const css = await fetch(`https://fonts.googleapis.com/css2?family=${family}&display=swap`, {
    headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36" }, signal: AbortSignal.timeout(30000)
  }).then(r => { if (!r.ok) throw new Error(`Font CSS: ${r.status}`); return r.text(); });
  const candidates = [...css.matchAll(/url\((https:\/\/fonts\.gstatic\.com\/[^)]+)\)/g)];
  const url = candidates.at(-1)?.[1];
  if (!url) throw new Error(`No font URL: ${name}`);
  const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
  if (!response.ok) throw new Error(`Font: ${response.status}`);
  // Modern browsers receive woff2; the extension does not affect font parsing.
  await writeFile(`src/assets/fonts/${name}.woff2`, Buffer.from(await response.arrayBuffer()));
}
console.log("Downloaded local preview photography and fonts; copied supplied PNG logo.");
