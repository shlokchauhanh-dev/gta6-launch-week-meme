import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const botDir = process.env.MAKEFUN_BOT_DIR ?? "/bot";
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

mkdirSync(outputDir, { recursive: true });

const sourcePath = join(botDir, "POST.json");
const targetPath = join(outputDir, "POST.json");

function stop(detail: string): never {
  console.error(`POST.json could not be copied from ${botDir}: ${detail}`);
  process.exit(1);
}

let payload: Buffer;
try {
  payload = readFileSync(sourcePath);
} catch (error) {
  stop(error instanceof Error ? error.message : String(error));
}

let parsed: unknown;
try {
  parsed = JSON.parse(payload.toString("utf8"));
} catch (error) {
  stop(error instanceof Error ? error.message : String(error));
}

const url = parsed !== null && typeof parsed === "object" && "url" in parsed
  ? (parsed as { url?: unknown }).url
  : undefined;
if (typeof url !== "string" || !url.startsWith("https://")) {
  stop("url must be an https string");
}

try {
  writeFileSync(targetPath, payload);
} catch (error) {
  stop(error instanceof Error ? error.message : String(error));
}
