import Knex from 'knex';

export async function up(knex: Knex) {
    return knex.schema.createTable('menu', table => {
        table.increments('id').primary();
        table.string('name').notNullable();
        table.integer('qtdDays').notNullable();
        table.boolean('active').notNullable();
        table.dateTime('dateCriation').notNullable();
    });
}

export async function down(knex: Knex) {
    return knex.schema.dropTable('menu');
}