import { Request, Response } from 'express';
import RefreshToken from '@/models/refresh-token';
import logger from '@/lib/winston';
import config from '@/configs';

const logoutController = async (req: Request, res: Response): Promise<void> => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      res.status(400).json({
        status: 'error',
        message: 'No refresh token provided',
      });
      return;
    }

    const deleteResult = await RefreshToken.deleteOne({ token });

    logger.info(`Refresh token deleted`, {
      userId: req.userId,
      refreshToken: token,
      deletedCount: deleteResult.deletedCount,
    });

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: config.ENV === 'production',
      sameSite: 'strict',
    });

    res.status(200).json({
      status: 'ok',
      message: 'User logged out successfully',
    });

    logger.info(`User logged out successfully`, {
      userId: req.userId,
    });
  } catch (error) {
    logger.error(`Error during logout`, error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
};

export default logoutController;
