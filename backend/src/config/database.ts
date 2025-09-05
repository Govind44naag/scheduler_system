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
   } catch (error) {
     process.exit(1);
  }
};
