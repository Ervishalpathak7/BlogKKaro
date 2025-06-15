import jwt from 'jsonwebtoken';
import config from '@/configs';
import { Types } from 'mongoose';

export const generateAccessToken = (userId: Types.ObjectId): string => {
  return jwt.sign({ userId }, config.JWT_ACCESS_TOKEN_SECRET, {
    expiresIn: config.JWT_ACCESS_TOKEN_EXPIRATION,
    subject: 'accessToken',
  });
};

export const generateRefreshToken = (userId: Types.ObjectId): string => {
  return jwt.sign({ userId }, config.JWT_REFRESH_TOKEN_SECRET, {
    expiresIn: config.JWT_REFRESH_TOKEN_EXPIRATION,
    subject: 'refreshToken',
  });
};

export const verifyAccessToken = (
  token: string
): { userId: Types.ObjectId } | null => {
  try {
    const decoded = jwt.verify(
      token,
      config.JWT_ACCESS_TOKEN_SECRET
    ) as jwt.JwtPayload;
    return { userId: decoded.userId };
  } catch (err) {
    return null;
  }
};

export const verifyRefreshToken = (
  token: string
): { userId: Types.ObjectId } | null => {
  try {
    const decoded = jwt.verify(
      token,
      config.JWT_REFRESH_TOKEN_SECRET
    ) as jwt.JwtPayload;
    return { userId: decoded.userId };
  } catch (err) {
    return null;
  }
};
