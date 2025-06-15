import logger from '@/lib/winston';
import User from '@/models/user';
import { Request, Response } from 'express';

const deleteCurrentUserController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId;

    const deleteResult = await User.deleteOne({ _id: userId });

    if (deleteResult.deletedCount === 0) {
      res.status(404).json({
        status: 'error',
        message: 'User not found',
      });
      return;
    }

    res.status(202).json({
      status: 'ok',
      message: 'User deleted successfully',
      data: {},
    });

    logger.info('User deleted successfully', {
      userId,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      data: {},
    });
    logger.error('Error during user deletion', error);
  }
};

export default deleteCurrentUserController;
