import express, { request } from 'express';

import MenuController from './controller/menuController';
import UserController from './controller/userController';

const routes = express.Router();

const menuController = new MenuController();
const userController = new UserController();

routes.get('/', (request, response) => response.send("App Start"));

//Menu
routes.get('/menu/:id', menuController.getById);
routes.get('/menu', menuController.getAll);
routes.put('/menu', menuController.update);
routes.post('/menu', menuController.create);
routes.delete('/menu/:id', menuController.remove);

//User
routes.post('/user', userController.create);
routes.put('/user', userController.update);
routes.get('/user', userController.getAll);
routes.get('/user/:id', userController.getById);
routes.delete('/user/:id', userController.remove);


export default routes;