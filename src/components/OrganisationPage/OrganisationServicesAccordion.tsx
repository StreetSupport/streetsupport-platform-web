'use client';
import React from 'react';
import Accordion from '@/components/ui/Accordion';
import ServiceCard from '@/components/FindHelp/ServiceCard';
import type { OrganisationDetails } from '@/utils/organisation';

interface Props {
  organisation: OrganisationDetails;
}

export default function OrganisationServicesAccordion({ organisation }: Props) {
  const { groupedServices } = organisation;
  const categories = Object.keys(groupedServices);

  if (categories.length === 0) return null;

  return (
    <section className="mb-6">
      <h2 className="text-xl font-semibold mb-4">Services</h2>
      {categories.map((cat) => (
        <Accordion key={cat} title={cat} className="mb-4">
          <ul className="list-none p-0 m-0">
            {groupedServices[cat].map((service) => (
              <li key={service.id} className="mb-4">
                <ServiceCard service={service} />
              </li>
            ))}
          </ul>
        </Accordion>
      ))}
    </section>
  );
}
