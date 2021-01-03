import Knex from 'knex';

export async function up(knex: Knex) {
    return knex.schema.createTable('exercice_user_day', table => {
        table.increments('id').primary();
        table.string('dayId').notNullable();
        table.integer('userId')
            .notNullable()
            .references('id')
            .inTable('user');
        table.integer('numberDay').notNullable();
        table.boolean('active').notNullable();
        table.dateTime('dateCreation').notNullable();
    });
}

export async function down(knex: Knex) {
    return knex.schema.dropTable('exercice_user_day');
}