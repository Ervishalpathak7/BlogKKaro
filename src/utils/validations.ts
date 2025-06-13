import { body, cookie } from 'express-validator';
import User from '@/models/user';
import logger from '@/lib/winston';

export const registerValidations = [
  body('firstName')
    .trim()
    .notEmpty()
    .withMessage('First name is required')
    .isLength({ min: 2, max: 20 })
    .withMessage('First name must be between 2 and 20 characters'),
  body('lastName')
    .trim()
    .notEmpty()
    .withMessage('Last name is required')
    .isLength({ min: 2, max: 20 })
    .withMessage('Last name must be between 2 and 20 characters'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isLength({ max: 100 })
    .withMessage('Email must be less than 100 characters')
    .normalizeEmail()
    .isEmail()
    .withMessage('Enter Valid Email')
    .custom(async (value) => {
        const exists = await User.exists({ email: value });
        if (exists) throw new Error('Email already registered');
      return true;
    }),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8, max: 64 })
    .withMessage('Password must be between 8 and 64 characters'),
  body('role')
    .optional()
    .isString()
    .withMessage('Role must be a string')
    .isIn(['user', 'admin'])
    .withMessage('Role must be either "user" or "admin"'),
];

export const loginValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isLength({ max: 100 })
    .withMessage('Email must be less than 100 characters')
    .normalizeEmail()
    .isEmail()
    .withMessage('Enter Valid Email'),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8, max: 64 })
    .withMessage('Password must be between 8 and 64 characters'),
];


export const refreshTokenValidation = [
    cookie('refreshToken')
    .notEmpty()
    .withMessage('Refresh token required')
    .isJWT()
    .withMessage('Invalid refresh token '),
];

