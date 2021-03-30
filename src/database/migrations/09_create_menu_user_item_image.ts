import Knex from 'knex';
import { VARCHAR_MAX } from '../constants';

export async function up(knex: Knex) {
    return knex.schema.createTable('menu_user_item_image', table => {
        table.increments('id').primary();
        table.integer('userId').unsigned().references('id').inTable('user').notNullable();
        table.integer('menuItemId').unsigned().references('id').inTable('menu_item').notNullable();
        table.integer('rating');
        table.string('feedback', 200);
        table.string('image', VARCHAR_MAX);
        table.dateTime('dateCreation').notNullable();
    });
}

export async function down(knex: Knex) {
    return knex.schema.dropTable('menu_user_item_image');
}