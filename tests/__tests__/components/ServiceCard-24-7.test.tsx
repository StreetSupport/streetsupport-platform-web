import React from 'react';
import { render, screen } from '@testing-library/react';
import ServiceCard from '@/components/FindHelp/ServiceCard';
import { mock24_7Service } from '../../__mocks__/api-responses';

describe('ServiceCard 24/7 functionality', () => {
  it('should hide opening times and show 24/7 pill for services with isOpen247 flag', () => {
    const service247 = {
      ...mock24_7Service,
      isOpen247: true
    };

    render(
      <ServiceCard
        service={service247}
        destination="/find-help/organisation/test-org"
        isOpen={false}
        onToggle={jest.fn()}
      />
    );

    expect(screen.getByText('24/7 Crisis Support')).toBeInTheDocument();
    expect(screen.queryByText('Opening Times:')).not.toBeInTheDocument();
    expect(screen.queryByText('No opening times available')).not.toBeInTheDocument();
    expect(screen.getByText('Open 24/7')).toBeInTheDocument();
    expect(screen.queryByText('Open Now')).not.toBeInTheDocument();
  });

  it('should detect 24-hour services from opening times with 00:00-23:59 slots', () => {
    render(
      <ServiceCard
        service={mock24_7Service}
        destination="/find-help/organisation/test-org"
        isOpen={false}
        onToggle={jest.fn()}
      />
    );

    expect(screen.queryByText('Opening Times:')).not.toBeInTheDocument();
    expect(screen.getByText('Open 24/7')).toBeInTheDocument();
    expect(screen.queryByText('Open Now')).not.toBeInTheDocument();
  });

  it('should show opening times for services with regular hours', () => {
    const regularService = {
      ...mock24_7Service,
      isOpen247: false,
      openTimes: [
        { day: 1, start: 900, end: 1700 },
        { day: 2, start: 900, end: 1700 },
      ],
    };

    render(
      <ServiceCard
        service={regularService}
        destination="/find-help/organisation/test-org"
        isOpen={false}
        onToggle={jest.fn()}
      />
    );

    expect(screen.getByText('Opening Times:')).toBeInTheDocument();
    expect(screen.queryByText('Open 24/7')).not.toBeInTheDocument();
  });
});
