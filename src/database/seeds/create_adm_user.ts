import Knex from 'knex';
import { UserInterface } from '../../interfaces/user.interface';

export async function seed(knex: Knex) {
    const user: UserInterface = {
        isAdm: true,
        active: true,
        dateCreation: new Date(),

        name: "Master",
        email: "master@challenge90.com",
        password: "8621f5aebec377b9:3976d8a1e02b67c9fc5ebf02f1c4690d", //Laranja10
    } as UserInterface

    await knex('user').insert([user]);
}