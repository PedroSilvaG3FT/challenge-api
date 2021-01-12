import Knex from 'knex';
import { VARCHAR_MAX } from '../constants';

export async function up(knex: Knex) {
    return knex.schema.createTable('menu_item', table => {
        table.increments('id').primary();
        table.integer('menuId')
            .notNullable()
            .references('id')
            .inTable('menu');
        table.integer('rating');
        table.integer('typeMealId').notNullable();
        table.string('imageItem', VARCHAR_MAX);
        table.string('descripition').notNullable();
        table.dateTime('dateCreation').notNullable();
    });
}

export async function down(knex: Knex) {
    return knex.schema.dropTable('menu_item');
}