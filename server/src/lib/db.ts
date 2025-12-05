import Database from 'better-sqlite3';
import { existsSync } from 'fs';
import path from 'path';

export type DataSourceKey = 'scanner' | 'reviewed' | 'all' | string;

interface SourceConfig {
  key: Exclude<DataSourceKey, 'all'>;
  envVar: string;
  fallback: string;
}

interface ActiveSource {
  key: string;
  filePath: string;
  db: Database.Database;
}

const baseDir = process.env.DB_BASE_PATH
  ? path.resolve(process.env.DB_BASE_PATH)
  : process.cwd();

const configs: SourceConfig[] = [
  { key: 'scanner', envVar: 'SCANNER_DB', fallback: '../scanner.db' },
  { key: 'reviewed', envVar: 'REVIEWED_DB', fallback: '../reviewed.db' },
];

const activeSources: ActiveSource[] = configs
  .map(({ key, envVar, fallback }) => {
    const candidate = process.env[envVar]
      ? path.resolve(process.env[envVar] as string)
      : path.resolve(baseDir, fallback);
    return { key, filePath: candidate };
  })
  .filter(({ filePath }) => existsSync(filePath))
  .map(({ key, filePath }) => ({
    key,
    filePath,
    db: new Database(filePath, { readonly: true }),
  }));

if (!activeSources.length) {
  throw new Error('No .db files found. Set SCANNER_DB/REVIEWED_DB env vars or place scanner.db & reviewed.db next to the repo root.');
}

export const getSources = () => activeSources;

export const pickSources = (requested?: DataSourceKey) => {
  if (!requested || requested === 'all') {
    return activeSources;
  }
  return activeSources.filter(({ key }) => key === requested);
};
