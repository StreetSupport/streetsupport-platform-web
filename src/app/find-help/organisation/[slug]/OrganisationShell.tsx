'use client';

import { useParams } from 'next/navigation';
import { notFound } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getOrganisationBySlug } from '@/utils/organisation';
import type { OrganisationDetails } from '@/utils/organisation';


import OrganisationOverview from '@/components/OrganisationPage/OrganisationOverview';
import OrganisationLocations from '@/components/OrganisationPage/OrganisationLocations';
import OrganisationServicesAccordion from '@/components/OrganisationPage/OrganisationServicesAccordion';
import OrganisationContactBlock from '@/components/OrganisationPage/OrganisationContactBlock';
import OrganisationFooter from '@/components/OrganisationPage/OrganisationFooter';

export default function OrganisationShell() {
  const { slug } = useParams();
  const [organisation, setOrganisation] = useState<OrganisationDetails | null>(null);

  useEffect(() => {
    async function loadData() {
      if (!slug || typeof slug !== 'string') return;
      const data = await getOrganisationBySlug(slug);
      if (!data) return notFound();
      setOrganisation(data);
    }

    loadData();
  }, [slug]);

  if (!organisation) return <p>Loading...</p>;

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
