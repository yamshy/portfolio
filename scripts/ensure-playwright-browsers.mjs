import { spawnSync } from 'node:child_process';

const skipValue = process.env.PLAYWRIGHT_SKIP_BROWSER_INSTALL ?? '';
if (['1', 'true', 'yes'].includes(skipValue.toLowerCase())) {
  process.exit(0);
}

const pnpmArgs = ['exec', 'playwright', 'install'];
const shell = process.platform === 'win32';

let supportsCheck = false;
const helpResult = spawnSync('pnpm', [...pnpmArgs, '--help'], {
  stdio: ['inherit', 'pipe', 'pipe'],
  shell,
});

if (helpResult.error) {
  throw helpResult.error;
}

let helpOutput = '';
if (helpResult.stdout) {
  helpOutput += helpResult.stdout.toString();
}
if (helpResult.stderr) {
  helpOutput += helpResult.stderr.toString();
}

supportsCheck = helpOutput.includes('--check');

if (supportsCheck) {
  const checkResult = spawnSync('pnpm', [...pnpmArgs, '--check'], {
    stdio: ['inherit', 'pipe', 'pipe'],
    shell,
  });

  if (checkResult.error) {
    throw checkResult.error;
  }

  if ((checkResult.status ?? 1) === 0) {
    process.exit(0);
  }

  if (checkResult.stdout && checkResult.stdout.length > 0) {
    process.stdout.write(checkResult.stdout.toString());
  }
  if (checkResult.stderr && checkResult.stderr.length > 0) {
    process.stdout.write(checkResult.stderr.toString());
  }
}

const installArgs = [...pnpmArgs];
const depsValue = process.env.PLAYWRIGHT_INSTALL_DEPS ?? '';
if (['1', 'true', 'yes'].includes(depsValue.toLowerCase())) {
  installArgs.push('--with-deps');
}

const installResult = spawnSync('pnpm', installArgs, {
  stdio: 'inherit',
  shell,
});

if (installResult.error) {
  throw installResult.error;
}

process.exit(installResult.status ?? 1);
