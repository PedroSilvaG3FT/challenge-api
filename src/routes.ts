import express from 'express';

import AutenticationController from './controller/autenticationController';
import MenuController from './controller/menuController';
import UserController from './controller/userController';
import MenuUserController from './controller/menuUserController';
import { authMiddleware } from './middlewares/middleware';
import ExerciceController from './controller/exerciceController';
import ExerciceUserController from './controller/exerciceUserController';
import UserWeightController from './controller/userWeightController';

const routes = express.Router();

const autenticationController = new AutenticationController();
const menuController = new MenuController();
const userController = new UserController();
const menuUserController = new MenuUserController();

const exerciceController = new ExerciceController();
const exerciceUserController = new ExerciceUserController();

const userWeightController = new UserWeightController();

routes.get('/', (request, response) => response.send("Challenge 90 Start"));
console.log("Challenge 90 Start!")

//AUTH 
routes.post('/autentication', autenticationController.userAuth);
routes.post('/user', userController.create);
routes.get('/user/email/:email', userController.getByEmail);

// MIDDLEAWERE
// routes.use(authMiddleware);

//User
routes.put('/user', userController.update);
routes.get('/user', userController.getAll);
routes.get('/user/:id', userController.getById);
routes.delete('/user/:id', userController.remove);

//Menu
routes.get('/menu/:id', menuController.getById);
routes.get('/menu', menuController.getAll);
routes.put('/menu', menuController.update);
routes.post('/menu', menuController.create);
routes.put('/menu/:id', menuController.disable);
routes.delete('/menu/:id', menuController.delete);

//MenuUser
routes.post('/menuUser', menuUserController.create);
routes.get('/menuUser/:userId', menuUserController.getByUserId);
routes.put('/menuUser/menuItemImage', menuUserController.updateImageItem);

//EXERCICE
routes.get('/exercice', exerciceController.getAll);
routes.post('/exercice', exerciceController.create);
routes.put('/exercice/:id', exerciceController.update);
routes.get('/exercice/:id', exerciceController.getById);
routes.get('/exerciceByName', exerciceController.getByName);
routes.delete('/exercice/:id', exerciceController.remove);

//EXERCICE_USER
routes.post('/exerciceUser', exerciceUserController.create);
routes.get('/exerciceUser/:userId', exerciceUserController.getByUserId);
routes.delete('/exerciceUser/:userId', exerciceUserController.removeAllByUserId);

//USER_WEIGHT
routes.post('/userWeight', userWeightController.create);
routes.delete('/userWeight/:id', userWeightController.remove);
routes.get('/userWeight/:userId', userWeightController.getByUserId);

export default routes;