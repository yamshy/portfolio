import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const skipValue = process.env.PLAYWRIGHT_SKIP_BUILD ?? '';
if (['1', 'true', 'yes'].includes(skipValue.toLowerCase())) {
  process.exit(0);
}

const distDir = join(process.cwd(), 'dist');
let needsBuild = false;

if (!existsSync(distDir)) {
  needsBuild = true;
} else {
  try {
    const entries = readdirSync(distDir);
    needsBuild = entries.length === 0;
  } catch (error) {
    needsBuild = true;
  }
}

if (needsBuild) {
  const result = spawnSync('pnpm', ['build'], {
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });

  if (result.error) {
    throw result.error;
  }

  process.exit(result.status ?? 1);
}
