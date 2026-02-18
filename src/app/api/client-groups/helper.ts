// src/app/api/client-groups/helper.ts
// We use it in code, but in reality we should omit it. So keep it for now. But I don't handle it in streetsupport-platform-admin
import { getClientPromise } from '@/utils/mongodb';
import { DB_NAME } from '@/config/constants';

export async function getClientGroups() {
  const client = await getClientPromise();
  const db = client.db(DB_NAME);

  const groups = await db
    .collection('ClientGroups')
    .find({})
    .project({ _id: 1, Key: 1, Name: 1 })
    .toArray();

  return groups.map(g => ({
    _id: g._id,
    key: g.Key,
    name: g.Name,
  }));
}
