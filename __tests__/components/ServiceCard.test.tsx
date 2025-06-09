import { render, screen } from '@testing-library/react';
import ServiceCard from '@/components/FindHelp/ServiceCard';

const mockService = {
  id: 'abc123',
  name: 'Health Help Service',
  category: 'health',
  subCategory: 'dentist',
  description: 'A local service offering dentist under the health category.',
  openTimes: [
    { day: 'Monday', start: '09:00', end: '17:00' },
    { day: 'Wednesday', start: '09:00', end: '17:00' },
  ],
  clientGroups: ['age-18+', 'rough-sleepers'],
  organisation: 'Mayer Inc',
  organisationSlug: 'mayer-inc',
  orgPostcode: 'LN4 2LE',
};

describe('ServiceCard', () => {
  it('renders service name and organisation', () => {
    render(<ServiceCard service={mockService} />);
    expect(screen.getByText(/Health Help Service/i)).toBeInTheDocument();
    expect(screen.getByText(/Mayer Inc/i)).toBeInTheDocument();
  });

  it('displays description and category tags', () => {
    render(<ServiceCard service={mockService} />);
    expect(screen.getByText(/A local service offering dentist/i)).toBeInTheDocument();
    expect(screen.getByText(/Category: health/i)).toBeInTheDocument();
    expect(screen.getByText(/Subcategory: dentist/i)).toBeInTheDocument();
  });

  it('renders client group tags and opening times', () => {
    render(<ServiceCard service={mockService} />);
    expect(screen.getByText('age-18+')).toBeInTheDocument();
    expect(screen.getByText('rough-sleepers')).toBeInTheDocument();
    expect(screen.getByText('Monday: 09:00 – 17:00')).toBeInTheDocument();
    expect(screen.getByText('Wednesday: 09:00 – 17:00')).toBeInTheDocument();
  });

  it('links to the organisation page when slug provided', () => {
    render(<ServiceCard service={mockService} />);
    const link = screen.getByRole('link', { name: /view details for/i });
    expect(link).toHaveAttribute('href', '/find-help/organisation/mayer-inc');
  });
});
