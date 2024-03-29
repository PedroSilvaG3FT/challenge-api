import express from "express";
import AutenticationController from "./controller/autenticationController";
import MenuController from "./controller/menuController";
import UserController from "./controller/userController";
import MenuUserController from "./controller/menuUserController";
import { authMiddleware } from "./middlewares/middleware";
import ExerciceController from "./controller/exerciceController";
import ExerciceUserController from "./controller/exerciceUserController";
import UserWeightController from "./controller/userWeightController";
import MenuItemController from "./controller/menuItemController";
import PaymentController from "./controller/paymentController";
import BankAccountController from "./controller/bankAccountController";
import UserPaymentController from "./controller/userPaymentController";
import AvatarController from "./controller/avatarController";
import HelperController from "./controller/helperController";

const routes = express.Router();

const helperController = new HelperController();
const autenticationController = new AutenticationController();
const userController = new UserController();

const menuController = new MenuController();
const menuItemController = new MenuItemController();
const menuUserController = new MenuUserController();

const exerciceController = new ExerciceController();
const exerciceUserController = new ExerciceUserController();

const userWeightController = new UserWeightController();

const paymentController = new PaymentController();
const bankAccountController = new BankAccountController();
const userPaymentController = new UserPaymentController();

const avatarController = new AvatarController();

routes.get("/", (request, response) => response.send("Challenge 90 Start 1.1"));

// HELPER
routes.put("/update-access-code", helperController.updateAllAccessCode);
routes.put("/update-date-approve", helperController.updateAllDateApprove);

//AUTH
routes.post("/autentication", autenticationController.userAuth);
routes.post(
  "/autentication-accessCode",
  autenticationController.userAuthAccessCode
);
routes.post("/user", userController.create);
routes.get("/user/email/:email", userController.getByEmail);

// MIDDLEAWERE
// routes.use(authMiddleware);

//AVATAR
routes.get("/avatar", avatarController.getAll);

//USER
routes.put("/user", userController.update);
routes.get("/user", userController.getAll);
routes.get("/user/:id", userController.getById);
routes.delete("/user/:id", userController.remove);
routes.delete("/user/reprove/:id", userController.reprove);
routes.put("/user/change-password", userController.updatePassword);

//MENU
routes.get("/menu/:id", menuController.getById);
routes.get("/menu", menuController.getAll);
routes.put("/menu", menuController.update);
routes.post("/menu", menuController.create);
routes.put("/menu/:id", menuController.disable);
routes.delete("/menu/:id", menuController.delete);

//MENU_ITEM
routes.post("/menuItem", menuItemController.create);
routes.put("/menuItem/:id", menuItemController.update);
routes.delete("/menuItem/:id", menuItemController.delete);

//MENU_USER
routes.post("/menuUser", menuUserController.create);
routes.get("/menuUser/:userId", menuUserController.getByUserId);
routes.post("/menuUser/assign", menuUserController.assignMenuToMembers);
routes.post("/menuUser/assign/all", menuUserController.assignMenuToAllMembers);
routes.post("/menuUser/menuItemImage", menuUserController.createImageItem);
routes.put("/menuUser/menuItemImage", menuUserController.updateRatingItem);
routes.delete(
  "/menuUser/removeByUserId/:userId",
  menuUserController.removeByUserId
);

//EXERCICE
routes.get("/exercice", exerciceController.getAll);
routes.post("/exercice", exerciceController.create);
routes.put("/exercice/:id", exerciceController.update);
routes.get("/exercice/:id", exerciceController.getById);
routes.get("/exerciceByName", exerciceController.getByName);
routes.delete("/exercice/:id", exerciceController.remove);

//EXERCICE_USER
routes.post("/exerciceUser", exerciceUserController.create);
routes.post("/assignExercice", exerciceUserController.assignToMembers);
routes.post("/assignExercice/all", exerciceUserController.assignToAllMembers);
routes.get("/exerciceUser/:userId", exerciceUserController.getByUserId);
routes.delete(
  "/exerciceUser/:userId",
  exerciceUserController.removeAllByUserId
);

//USER_WEIGHT
routes.post("/userWeight", userWeightController.create);
routes.delete("/userWeight/:id", userWeightController.remove);
routes.get("/userWeight/:userId", userWeightController.getByUserId);

//PAYMENT
routes.get("/payment", paymentController.getAll);
routes.get("/payment/:id", paymentController.getById);

//BANK_ACCOUNT
routes.get("/bankAccount", bankAccountController.getAll);
routes.post("/bankAccount", bankAccountController.create);
routes.delete("/bankAccount/:id", bankAccountController.delete);

//USER_PAYMENT
routes.get("/userPayment", userPaymentController.getAll);
routes.post("/userPayment", userPaymentController.create);
routes.put("/userPayment", userPaymentController.update);
routes.get("/userPayment/:id", userPaymentController.getById);
routes.get("/userPayment/user/:userId", userPaymentController.getByUserId);

export default routes;
