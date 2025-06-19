import { MongoClient } from 'mongodb';

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

export const getClientPromise = () => {
  if (!process.env.MONGODB_URI) {
    throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
  }

  const uri = process.env.MONGODB_URI;
  const options = {};

  // ✅ In dev, reuse the global connection
  if (process.env.NODE_ENV === 'development') {
    if (!(global as any)._mongoClientPromise) {
      client = new MongoClient(uri, options);
      (global as any)._mongoClientPromise = client.connect();
    }
    clientPromise = (global as any)._mongoClientPromise;
  }

  // ✅ In production or test: always new instance
  else {
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
  }

  return clientPromise;
};
