import React from 'react';
import { render, screen } from '@testing-library/react';
import Nav from '@/components/Nav/Nav';

describe('Nav', () => {
  it('renders a nav element', () => {
    render(<Nav />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('renders a list of links if locations are fetched', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve([
            { id: 1, name: 'Lincoln', slug: 'lincoln' },
            { id: 2, name: 'Manchester', slug: 'manchester' },
          ]),
      })
    ) as jest.Mock;

    render(<Nav />);
    expect(await screen.findByText('Lincoln')).toBeInTheDocument();
    expect(await screen.findByText('Manchester')).toBeInTheDocument();
  });
});
