import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import SocialShare from '@/components/ui/SocialShare';
import ResourcePageContent from '@/components/ResourcePageContent';
import { Resource, ResourceApiResponse } from '@/types/resources';

interface ResourcePageProps {
  params: Promise<{ key: string }>;
}

// Fetch resource data
async function getResource(key: string): Promise<Resource | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/resources/${key}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error('Failed to fetch resource');
    }

    const data: ResourceApiResponse = await response.json();
    return data.data?.resource || null;
  } catch (error) {
    console.error('Error fetching resource:', error);
    return null;
  }
}

// Generate metadata
export async function generateMetadata({ params }: ResourcePageProps): Promise<Metadata> {
  const { key } = await params;
  const resource = await getResource(key);

  if (!resource) {
    return {
      title: 'Resource Not Found',
    };
  }

  return {
    title: resource.name,
    description: resource.shortDescription,
  };
}

export default async function ResourcePage({ params }: ResourcePageProps) {
  const { key } = await params;
  const resource = await getResource(key);

  if (!resource) {
    notFound();
  }

  return (
    <>
      <Breadcrumbs 
        items={[
          { href: "/", label: "Home" },
          { href: "/resources", label: "Resources" },
          { label: resource.name, current: true }
        ]} 
      />

      <ResourcePageContent resource={resource} />
      
      <div className="max-w-4xl mx-auto px-6 pb-12">
        <SocialShare />
      </div>
    </>
  );
}
