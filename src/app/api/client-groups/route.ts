// src/app/api/client-groups/route.ts
// We use it in code, but in reality we should omit it. So keep it for now. But I don't handle it in streetsupport-platform-admin
import { NextResponse } from 'next/server';
import { getClientGroups } from './helper';

export async function GET() {
  try {
    const groups = await getClientGroups();
    return NextResponse.json({ status: 'success', data: groups });
  } catch (error) {
    console.error('Error fetching client groups:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to fetch client groups' },
      { status: 500 }
    );
  }
}
