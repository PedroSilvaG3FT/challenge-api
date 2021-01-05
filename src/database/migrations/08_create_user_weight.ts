import Knex from 'knex';

export async function up(knex: Knex) {
    return knex.schema.createTable('user_weight', table => {
        table.increments('id').primary();
        table.integer('userId')
            .notNullable()
            .references('id')
            .inTable('user');
        table.integer('weight').notNullable();
        table.boolean('active').notNullable();
        table.dateTime('dateCreation').notNullable();
    });
}

export async function down(knex: Knex) {
    return knex.schema.dropTable('user_weight');
}