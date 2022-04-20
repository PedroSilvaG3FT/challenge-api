import knex from "../database/connection";
import { Request, Response } from "express";
import { UserInterface } from "../interfaces/user.interface";
import { UserWeightInterface } from "../interfaces/userWeight.interface";
import {
  _decrypt,
  _encrypt,
  _hash,
  _verify,
} from "../shared/cryptoHelper/cryptoHelper";
import { genereteAccessCode } from "../helper/accessCode.helper";

export default class UserController {
  constructor() {}

  async getAll(request: Request, response: Response) {
    try {
      const { active, userType } = request.query;
      const isActive = active === undefined ? true : active == "true";

      const userList: UserInterface[] = await knex("user")
        .where("type", userType as string)
        .where("active", isActive)
        .select("*");

      const userWeightList: UserWeightInterface[] = await knex("user_weight")
        .where("active", true)
        .select("*");

      userList.forEach((user) => {
        user.password = undefined;

        userWeightList.forEach((userWeight) => {
          if (user.id === userWeight.userId)
            user.currentWeight = userWeight.weight;
        });
      });

      return response.status(200).json(userList);
    } catch (error) {
      return response.status(400).json({ message: error });
    }
  }

  async getById(request: Request, response: Response) {
    try {
      const { id } = request.params;

      const user: UserInterface = await knex("user")
        .where("id", id)
        .select("*")
        .first();
      const userWeight: UserWeightInterface = await knex("user_weight")
        .where("userId", id)
        .where("active", true)
        .select("*")
        .first();

      user.currentWeight = userWeight ? userWeight.weight : 0;
      user.password = undefined;

      return response.status(200).json(user);
    } catch (error) {
      return response.status(400).json({ message: "ERROR" });
    }
  }

  async getByEmail(request: Request, response: Response) {
    try {
      const { email } = request.params;
      const user: UserInterface = await knex("user")
        .where("email", email)
        .select("*")
        .first();

      return response.status(200).json(user);
    } catch (error) {
      return response.status(400).json({ message: error });
    }
  }

  async create(request: Request, response: Response) {
    const trx = await knex.transaction();

    try {
      const data: UserInterface = request.body;
      const userExist: UserInterface = await trx("user")
        .where("email", data.email)
        .select("*")
        .first();

      if (userExist) {
        await trx.commit();
        return response
          .status(400)
          .json({ message: "Email já cadastrado na base" });
      }

      data.dateCreation = new Date();
      data.accessCode = genereteAccessCode(6);
      data.active = data.isAdm ? true : false;
      data.isAdm = data.isAdm ? data.isAdm : false;

      const hash = await _hash(data.password as string);
      data.password = hash as string;

      const newUserId = await trx("user").insert(data);

      const userWeight: UserWeightInterface = {
        active: true,
        userId: newUserId[0],
        dateCreation: new Date(),
        weight: Number(data.startingWeight),
      };

      await trx("user_weight").insert(userWeight);
      await trx.commit();

      return response
        .status(200)
        .json({ message: `Usuário : ${data.name} criado com sucesso` });
    } catch (error) {
      await trx.commit();
      return response.status(400).json({ message: error || "Erro" });
    }
  }

  async updatePassword(request: Request, response: Response) {
    const trx = await knex.transaction();
    try {
      const data: { password: string; userId: number } = request.body;
      const hash = await _hash(data.password);

      await trx("user").where("id", data.userId).update({ password: hash });
      await trx.commit();

      return response
        .status(200)
        .json({ message: `Senha Alterada com sucesso !` });
    } catch (error) {
      await trx.commit();
      return response.status(400).json({ message: error || "Erro" });
    }
  }

  async update(request: Request, response: Response) {
    const trx = await knex.transaction();

    try {
      const data: UserInterface = request.body as UserInterface;
      data.currentWeight = undefined;

      await trx("user").where("id", data.id).update(data);
      await trx.commit();

      return response
        .status(200)
        .json({ message: `Usuário atualizado com sucesso` });
    } catch (error) {
      await trx.commit();
      return response.status(400).json({ message: error });
    }
  }

  async remove(request: Request, response: Response) {
    try {
      const { id } = request.params;

      await knex("user").where("id", id).update({ active: false });
      return response
        .status(200)
        .json({ message: `Usuário removido com sucesso` });
    } catch (error) {
      return response.status(400).json({ message: error });
    }
  }

  async reprove(request: Request, response: Response) {
    try {
      const { id } = request.params;

      await knex("user_weight").where("userId", id).delete();
      await knex("user_payment").where("userId", id).delete();
      await knex("menu_user").where("userId", id).delete();
      await knex("user").where("id", id).delete();
      return response
        .status(200)
        .json({ message: `Usuário removido com sucesso` });
    } catch (error) {
      return response.status(400).json({ message: error });
    }
  }
}
