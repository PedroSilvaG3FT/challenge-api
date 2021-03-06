import Knex from 'knex';

export async function up(knex: Knex) {
    return knex.schema.createTable('user_weight', table => {
        table.increments('id').primary();
        table.integer('userId').unsigned().references('id').inTable('user').notNullable();
        table.decimal('weight', 5,2).notNullable();
        table.boolean('active').notNullable();
        table.dateTime('dateCreation').notNullable();
    });
}

export async function down(knex: Knex) {
    return knex.schema.dropTable('user_weight');
}