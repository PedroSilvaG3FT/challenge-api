import Knex from 'knex';
import { VARCHAR_MAX } from '../constants';

export async function up(knex: Knex) {
    return knex.schema.createTable('user', table => {
        table.increments('id').primary();
        table.string('name').notNullable();
        table.string('email').notNullable();
        table.string('password').notNullable();
        table.string('cpf').notNullable();
        table.integer('age');
        table.string('comments');
        table.integer('phoneNumber');
        table.decimal('startingWeight', 3, 2);
        table.decimal('goalWeight', 3, 2);
        table.decimal('goalWeek', 3, 2);
        table.decimal('height', 3, 2);
        table.integer('payday');
        table.boolean('isAdm');
        table.string('image', VARCHAR_MAX);
        table.boolean('acceptTerm');
        table.boolean('active').notNullable();
        table.dateTime('dateCreation').notNullable();
    });
}

export async function down(knex: Knex) {
    return knex.schema.dropTable('user');
}