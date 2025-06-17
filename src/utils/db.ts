import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI!;
if (!uri) throw new Error('❌ MONGODB_URI not set');

const client = new MongoClient(uri);

export const getClient = async () => {
  // If already connected, do nothing — otherwise connect.
  if (!client?.db) {
    await client.connect();
  }
  return client;
};
