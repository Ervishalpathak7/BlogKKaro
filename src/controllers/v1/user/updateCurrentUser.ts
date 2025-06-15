import logger from '@/lib/winston';
import User, { IUser } from '@/models/user';
import { Request, Response } from 'express';

type UpdateData = Pick<IUser, 'firstName' | 'lastName' | 'links'>;

const updateCurrentUserController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { firstName, lastName, links } = req.body as UpdateData;

    const user = await User.findById(req.userId).select('-__v');

    if (!user) {
      res.status(404).json({
        status: 'error',
        message: 'User not found',
        data: {},
      });
      return;
    }

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (links?.x) user.links.x = links.x;
    if (links?.website) user.links.website = links.website;
    if (links?.linkedin) user.links.linkedin = links.linkedin;

    const updatedUser = await user.save();

    res.status(200).json({
      status: 'ok',
      message: 'User updated successfully',
      data: {
        user: {
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          links: updatedUser.links,
        },
      },
    });

    logger.info('User updated successfully', { userId: req.userId });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      data: {},
    });
    logger.error('Error during user update', error);
  }
};

export default updateCurrentUserController;
