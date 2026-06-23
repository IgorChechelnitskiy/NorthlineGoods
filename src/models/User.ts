import { Schema, model } from 'mongoose';

export type UserRole = 'guest' | 'user' | 'admin';

export type UserDocument = {
  name: string;
  email: string;
  avatar: string;
  passwordHash: string;
  role: UserRole;
};

const userSchema = new Schema<UserDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    avatar: { type: String, default: '', trim: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ['guest', 'user', 'admin'],
      required: true,
      default: 'user',
    },
  },
  {
    timestamps: true,
  },
);

export const UserModel = model<UserDocument>('User', userSchema);
