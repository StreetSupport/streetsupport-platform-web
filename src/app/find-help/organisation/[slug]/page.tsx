import { getOrganisationBySlug } from '@/utils/organisation';
import OrganisationOverview from '@/components/OrganisationPage/OrganisationOverview';
import OrganisationLocations from '@/components/OrganisationPage/OrganisationLocations';
import OrganisationServicesAccordion from '@/components/OrganisationPage/OrganisationServicesAccordion';
import OrganisationContactBlock from '@/components/OrganisationPage/OrganisationContactBlock';
import OrganisationFooter from '@/components/OrganisationPage/OrganisationFooter';
import { notFound } from 'next/navigation';

interface Props {
  params: { slug: string };
}

export default function OrganisationPage({ params }: Props) {
  const organisation = getOrganisationBySlug(params.slug);

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
