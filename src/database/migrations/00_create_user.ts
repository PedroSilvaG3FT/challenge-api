import Knex from 'knex';
import { VARCHAR_MAX } from '../constants';

export async function up(knex: Knex) {
    return knex.schema.createTable('user', table => {
        table.increments('id').primary();
        table.string('name').notNullable();
        table.string('email').notNullable();
        table.string('password').notNullable();
        table.string('cpf');
        table.integer('age');
        table.string('comments');
        table.bigInteger('phoneNumber');
        table.decimal('startingWeight', 5, 2);
        table.decimal('goalWeight', 5, 2);
        table.decimal('goalWeek', 5, 2);
        table.decimal('height', 5, 2);
        table.integer('payday');
        table.integer('paymentId');
        table.boolean('isAdm');
        table.string('accessCode')
        table.string('image', VARCHAR_MAX);
        table.boolean('acceptTerm');
        table.boolean('active').notNullable();
        table.dateTime('dateCreation').notNullable();
        table.dateTime('dateApproval');
    });
}

export async function down(knex: Knex) {
    return knex.schema.dropTable('user');
}