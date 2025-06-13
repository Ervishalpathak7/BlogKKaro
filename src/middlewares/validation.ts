import { validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

const validationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors
      .array()
      .reduce<Record<string, string>>((acc, err) => {
        if ('param' in err && 'msg' in err) {
          acc[(err as { param: string }).param] = (err as { msg: string }).msg;
        }
        return acc;
      }, {});

     res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors: formattedErrors,
    });
    return;
  }
  next();
};

export default validationMiddleware;
