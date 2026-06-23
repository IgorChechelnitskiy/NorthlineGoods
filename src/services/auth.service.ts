import crypto from 'crypto';
import { Types } from 'mongoose';
import { HttpError } from '../errors/httpError';
import { AuthSessionModel } from '../models/AuthSession';
import { UserDocument, UserModel, UserRole } from '../models/User';

const sessionDays = 7;
const passwordKeyLength = 64;

type SeedUser = {
  name: string;
  email: string;
  password: string;
  role: UserRole;
};

const seedUsers: SeedUser[] = [
  {
    name: 'Guest',
    email: 'guest@example.com',
    password: 'guest123',
    role: 'guest',
  },
  {
    name: 'User',
    email: 'user@example.com',
    password: 'user123',
    role: 'user',
  },
  {
    name: 'Admin',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin',
  },
];

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
};

export type UpdateProfileInput = {
  name?: string;
  email?: string;
  avatar?: string;
  password?: string;
};

export async function login(email: string, password: string) {
  const user = await UserModel.findOne({ email: email.toLowerCase() });

  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    throw new HttpError(401, 'Invalid email or password');
  }

  const token = crypto.randomBytes(32).toString('hex');
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + sessionDays * 24 * 60 * 60 * 1000);

  await AuthSessionModel.create({
    user: user._id,
    tokenHash,
    expiresAt,
  });

  return {
    token,
    user: serializeUser(user),
  };
}

export async function logout(token: string) {
  await AuthSessionModel.deleteOne({ tokenHash: hashToken(token) });
}

export async function getUserByToken(token: string) {
  const session = await AuthSessionModel.findOne({
    tokenHash: hashToken(token),
    expiresAt: { $gt: new Date() },
  }).populate<{ user: UserDocument & { _id: Types.ObjectId } }>('user');

  if (!session?.user) {
    return null;
  }

  return serializeUser(session.user);
}

export async function seedAuthUsersIfMissing() {
  await Promise.all(
    seedUsers.map(async (seedUser) => {
      const existingUser = await UserModel.exists({ email: seedUser.email });

      if (existingUser) {
        return;
      }

      await UserModel.create({
        name: seedUser.name,
        email: seedUser.email,
        passwordHash: await hashPassword(seedUser.password),
        role: seedUser.role,
      });
    }),
  );
}

export async function updateProfile(userId: string, input: UpdateProfileInput) {
  const updates: Partial<UserDocument> = {};

  if (typeof input.name === 'string') {
    updates.name = input.name.trim();
  }

  if (typeof input.email === 'string') {
    updates.email = input.email.trim().toLowerCase();
  }

  if (typeof input.avatar === 'string') {
    updates.avatar = input.avatar.trim();
  }

  if (typeof input.password === 'string' && input.password.length > 0) {
    if (input.password.length < 6) {
      throw new HttpError(400, 'Password must be at least 6 characters');
    }

    updates.passwordHash = await hashPassword(input.password);
  }

  const user = await UserModel.findByIdAndUpdate(userId, updates, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    return null;
  }

  return serializeUser(user);
}

export function serializeUser(user: UserDocument & { _id: Types.ObjectId }) {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    role: user.role,
  };
}

async function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = await scrypt(password, salt);

  return `${salt}:${hash}`;
}

async function verifyPassword(password: string, storedHash: string) {
  const [salt, hash] = storedHash.split(':');

  if (!salt || !hash) {
    return false;
  }

  const candidateHash = await scrypt(password, salt);
  const hashBuffer = Buffer.from(hash, 'hex');
  const candidateBuffer = Buffer.from(candidateHash, 'hex');

  return (
    hashBuffer.length === candidateBuffer.length &&
    crypto.timingSafeEqual(hashBuffer, candidateBuffer)
  );
}

function scrypt(password: string, salt: string) {
  return new Promise<string>((resolve, reject) => {
    crypto.scrypt(password, salt, passwordKeyLength, (error, derivedKey) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(derivedKey.toString('hex'));
    });
  });
}

function hashToken(token: string) {
  return crypto.createHash('sha256').update(token).digest('hex');
}
