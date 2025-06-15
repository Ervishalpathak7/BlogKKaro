import config from '@/configs';
import { generateAccessToken, generateRefreshToken } from '@/lib/jwt';
import logger from '@/lib/winston';
import User, { IUser } from '@/models/user';
import { Request, Response } from 'express';
import RefreshToken from '@/models/refresh-token';
import bcrypt from 'bcrypt';

type LoginData = Pick<IUser, 'email' | 'password'>;

const loginController = async (req: Request, res: Response): Promise<void> => {
  try {
    // Extract user details from request
    const { email, password } = req.body as LoginData;

    // extract user from database
    const user = await User.findOne({ email });

    if (!user) {
      res.status(404).json({
        status: 'error',
        message: 'user not found',
        data: {},
      });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({
        status: 'error',
        message: 'Invalid email or password',
        data: {},
      });
      return;
    }

    // generate access token and refresh token
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

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

    res.status(200).json({
      status: 'ok',
      message: 'user logged in successfully',
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

    logger.info('user logged in', { email: user.email });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      data: {},
    });
    logger.error('Error during user login ', error);
  }
};

export default loginController;
