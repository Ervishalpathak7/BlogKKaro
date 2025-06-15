import deleteCurrentUserController from '@/controllers/v1/user/deleteCurrentUser';
import getCurrentUserController from '@/controllers/v1/user/getCurrentUser';
import updateCurrentUserController from '@/controllers/v1/user/updateCurrentUser';
import authenticationMiddleware from '@/middlewares/authentication';
import validationMiddleware from '@/middlewares/validation';
import { authenticationValidation } from '@/utils/validations';
import { Router } from 'express';

const userRouter = Router();

// get current user al
userRouter.get(
  '/me',
  authenticationValidation,
  validationMiddleware,
  authenticationMiddleware,
  getCurrentUserController
);

// update current user
userRouter.put(
  '/me',
  authenticationValidation,
  validationMiddleware,
  authenticationMiddleware,
  updateCurrentUserController
);

// delete current user
userRouter.delete(
  '/me',
  authenticationValidation,
  validationMiddleware,
  authenticationMiddleware,
  deleteCurrentUserController
);

export default userRouter;
