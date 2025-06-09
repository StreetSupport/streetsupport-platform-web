'use client';
import React from 'react';
import type { OrganisationDetails } from '@/utils/organisation';

interface Props {
  organisation: OrganisationDetails;
}

export default function OrganisationContactBlock({ organisation }: Props) {
  return (
    <section className="mb-6">
      <h2 className="text-xl font-semibold mb-2">Contact</h2>
      <p>
        We do not currently have public contact details for {organisation.name}.
      </p>
    </section>
  );
}
