import jwt from 'jsonwebtoken';
import config from '@/configs';

export const generateAccessToken = (userId: string): string => {
  return jwt.sign({ userId }, config.JWT_ACCESS_TOKEN_SECRET, {
    expiresIn: config.JWT_ACCESS_TOKEN_EXPIRATION,
    subject: 'accessToken',
  });
};

export const generateRefreshToken = (userId: string): string => {
  return jwt.sign({ userId }, config.JWT_REFRESH_TOKEN_SECRET, {
    expiresIn: config.JWT_REFRESH_TOKEN_EXPIRATION,
    subject: 'refreshToken',
  });
};

export const verifyAccessToken = (token: string) => {
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
): { userId: string } | null => {
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
