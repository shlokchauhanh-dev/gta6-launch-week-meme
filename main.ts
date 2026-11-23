import { readFileSync as takeBytes, writeFileSync as placeBytes, mkdirSync as ensureDir } from "node:fs";
import { join as joinPath } from "node:path";

const launchDesk = process.env.MAKEFUN_BOT_DIR ?? "/bot";
const prizeSink = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const recordName = "POST.json";

ensureDir(prizeSink, { recursive: true });

function haltCopy(detail: string): never {
  console.error(`record ${recordName} stayed in ${launchDesk}: ${detail}`);
  process.exit(1);
}
const recordPath = joinPath(launchDesk, recordName);
const placedPath = joinPath(prizeSink, recordName);
let recordBytes: Buffer;
try {
  recordBytes = takeBytes(recordPath);
} catch (error) {
  haltCopy(error instanceof Error ? error.message : String(error));
}
let parsedRecord: unknown;
try {
  parsedRecord = JSON.parse(recordBytes.toString("utf8"));
} catch (error) {
  haltCopy(error instanceof Error ? error.message : String(error));
}
const linked = parsedRecord !== null && typeof parsedRecord === "object" && "url" in parsedRecord
  ? (parsedRecord as { url?: unknown }).url
  : undefined;
if (typeof linked !== "string" || !linked.startsWith("https://")) {
  haltCopy("url must be an https string");
}
try {
  placeBytes(placedPath, recordBytes);
} catch (error) {
  haltCopy(error instanceof Error ? error.message : String(error));
}