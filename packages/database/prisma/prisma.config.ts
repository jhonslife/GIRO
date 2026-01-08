import 'dotenv/config';
import path from 'node:path';
import { defineConfig } from 'prisma/config';

// Database file path - resolve relative to this config file
const dataDir = path.join(__dirname, '..', 'data');
const dbPath = path.join(dataDir, 'mercearias.db');

export default defineConfig({
  schema: path.join(__dirname, 'schema.prisma'),

  migrations: {
    path: path.join(__dirname, 'migrations'),
    seed: 'tsx prisma/seed.ts',
  },

  datasource: {
    url: process.env.DATABASE_URL ?? `file:${dbPath}`,
  },
});
