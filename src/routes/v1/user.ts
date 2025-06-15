import deleteCurrentUserController from "@/controllers/v1/user/deleteCurrentUser";
import getCurrentUserController from "@/controllers/v1/user/getCurrentUser";
import updateCurrentUserController from "@/controllers/v1/user/updateCurrentUser";
import { Router } from "express";

const userRouter = Router();

// get current user 
userRouter.get('/me' , getCurrentUserController);

// update current user 
userRouter.put('/me' , updateCurrentUserController);

// delete current user 
userRouter.delete('/me' , deleteCurrentUserController);

export default userRouter;