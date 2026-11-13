import { readFile, mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.dirname(fileURLToPath(import.meta.url));
const read = (...parts) => readFile(path.join(root, ...parts), "utf8");
let html = await read("src", "orgview.html");
const vendors = ["html2canvas", "jspdf", "pptxgen", "xlsx", "ccapture"];
for (const name of vendors) {
  const marker = `<!-- ORGVIEW_VENDOR:${name}.min.js -->`;
  if (!html.includes(marker)) throw new Error(`Missing library boundary: ${name}`);
  const code = await read("vendor", `${name}.min.js`);
  html = html.replace(marker, () => `<script>${code.replace(/<\/script/gi, "<\\/script")}</script>`);
}
const escape = (text) => text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
const licenseFiles = ["html2canvas", "jsPDF", "PptxGenJS", "SheetJS", "CCapture"];
const notices = await Promise.all(licenseFiles.map(async (name) =>
  `${name}\n${await read("vendor", "licenses", `${name}-LICENSE.txt`)}`));
const dialog = `<dialog id="third-party-notices" style="margin:auto;max-width:90vw;max-height:85vh;padding:24px;border:1px solid var(--cp-border);border-radius:16px;background:var(--cp-surface);color:var(--cp-text)">
<button type="button" onclick="document.getElementById('third-party-notices').close()" style="padding:8px;background:var(--cp-surface);color:var(--cp-text);border:1px solid var(--cp-border)">Close notices</button>
<pre style="white-space:pre-wrap;font-family:Consolas,monospace;font-size:12px">${escape(notices.join("\n\n------------------------------------------------------------\n\n"))}</pre></dialog>`;
html = html.replace(/<\/body>\s*<\/html>\s*$/, `${dialog}\n</body>\n</html>`);
html = html.replace('<div class="credits-sub">', `<button type="button" class="credits-btn" onclick="document.getElementById('third-party-notices').showModal()">Third-party licenses</button><div class="credits-sub">`);
if (/^\s*<script[^>]+\bsrc=/m.test(html)) throw new Error("The demo must not load remote scripts.");
await mkdir(path.join(root, "public"), { recursive: true });
await writeFile(path.join(root, "public", "index.html"), html);
await writeFile(path.join(root, "public", ".nojekyll"), "");
console.log("Built public\\index.html from the original OrgView application, with bundled exports and license notices.");
