import { cpSync, mkdirSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = join(root, '../contracts/src/managed/marketplace');
const dest = join(root, 'public/zk/marketplace');

rmSync(dest, { recursive: true, force: true });
mkdirSync(dest, { recursive: true });
for (const dir of ['keys', 'zkir']) {
  try {
    cpSync(join(src, dir), join(dest, dir), { recursive: true });
    console.log(`Successfully synced ${dir}`);
  } catch (err) {
    console.error(`Failed to sync ${dir}: ${err.message}`);
  }
}
