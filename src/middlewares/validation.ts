import { validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

const validationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      status: 'error',
      message: errors.array()[0].msg,
      errors: errors.mapped(),
    });
    return;
  }
  next();
};

export default validationMiddleware;
