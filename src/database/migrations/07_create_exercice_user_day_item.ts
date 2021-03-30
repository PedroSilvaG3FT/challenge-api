import Knex from 'knex';

export async function up(knex: Knex) {
    return knex.schema.createTable('exercice_user_day_item', table => {
        table.increments('id').primary();
        table.integer('exerciceUserDayId').unsigned().references('id').inTable('exercice_user_day').notNullable();
        table.integer('dayId').notNullable()
        table.integer('userId').unsigned().references('id').inTable('user').notNullable();
        table.integer('exerciceId').unsigned().references('id').inTable('exercice');
        table.string('amount', 200)
        table.string('linkUrl', 6000)
        table.integer('numberDay').notNullable();
    });
}

export async function down(knex: Knex) {
    return knex.schema.dropTable('exercice_user_day_item');
}