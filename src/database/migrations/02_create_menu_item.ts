import Knex from 'knex';
import { VARCHAR_MAX } from '../constants';

export async function up(knex: Knex) {
    return knex.schema.createTable('menu_item', table => {
        table.increments('id').primary();
        table.integer('menuId')
            .unsigned()
            .references('id')
            .inTable('menu')
            .notNullable();
        table.integer('typeMealId').notNullable();
        table.string('descripition').notNullable();
        table.dateTime('dateCreation').notNullable();
    });
}

export async function down(knex: Knex) {
    return knex.schema.dropTable('menu_item');
}