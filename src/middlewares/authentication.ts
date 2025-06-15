import { verifyAccessToken } from '@/lib/jwt';
import logger from '@/lib/winston';
import type { NextFunction, Request, Response } from 'express';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

const authenticationMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const accessToken = authHeader!.split(' ')[1];

    const payload = verifyAccessToken(accessToken);
    if (!payload) {
      res.status(401).json({
        status: 'error',
        message: 'Invalid or Expired access token , Please login again',
        data: {},
      });
      return;
    }

    req.userId = payload.userId;
    return next();
    
  } catch (error) {
    // Log the error
    logger.error(`Access token error `, error);
    // handle expired token error
    if (error instanceof TokenExpiredError) {
      res.status(401).json({
        status: 'error',
        message:
          'Unauthorized: Token expired , request a new token with refresh token',
      });
      return;
    }
    // handle invalid token error
    if (error instanceof JsonWebTokenError) {
      res.status(401).json({
        status: 'error',
        message: 'Unauthorized: Invalid token',
      });
      return;
    }
    // handle all other errors
    res.status(500).json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Internal Server Error',
    });
    return;
  }
};

export default authenticationMiddleware;
