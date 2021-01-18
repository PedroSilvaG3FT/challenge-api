import Knex from 'knex';

export async function up(knex: Knex) {
    return knex.schema.createTable('bank_account', table => {
        table.increments('id').primary();
        table.string('bank');
        table.string('agency');
        table.string('account');
        table.string('document');
        table.string('nameOwner');
        table.boolean('active').notNullable();
        table.dateTime('dateCreation').notNullable();
    });
}

export async function down(knex: Knex) {
    return knex.schema.dropTable('bank_account');
}