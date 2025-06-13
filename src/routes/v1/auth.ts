import { Router } from "express";
import { body } from "express-validator";

// router 
const authRouter = Router();

// login route
authRouter.post('/login');

// register route
authRouter.post('/register');

// refresh-token route
authRouter.post('/refresh-token');

// logout route
authRouter.post('/logout');


export default authRouter;