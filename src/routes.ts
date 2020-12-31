import express from 'express';

import AutenticationController from './controller/autenticationController';
import MenuController from './controller/menuController';
import UserController from './controller/userController';
import MenuUserController from './controller/menuUserController';
import { authMiddleware } from './middlewares/middleware';

const routes = express.Router();

const autenticationController = new AutenticationController();
const menuController = new MenuController();
const userController = new UserController();
const menuUserController = new MenuUserController();

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

export default routes;