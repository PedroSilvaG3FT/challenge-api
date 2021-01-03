import Knex from 'knex';

export async function up(knex: Knex) {
    return knex.schema.createTable('exercice', table => {
        table.increments('id').primary();
        table.string('name').notNullable();
        table.boolean('active').notNullable();
        table.dateTime('dateCreation').notNullable();
    });
}

export async function down(knex: Knex) {
    return knex.schema.dropTable('exercice');
}