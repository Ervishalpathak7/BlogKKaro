import { model, Schema } from 'mongoose';
import bcrypt from 'bcrypt';

// user interface
export interface IUser {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
  password: string;
  links: {
    website: string;
    linkedin: string;
    x: string;
  };
}

const userSchema = new Schema<IUser>(
  {
    firstName: {
      type: String,
      trim: true,
      minlength: [2, 'First name must be at least 2 character long'],
      maxlength: [20, 'First name must be at most 20 characters long'],
      lowercase: true,
      required: true,
    },
    lastName: {
      type: String,
      trim: true,
      minlength: [2, 'Last name must be at least 2 character long'],
      maxlength: [20, 'Last name must be at most 20 characters long'],
      lowercase: true,
      required: true,
    },
    username: {
      type: String,
      trim: true,
      minlength: [2, 'Username name must be at least 2 character long'],
      maxlength: [20, 'Username name must be at most 20 characters long'],
      lowercase: true,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
      required: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email address'],
    },
    password: {
      type: String,
      minlength: [6, 'Password must be at least 6 characters long'],
      maxlength: [128, 'Password must be at most 128 characters long'],
      trim: true,
      required: true,
    },
    links: {
      website: {
        type: String,
        trim: true,
        maxlength: [100, 'Website URL must be at most 100 characters long'],
        default: '',
        match: [
          /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/\S*)?$/,
          'Enter valid website',
        ],
      },
      linkedin: {
        type: String,
        trim: true,
        maxlength: [100, 'Linkedin URL must be at most 100 characters long'],
        default: '',
        match: [
          /^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+\/?$/,
          'Enter valid website',
        ],
      },
      x: {
        type: String,
        trim: true,
        maxlength: [100, 'X URL must be at most 100 characters long'],
        default: '',
        match: [
          /^https?:\/\/(www\.)?(x|twitter)\.com\/[A-Za-z0-9_]{1,15}$/,
          'Enter valid website',
        ],
      },
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function (next) {
  // Hash the password before saving the user document
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

export default model<IUser>('User', userSchema);
