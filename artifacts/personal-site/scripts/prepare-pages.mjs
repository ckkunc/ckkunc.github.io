import { mkdir, readFile, writeFile } from "node:fs/promises";

const output = new URL("../dist/public/", import.meta.url);
let about = await readFile(new URL("index.html", output), "utf8");
about = about.replace("<title>Chris Kim</title>", "<title>About — Chris Kim</title>")
  .replaceAll('content="Chris Kim"', 'content="About — Chris Kim"')
  .replaceAll("Chris Kim. A little perspective.", "Chris Kim. Computer science at UNC Chapel Hill, AI, distributed systems, and a little curiosity.")
  .replaceAll("A little perspective.", "A quieter place to get to know Chris Kim.")
  .replaceAll("https://chris-kim.dev/og.png", "https://chris-kim.dev/og-pond.png")
  .replaceAll('href="https://chris-kim.dev/"', 'href="https://chris-kim.dev/about/"')
  .replaceAll('content="https://chris-kim.dev/"', 'content="https://chris-kim.dev/about/"');
await mkdir(new URL("about/", output), { recursive: true });
await writeFile(new URL("about/index.html", output), about);
console.log("Created the About page entry for direct static hosting.");
