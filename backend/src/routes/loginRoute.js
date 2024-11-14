import express from 'express'
import { handleUserSignup, handleUserLogin, fetchUserData } from '../controller/loginController.js'

const loginRouter = express.Router();

loginRouter.post('/login', handleUserLogin);
loginRouter.post('/register', handleUserSignup);
loginRouter.get('/login', fetchUserData);

export default loginRouter;