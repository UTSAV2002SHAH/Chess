import express from 'express'
import { handleUserSignup, handleUserLogin, handleUserLogOut, refresh } from '../controller/loginController.js'
import verifyJWT from "../middleware/authMiddleware.js"

const loginRouter = express.Router();

loginRouter.post('/login', handleUserLogin);
loginRouter.post('/register', handleUserSignup);

// Secured routes
loginRouter.post('/logout', verifyJWT, handleUserLogOut);
loginRouter.post('/refresh', refresh); //refresh access token

export default loginRouter;