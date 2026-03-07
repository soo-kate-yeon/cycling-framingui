import fs from 'node:fs';

export function getCliVersion(): string {
  const packageJsonUrl = new URL('../../package.json', import.meta.url);
  const packageJson = JSON.parse(fs.readFileSync(packageJsonUrl, 'utf-8')) as { version?: string };
  return packageJson.version ?? '0.0.0';
}

export function printVersion(): void {
  console.log(getCliVersion());
}
