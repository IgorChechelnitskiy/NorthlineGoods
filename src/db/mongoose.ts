import mongoose from 'mongoose';
import { requireStringEnv } from '../config/env';

export async function connectToDatabase() {
  const mongodbUri = requireStringEnv('mongodbUri');

  mongoose.connection.on('connected', () => {
    console.log('MongoDB connected');
  });

  mongoose.connection.on('error', (error) => {
    console.error('MongoDB connection error:', error);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB disconnected');
  });

  await mongoose.connect(mongodbUri, {
    serverSelectionTimeoutMS: 5000,
  });
}

export function getDatabaseStatus() {
  return {
    readyState: mongoose.connection.readyState,
    connected: mongoose.connection.readyState === 1,
    name: mongoose.connection.name || null,
    host: mongoose.connection.host || null,
  };
}
