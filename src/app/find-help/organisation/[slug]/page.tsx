import { getOrganisationBySlug } from '@/utils/organisation';
import OrganisationOverview from '@/components/OrganisationPage/OrganisationOverview';
import OrganisationLocations from '@/components/OrganisationPage/OrganisationLocations';
import OrganisationServicesAccordion from '@/components/OrganisationPage/OrganisationServicesAccordion';
import OrganisationContactBlock from '@/components/OrganisationPage/OrganisationContactBlock';
import OrganisationFooter from '@/components/OrganisationPage/OrganisationFooter';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const organisation = await getOrganisationBySlug(params.slug);
  return { title: organisation ? organisation.name : 'Organisation' };
}

export default async function OrganisationPage({
  params,
}: {
  params: { slug: string };
}) {

  const organisation = await getOrganisationBySlug(params.slug);

  if (!organisation) return notFound();

  return (
    <main className="px-4 py-6 max-w-4xl mx-auto">
      <OrganisationOverview organisation={organisation} />
      <OrganisationLocations organisation={organisation} />
      <OrganisationServicesAccordion organisation={organisation} />
      <OrganisationContactBlock organisation={organisation} />
      <OrganisationFooter />
    </main>
  );
}
