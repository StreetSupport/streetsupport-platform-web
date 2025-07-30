import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Nav from '@/components/partials/Nav';

jest.mock('@/data/locations.json', () => [
  { id: '1', name: 'Birmingham', slug: 'birmingham', isPublic: true },
  { id: '2', name: 'Manchester', slug: 'manchester', isPublic: true },
]);

describe('Nav', () => {
  it('renders main navigation links', () => {
    render(<Nav />);
    expect(screen.getByAltText('Street Support Network')).toBeInTheDocument();
    expect(screen.getAllByText('Find Help').length).toBeGreaterThan(0);
    expect(screen.getAllByText('About').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Resources').length).toBeGreaterThan(0);
  });

  it('shows desktop Locations dropdown on hover', async () => {
    render(<Nav />);
    const buttons = screen.getAllByText('Locations');
    const desktopButton = buttons[0]; // First one should be the desktop version
    fireEvent.mouseEnter(desktopButton);
    expect(await screen.findByText('Birmingham')).toBeVisible();
    expect(screen.getByText('Manchester')).toBeVisible();
  });

  it('toggles mobile menu and shows location toggle button', async () => {
    render(<Nav />);
    const toggle = screen.getByLabelText('Toggle menu');
    await userEvent.click(toggle);
    const buttons = screen.getAllByRole('button', { name: 'Locations' });
    await userEvent.click(buttons[1]);
  });

  it('shows mobile Locations list when clicked', async () => {
    render(<Nav />);
    await userEvent.click(screen.getByLabelText('Toggle menu'));
    const buttons = screen.getAllByRole('button', { name: 'Locations' });
    expect(buttons[1]).toBeInTheDocument();
    await userEvent.click(buttons[1]);
    expect(await screen.findByText('Birmingham')).toBeVisible();
    expect(await screen.findByText('Manchester')).toBeVisible();
  });
});
