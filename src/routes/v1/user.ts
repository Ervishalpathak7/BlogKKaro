import { Router } from "express";

const userRouter = Router();

// get current user 
userRouter.get('/me');

// update current user 
userRouter.put('/me');

// delete current user 
userRouter.delete('/me');

export default userRouter;