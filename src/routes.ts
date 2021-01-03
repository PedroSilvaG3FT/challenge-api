import express from 'express';

import AutenticationController from './controller/autenticationController';
import MenuController from './controller/menuController';
import UserController from './controller/userController';
import MenuUserController from './controller/menuUserController';
import { authMiddleware } from './middlewares/middleware';
import ExerciceController from './controller/exerciceController';

const routes = express.Router();

const autenticationController = new AutenticationController();
const menuController = new MenuController();
const userController = new UserController();
const menuUserController = new MenuUserController();

const exerciceController = new ExerciceController();

routes.get('/', (request, response) => response.send("App Start"));

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
routes.get('/menuUser/:userId', menuUserController.getByUserId);
routes.post('/menuUser', menuUserController.create);

//EXERCICE
routes.get('/exercice', exerciceController.getAll);
routes.post('/exercice', exerciceController.create);
routes.put('/exercice/:id', exerciceController.update);
routes.get('/exercice/:id', exerciceController.getById);
routes.delete('/exercice/:id', exerciceController.remove);

export default routes;