import logger from '@/lib/winston';
import User from '@/models/user';
import { Request, Response } from 'express';

const getCurrentUserController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.userId;
    const existingUser = await User.findById(userId)
      .select('-password -__v  -createdAt -updatedAt')
      .lean()
      .exec();
    if (!existingUser) {
      res.status(404).json({
        status: 'error',
        message: 'User not found',
      });
      return;
    }
    res
      .setHeader('Content-Type', 'application/json')
      .status(200)
      .json({
        status: 'ok',
        message: 'User fetched succesfully',
        data: {
          user: existingUser,
        },
      });

    logger.info('User fetched succesfully', {
      userId: existingUser._id,
    });
    return;
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      data: {},
    });
    logger.error('Error during user fetching ', error);
  }
};

export default getCurrentUserController;
