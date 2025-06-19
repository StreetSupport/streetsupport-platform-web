'use client';

import OrganisationOverview from '@/components/OrganisationPage/OrganisationOverview';
import OrganisationLocations from '@/components/OrganisationPage/OrganisationLocations';
import OrganisationServicesAccordion from '@/components/OrganisationPage/OrganisationServicesAccordion';
import OrganisationContactBlock from '@/components/OrganisationPage/OrganisationContactBlock';
import OrganisationFooter from '@/components/OrganisationPage/OrganisationFooter';

import type { OrganisationDetails } from '@/utils/organisation';

interface Props {
  organisation: OrganisationDetails;
}

export default function OrganisationShell({ organisation }: Props) {
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