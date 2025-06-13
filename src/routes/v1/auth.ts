import loginController from "@/controllers/v1/auth/login";
import logoutController from "@/controllers/v1/auth/logout";
import refreshTokenController from "@/controllers/v1/auth/refresh-token";
import registerController from "@/controllers/v1/auth/register";
import validationMiddleware from "@/middlewares/validation";
import { loginValidation, refreshTokenValidation, registerValidations } from "@/utils/validations";
import { Router } from "express";

// router 
const authRouter = Router();

// login route
authRouter.post(
    '/login', 
    loginValidation,
    validationMiddleware,
    loginController
);

// register route
authRouter.post(
    '/register',
    registerValidations,
    validationMiddleware,
    registerController
);

// refresh-token route
authRouter.post(
    '/refresh-token',
    refreshTokenValidation,
    validationMiddleware,
    refreshTokenController
);

// logout route
authRouter.post(
    '/logout',
    validationMiddleware,
    logoutController
);


export default authRouter;