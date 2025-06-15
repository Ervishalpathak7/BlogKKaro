import { generateAccessToken, verifyRefreshToken } from '@/lib/jwt';
import logger from '@/lib/winston';
import RefreshToken from '@/models/refresh-token';
import { Request, Response } from 'express';

const refreshTokenController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const token = req.cookies.refreshToken;
    const existingToken = await RefreshToken.exists({ token });

    if (!existingToken) {
      res.status(404).json({
        status: 'error',
        message: 'Invalid or expired token. Please log in again.',
        data: {},
      });
      return;
    }

    const payload = verifyRefreshToken(token);
    if (!payload) {
      res.status(401).json({
        status: 'error',
        message: 'Invalid or expired token. Please log in again.',
        data: {},
      });
      return;
    }

    const accessToken = generateAccessToken(payload.userId);
    res.status(200).json({
      status: 'ok',
      message: 'User authorized successfully',
      data: { accessToken },
    });

    logger.info('Access token refreshed', { userId: payload.userId });
    
  } catch (error) {
    logger.error('error during refreshing token ', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
};

export default refreshTokenController;
