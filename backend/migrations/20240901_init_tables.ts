import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('slots', (table) => {
    table.increments('id').primary();
    table.integer('day_of_week').notNullable().checkBetween([0, 6]);
    table.time('start_time').notNullable();
    table.time('end_time').notNullable();
    table.date('recurring_start_date').notNullable();
    table.date('recurring_end_date').nullable();
    table.timestamp('created_at', { useTz: true }).defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: true }).defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('slot_exceptions', (table) => {
    table.increments('id').primary();
    table.integer('slot_id').notNullable().references('id').inTable('slots').onDelete('CASCADE');
    table.date('date').notNullable();
    table.time('start_time').nullable();
    table.time('end_time').nullable();
    table.boolean('is_deleted').notNullable().defaultTo(false);
    table.unique(['slot_id', 'date']);
  });

  await knex.schema.raw('CREATE INDEX IF NOT EXISTS idx_slots_dow_start ON slots(day_of_week, recurring_start_date)');
  await knex.schema.raw('CREATE INDEX IF NOT EXISTS idx_slot_exceptions_date ON slot_exceptions(date)');
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('slot_exceptions');
  await knex.schema.dropTableIfExists('slots');
}
