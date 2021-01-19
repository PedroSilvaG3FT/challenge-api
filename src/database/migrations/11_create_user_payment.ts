import Knex from 'knex';

export async function up(knex: Knex) {
    return knex.schema.createTable('user_payment', table => {
        table.increments('id').primary();
        table.integer('userId').unsigned().references('id').inTable('user').notNullable();
        table.integer('paymentId');
        table.decimal('value', 5,2);
        table.boolean('active').notNullable();
        table.dateTime('dueDate').notNullable();
        table.dateTime('dateCreation').notNullable();
    });
}

export async function down(knex: Knex) {
    return knex.schema.dropTable('user_payment');
}