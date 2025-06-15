import { render, screen } from '@testing-library/react';
import OrganisationServicesAccordion from '@/components/OrganisationPage/OrganisationServicesAccordion';

jest.mock('@/components/ui/Accordion', () => ({ title, children, className }: any) => (
  <div data-testid="accordion" data-title={title} className={className}>{children}</div>
));

jest.mock('@/components/FindHelp/ServiceCard', () => ({ service }: any) => (
  <div data-testid="service-card">{service.name}</div>
));

describe('OrganisationServicesAccordion', () => {
  it('returns null when no services', () => {
    const { container } = render(
      <OrganisationServicesAccordion organisation={{ groupedServices: {} } as any} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders grouped services inside accordions', () => {
    const org: any = {
      groupedServices: {
        training: [{ id: 'a', name: 'Train' }],
        employment: [{ id: 'b', name: 'Job1' }, { id: 'c', name: 'Job2' }],
      },
    };
    render(<OrganisationServicesAccordion organisation={org} />);
    expect(screen.getByText('Services')).toBeInTheDocument();
    const accs = screen.getAllByTestId('accordion');
    expect(accs).toHaveLength(2);
    expect(accs[0]).toHaveAttribute('data-title', 'training');
    expect(screen.getAllByTestId('service-card')).toHaveLength(3);
  });
});
