import mongoose from 'mongoose';
import { config } from '../../config/index.js';

export async function connectMongo(): Promise<void> {
  await mongoose.connect(config.mongodbUri).catch((err) => {
    console.error('Failed to connect to MongoDB:', err);
  }).finally(() => {
    console.log('Connected to MongoDB');
  });
}

export function getConnection(): mongoose.Connection {
  return mongoose.connection;
}
