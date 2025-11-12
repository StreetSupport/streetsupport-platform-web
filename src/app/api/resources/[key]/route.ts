import { NextResponse } from 'next/server';
import { Resource, LinkList, Link } from '@/types/resources';
import { getClientPromise } from '@/utils/mongodb';

// Disable caching to ensure fresh resource data
export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface ResourceApiParams {
  params: Promise<{ key: string }>;
}

// MongoDB document interfaces (PascalCase naming)
interface MongoLink {
  Title: string;
  Link: string;
  Description?: string;
  Header?: string;
  FileType?: string;
}

interface MongoLinkList {
  Name: string;
  Type: string;
  Priority: number;
  Links: MongoLink[];
}

interface MongoResource {
  _id: { toString(): string };
  Key: string;
  Name: string;
  Header: string;
  ShortDescription: string;
  Body: string;
  LinkList?: MongoLinkList[];
  CreatedBy: string;
  DocumentCreationDate?: Date;
  DocumentModifiedDate?: Date;
}

export async function GET(req: Request, context: ResourceApiParams) {
  try {
    const { key } = await context.params;
    
    if (!key) {
      return NextResponse.json(
        { status: 'error', message: 'Resource key is required' },
        { status: 400 }
      );
    }

    // Fetch resource data from MongoDB
    const client = await getClientPromise();
    const db = client.db('streetsupport');
    const resourcesCol = db.collection('Resources');

    const rawResourceData = await resourcesCol.findOne({
      Key: key
    }) as MongoResource | null;
    
    // If no resource exists
    if (!rawResourceData) {
      return NextResponse.json({
        status: 'error',
        message: 'Resource not found',
        data: { resource: null }
      }, { status: 404 });
    }

    // Transform MongoDB document (PascalCase) to Resource format (camelCase for web)
    const resource: Resource = {
      id: rawResourceData._id.toString(),
      key: rawResourceData.Key,
      name: rawResourceData.Name,
      header: rawResourceData.Header,
      shortDescription: rawResourceData.ShortDescription,
      body: rawResourceData.Body,
      linkList: rawResourceData.LinkList ? rawResourceData.LinkList.map((linkList: MongoLinkList): LinkList => ({
        name: linkList.Name,
        type: linkList.Type as 'link' | 'card-link' | 'file-link',
        priority: linkList.Priority,
        links: linkList.Links.map((link: MongoLink): Link => ({
          title: link.Title,
          link: link.Link,
          description: link.Description,
          header: link.Header,
          fileType: link.FileType
        }))
      })).sort((a: LinkList, b: LinkList) => a.priority - b.priority) : [], // Sort by priority
      createdBy: rawResourceData.CreatedBy,
      createdAt: rawResourceData.DocumentCreationDate ? rawResourceData.DocumentCreationDate.toISOString() : '',
      updatedAt: rawResourceData.DocumentModifiedDate ? rawResourceData.DocumentModifiedDate.toISOString() : ''
    };

    // Return response without caching headers to ensure fresh data
    return NextResponse.json({
      status: 'success',
      data: {
        resource
      }
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  } catch (error) {
    console.error('[API ERROR] /api/resources/[key]:', error);
    
    return NextResponse.json({
      status: 'error',
      message: 'Unable to fetch resource data at this time',
      data: { resource: null }
    }, { status: 500 });
  }
}
