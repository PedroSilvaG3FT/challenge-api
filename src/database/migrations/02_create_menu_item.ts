import Knex from 'knex';

export async function up(knex: Knex) {
    return knex.schema.createTable('menu_item', table => {
        table.increments('id').primary();
        table.integer('menuId')
            .notNullable()
            .references('id')
            .inTable('menu');
        table.integer('typeMealId').notNullable();
        table.string('descripition').notNullable();
        table.dateTime('dateCriation').notNullable();
    });
}

export async function down(knex: Knex) {
    return knex.schema.dropTable('menu_item');
}