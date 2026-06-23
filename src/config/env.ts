import dotenv from 'dotenv';

dotenv.config();

export const env = {
  port: Number(process.env.PORT ?? 3000),
  mongodbUri: process.env.MONGODB_URI,
};

export function requireStringEnv(name: 'mongodbUri') {
  const value = env[name];

  if (!value) {
    throw new Error('Missing required environment variable: MONGODB_URI');
  }

  return value;
}
