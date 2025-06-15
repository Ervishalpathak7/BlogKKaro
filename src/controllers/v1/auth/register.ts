import { Request, Response } from 'express';
import User, { IUser } from '@/models/user';
import RefreshToken from '@/models/refresh-token';
import config from '@/configs';
import logger from '@/lib/winston';
import { generateUsername } from '@/utils';
import { generateAccessToken, generateRefreshToken } from '@/lib/jwt';

type RegisterData= Pick<
  IUser,
  'firstName' | 'lastName' | 'email' | 'password' | 'role'
>;

const registerController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Extract user details from request
    const { firstName, lastName, email, password, role } = req.body as RegisterData;

    console.log(role);

    if (role === 'admin' && !config.WHITELIST_EMAILS.includes(email)) {
      logger.warn(`Unauthorized admin registration attempt`, {
        email,
      });
      res.status(403).json({
        status: 'error',
        message: 'Unauthorized to register as admin',
        timestamp: new Date().toISOString(),
      });
      return;
    }

    // generate a random username
    const username = generateUsername();

    // create new user
    const user = await User.create({
      firstName,
      lastName,
      username,
      email,
      password,
      role,
    });

    // generate access token and refresh token
    const accessToken = generateAccessToken(user._id.toString());
    const refreshToken = generateRefreshToken(user._id.toString());

    // Save refresh token
    await RefreshToken.create({
      token: refreshToken,
      userId: user._id,
    });

    logger.info('new refresh token saved', { refreshToken });

    res.cookie('refreshToken', refreshToken, {
      sameSite: true,
      httpOnly: true,
      secure: config.ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    res.status(201).json({
      status: 'ok',
      message: 'user registered successfully',
      data: {
        user: {
          id: user._id,
          email: user.email,
          username: user.username,
          role: user.role,
        },
        accessToken,
      },
      timeStamp: new Date().toLocaleDateString(),
    });
    logger.info('new user registered successfully', user.email);
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      data: {},
    });
    logger.error('Error during user registration ', error);
  }
};

export default registerController;
