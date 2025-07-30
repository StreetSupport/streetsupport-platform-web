
# ✅ Feature: Confirm and Test MongoDB Connection

This document records all essential information for the **`feature/confirm-and-test-mongo-db`** ticket in the Public Read API project.  
It ensures that anyone revisiting this knows exactly **how to connect, test, and validate** the MongoDB read-only connection for the Street Support Network cluster.

---

## 📌 **Purpose**

- Verify that the application can securely connect to the Street Support Network MongoDB cluster.
- Use a dedicated **read-only** API user for public data endpoints.
- Confirm the connection works through:
  - `mongosh` shell
  - MongoDB Compass
  - A Next.js serverless API route (`/api/test-mongo`)

---

## 📌 **Cluster Details**

| Item | Value |
|------|-------|
| **Cluster Host** | `streetsupport.ijlpk.azure.mongodb.net` |
| **Primary Database** | `streetsupport` |
| **API User** | `rebuildapireader` |
| **Role** | `readAnyDatabase@admin` |
| **Connection Method** | SRV connection string (`mongodb+srv://`) |

---

## 📌 **Environment Variable**

Add this to `.env.local` (do not commit the actual password to the repository):

```env
MONGODB_URI="mongodb+srv://rebuildapireader:<PASSWORD>@streetsupport.ijlpk.azure.mongodb.net/?retryWrites=true&w=majority"
```

**Key points:**
- ✅ Replace `<PASSWORD>` with the current verified password, stored securely.
- ✅ Do **not** include a trailing database name in the URI because the user authenticates via `admin` with `readAnyDatabase`.
- ✅ This user has no write permission.

---

## 📌 **Testing Commands**

### ✅ **1. Test with mongosh**

```bash
mongosh "mongodb+srv://rebuildapireader:<PASSWORD>@streetsupport.ijlpk.azure.mongodb.net/?retryWrites=true&w=majority"
```

- On success, you can run:
  ```bash
  use streetsupport
  db.Cities.findOne()
  ```

---

### ✅ **2. Test with Compass**

- Use the same SRV URI in MongoDB Compass → should connect and list databases & collections.

---

### ✅ **3. Test with Next.js API Route**

- Example route: `/api/test-mongo`

```ts
import { NextResponse } from 'next/server';
import clientPromise from '@/utils/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('streetsupport'); // Explicit DB
    const result = await db.collection('Cities').find({}).limit(5).toArray();

    return NextResponse.json({ status: 'success', data: result });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ status: 'error', message: error instanceof Error ? error.message : 'Unknown error' });
  }
}
```

- ✅ This verifies that the connection string, helper, and serverless environment work end-to-end.

---

## 📌 **Helper Pattern**

Connection helper used in `src/utils/mongodb.ts`:

```ts
import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  if (!(global as any)._mongoClientPromise) {
    client = new MongoClient(uri, options);
    (global as any)._mongoClientPromise = client.connect();
  }
  clientPromise = (global as any)._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
```

- ✅ Uses a singleton to avoid creating multiple connections during hot reload in development.

---

## ✅ **Status**

| Item | Status |
|------|--------|
| ✅ Connection to cluster | Confirmed |
| ✅ Password verified via `mongosh` and Compass | Confirmed |
| ✅ Read-only role scoped to admin | Confirmed |
| ✅ Explicit DB selection in code | Confirmed |
| ✅ Serverless API tested with real data | Confirmed |

---

## 📌 **Next Steps**

- **Store this file in `api-docs/` folder as permanent reference.**
- Use this setup as the base for all other Read API routes.
- Keep this user read-only to protect production data.

_Last updated: 2025-06-16_
