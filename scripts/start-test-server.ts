import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { spawn } from 'child_process';

(async () => {
  // 1️⃣ Start Mongo Memory Server
  const mongoServer = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mongoServer.getUri();

  // 2️⃣ Seed some data
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;

  await db.collection('ServiceProviders').insertOne({
    Key: 'test-provider',
    Name: 'Test Provider',
    IsVerified: true,
    IsPublished: true,
  });

  await db.collection('ProvidedServices').insertOne({
    Name: 'Test Service',
    ParentCategoryKey: 'food',
    ServiceProviderKey: 'test-provider',
    IsPublished: true,
  });

  // 3️⃣ Start Next.js dev server
  console.log('[E2E TEST SERVER] Starting Next.js dev server...');
  const devServer = spawn('npm', ['run', 'dev'], {
    stdio: 'inherit',
    env: {
      ...process.env,
      MONGODB_URI: process.env.MONGODB_URI, // pass the dynamic URI
    },
  });

  // Exit handling: if you stop this script, kill the dev server too
  process.on('SIGINT', () => {
    devServer.kill();
    process.exit(0);
  });
})();
