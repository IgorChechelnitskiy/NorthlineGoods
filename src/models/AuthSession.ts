import { Schema, Types, model } from 'mongoose';

export type AuthSessionDocument = {
  user: Types.ObjectId;
  tokenHash: string;
  expiresAt: Date;
};

const authSessionSchema = new Schema<AuthSessionDocument>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    tokenHash: {
      type: String,
      required: true,
      unique: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      expires: 0,
    },
  },
  {
    timestamps: true,
  },
);

export const AuthSessionModel = model<AuthSessionDocument>(
  'AuthSession',
  authSessionSchema,
);
