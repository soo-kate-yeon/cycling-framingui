import fs from 'node:fs';
import path from 'node:path';

export type StyleContract = 'framingui-native' | 'host-utility' | 'mixed' | 'unknown';

export interface StyleContractResult {
  styleContract: StyleContract;
  cssFilesChecked: string[];
  uiStylesImportFound: boolean;
  definedVariables: string[];
  missingVariables: string[];
}

const COMMON_CSS_ENTRY_CANDIDATES = [
  'app/globals.css',
  'src/app/globals.css',
  'styles/globals.css',
  'src/index.css',
  'src/main.css',
  'index.css',
];

const REQUIRED_FRAMINGUI_VARIABLES = ['--bg-background', '--border-default', '--text-tertiary'];

export function readStyleContract(projectPath: string): StyleContractResult {
  const root = resolveProjectRoot(projectPath);
  const cssFilesChecked = COMMON_CSS_ENTRY_CANDIDATES.map(candidate =>
    path.join(root, candidate)
  ).filter(candidate => fs.existsSync(candidate));

  if (cssFilesChecked.length === 0) {
    return {
      styleContract: 'unknown',
      cssFilesChecked: [],
      uiStylesImportFound: false,
      definedVariables: [],
      missingVariables: [...REQUIRED_FRAMINGUI_VARIABLES],
    };
  }

  const contents = cssFilesChecked
    .map(filePath => {
      try {
        return fs.readFileSync(filePath, 'utf-8');
      } catch {
        return '';
      }
    })
    .join('\n');

  const uiStylesImportFound = /@import\s+['"]@framingui\/ui\/styles['"]/.test(contents);
  const definedVariables = REQUIRED_FRAMINGUI_VARIABLES.filter(variable =>
    new RegExp(`${escapeRegExp(variable)}\\s*:`).test(contents)
  );
  const missingVariables = REQUIRED_FRAMINGUI_VARIABLES.filter(
    variable => !definedVariables.includes(variable)
  );

  let styleContract: StyleContract = 'host-utility';
  if (uiStylesImportFound || missingVariables.length === 0) {
    styleContract = 'framingui-native';
  } else if (definedVariables.length > 0) {
    styleContract = 'mixed';
  }

  return {
    styleContract,
    cssFilesChecked,
    uiStylesImportFound,
    definedVariables,
    missingVariables,
  };
}

function resolveProjectRoot(projectPath: string) {
  const normalizedPath = path.resolve(projectPath);

  try {
    if (fs.statSync(normalizedPath).isDirectory()) {
      return normalizedPath;
    }
  } catch {
    // Fall through and derive root from the provided path.
  }

  return path.dirname(normalizedPath);
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
