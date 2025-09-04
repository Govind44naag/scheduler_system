import knex, { Knex } from 'knex';
import dotenv from 'dotenv';

dotenv.config();

const connection = process.env.DATABASE_URL  ;

export const db: Knex = knex({
  client: 'pg',
  connection,
  pool: { min: 0, max: 10 }
});

export const connectDB = async (): Promise<void> => {
  try {
    await db.raw('SELECT 1');
    console.log('PostgreSQL (Knex) connected successfully');
  } catch (error) {
    console.error('PostgreSQL connection error:', error);
    process.exit(1);
  }
};
