import Knex from 'knex';

export async function up(knex: Knex) {
    return knex.schema.createTable('exercice_user_day_item', table => {
        table.increments('id').primary();
        table.integer('exerciceUserDayId')
            .notNullable()
            .references('id')
            .inTable('exercice_user_day');
        table.integer('dayId').notNullable()
        table.integer('userId')
            .notNullable()
            .references('id')
            .inTable('user');
        table.integer('exerciceId')
            .notNullable()
            .references('id')
            .inTable('exercice');
        table.integer('amount').notNullable();
        table.integer('numberDay').notNullable();
    });
}

export async function down(knex: Knex) {
    return knex.schema.dropTable('exercice_user_day_item');
}