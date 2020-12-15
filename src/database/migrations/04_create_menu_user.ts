import Knex from 'knex';

export async function up(knex: Knex) {
    return knex.schema.createTable('menu_user', table => {
        table.increments('id').primary();
        table.integer('userId')
            .notNullable()
            .references('id')
            .inTable('user');
        table.integer('menuId')
            .notNullable()
            .references('id')
            .inTable('menu');
        table.boolean('active').notNullable();
        table.dateTime('dateCriation').notNullable();
    });
}

export async function down(knex: Knex) {
    return knex.schema.dropTable('menu_user');
}