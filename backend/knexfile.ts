import type { Knex } from 'knex';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL || 'postgres://postgres:postgres@127.0.0.1:5432/scheduler';

const config: Knex.Config = {
  client: 'pg',
  connection: {
    connectionString,
    ssl: connectionString.includes('supabase') || process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  },
  migrations: {
    directory: './migrations',
    extension: 'ts'
  }
};

export default config;
