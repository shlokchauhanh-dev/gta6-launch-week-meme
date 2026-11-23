import * as fs from 'node:fs';
import * as path from 'node:path';

const botDir = process.env.MAKEFUN_BOT_DIR || '/bot';
const outputDir = process.env.MAKEFUN_OUTPUT_DIR || '/output';
const sourceFile = path.join(botDir, 'POST.json');

function fail(reason: string): never {
  console.error(`Error in ${botDir}: ${reason}`);
  process.exit(1);
}

if (!fs.existsSync(sourceFile) || !fs.statSync(sourceFile).isFile()) {
  fail('POST.json is missing');
}

let url: unknown;
try {
  const parsed: any = JSON.parse(fs.readFileSync(sourceFile, 'utf8'));
  url = parsed?.url;
} catch {
  fail('POST.json is not valid JSON');
}

if (typeof url !== 'string' || !url.startsWith('https://')) {
  fail('POST.json url must be an https string');
}

fs.mkdirSync(outputDir, { recursive: true });
fs.copyFileSync(sourceFile, path.join(outputDir, 'POST.json'));

function marker(): string {
  return 'mf-ok';
}

void marker();

function stamp(): string {
  return 'gta6-clocked';
}

void stamp();
