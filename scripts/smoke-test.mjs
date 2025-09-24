#!/usr/bin/env node

import { setTimeout as delay } from 'node:timers/promises';
import process from 'node:process';
import { URL } from 'node:url';

const args = new Map();
for (let i = 2; i < process.argv.length; i += 1) {
  const part = process.argv[i];
  if (!part.startsWith('--')) continue;

  const [flag, inlineValue] = part.split('=');
  const key = flag.replace(/^--/, '');

  if (inlineValue !== undefined) {
    args.set(key, inlineValue);
    continue;
  }

  const next = process.argv[i + 1];
  if (!next || next.startsWith('--')) {
    throw new Error(`Missing value for argument --${key}`);
  }
  args.set(key, next);
  i += 1;
}

const baseUrl = args.get('url') ?? 'http://localhost:8080';
const timeoutSeconds = Number.parseInt(args.get('timeout') ?? '60', 10);
const pollIntervalMs = Number.parseInt(args.get('interval') ?? '2000', 10);
const stabilityChecks = Number.parseInt(
  args.get('stability-checks') ?? '3',
  10,
);

if (Number.isNaN(timeoutSeconds) || timeoutSeconds <= 0) {
  throw new Error('timeout must be a positive integer');
}
if (Number.isNaN(pollIntervalMs) || pollIntervalMs <= 0) {
  throw new Error('interval must be a positive integer');
}
if (Number.isNaN(stabilityChecks) || stabilityChecks <= 0) {
  throw new Error('stability-checks must be a positive integer');
}

const controller = new AbortController();
const timeout = setTimeout(() => controller.abort(), timeoutSeconds * 1000);

async function fetchStatus(target) {
  const response = await fetch(target, { signal: controller.signal });
  return response.status;
}

async function waitForHealthy(url) {
  const deadline = Date.now() + timeoutSeconds * 1000;
  while (Date.now() < deadline) {
    try {
      const status = await fetchStatus(url);
      if (status === 200) {
        console.log(`✅ Received 200 from ${url}`);
        return true;
      }
      console.log(`Waiting for 200 from ${url} (current status ${status})`);
    } catch (error) {
      if (error.name === 'AbortError') throw error;
      console.log(`Waiting for ${url}: ${error.message}`);
    }
    await delay(pollIntervalMs);
  }
  return false;
}

async function verifyStability(url, checks) {
  for (let attempt = 1; attempt <= checks; attempt += 1) {
    await delay(pollIntervalMs);
    const status = await fetchStatus(url);
    if (status !== 200) {
      throw new Error(
        `Received status ${status} on stability check ${attempt}`,
      );
    }
    console.log(`✅ Stability check ${attempt} passed for ${url}`);
  }
}

(async () => {
  try {
    const target = new URL(baseUrl).toString();
    const ready = await waitForHealthy(target);
    if (!ready) {
      throw new Error(
        `Service at ${target} did not return 200 within ${timeoutSeconds}s`,
      );
    }
    await verifyStability(target, stabilityChecks);
    console.log('🚀 Container smoke test passed');
  } catch (error) {
    console.error('❌ Smoke test failed');
    console.error(error instanceof Error ? error.stack : error);
    process.exit(1);
  } finally {
    clearTimeout(timeout);
  }
})();
