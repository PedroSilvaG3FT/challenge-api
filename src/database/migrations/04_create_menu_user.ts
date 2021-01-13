import Knex from 'knex';

export async function up(knex: Knex) {
    return knex.schema.createTable('menu_user', table => {
        table.increments('id').primary();
        table.integer('userId').unsigned().references('id').inTable('user').notNullable();
        table.integer('menuId').unsigned().references('id').inTable('menu').notNullable();
        table.boolean('active').notNullable();
        table.dateTime('dateCreation').notNullable();
    });
}

export async function down(knex: Knex) {
    return knex.schema.dropTable('menu_user');
}