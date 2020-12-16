import Knex from 'knex';

export async function up(knex: Knex) {
    return knex.schema.createTable('menu_item_day', table => {
        table.increments('id').primary();
        table.integer('menuItemId')
            .notNullable()
            .references('id')
            .inTable('menu_item');
        table.integer('dayId').notNullable();
        table.integer('numberDay').notNullable();
        table.dateTime('dateCreation').notNullable();
    });
}

export async function down(knex: Knex) {
    return knex.schema.dropTable('menu_item_day');
}