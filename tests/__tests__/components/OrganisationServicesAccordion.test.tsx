import { render, screen } from '@testing-library/react';
import OrganisationServicesAccordion from '@/components/OrganisationPage/OrganisationServicesAccordion';

jest.mock('@/components/ui/Accordion', () => ({ title, children, className }: any) => (
  <div data-testid="accordion" data-title={title} className={className}>
    {children}
  </div>
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
        training: {
          skills: [
            {
              id: 'a',
              name: 'Train',
              Address: {
                Street: '123 High St',
                Location: { coordinates: [-2, 53] },
              },
              description: 'Training description',
              openTimes: [],
            },
          ],
        },
        employment: {
          jobs: [
            {
              id: 'b',
              name: 'Job1',
              Address: {
                Street: '456 Job St',
                Location: { coordinates: [-2.1, 53.1] },
              },
              description: 'Job1 description',
              openTimes: [],
            },
            {
              id: 'c',
              name: 'Job2',
              Address: {
                Street: '789 Work Rd',
                Location: { coordinates: [-2.2, 53.2] },
              },
              description: 'Job2 description',
              openTimes: [],
            },
          ],
        },
      },
    };

    render(<OrganisationServicesAccordion organisation={org} />);
    expect(screen.getByText('Services')).toBeInTheDocument();
    const accs = screen.getAllByTestId('accordion');
    expect(accs).toHaveLength(2);
    expect(accs[0]).toHaveAttribute('data-title', 'skills');
  });
});
