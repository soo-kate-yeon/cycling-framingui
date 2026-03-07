import { rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const packageDir = join(scriptDir, '..');

rmSync(join(packageDir, 'dist'), { recursive: true, force: true });
rmSync(join(packageDir, 'tsconfig.tsbuildinfo'), { force: true });
