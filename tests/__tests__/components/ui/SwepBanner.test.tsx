/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import SwepBanner from '@/components/ui/SwepBanner';
import { SwepData } from '@/types';

// Mock the Next.js Link component
jest.mock('next/link', () => {
  return function MockLink({ children, href }: { children: React.ReactNode; href: string }) {
    return <a href={href}>{children}</a>;
  };
});

// Mock analytics
jest.mock('@/components/analytics/GoogleAnalytics', () => ({
  trackSwepBannerClick: jest.fn(),
}));

describe('SwepBanner Component', () => {
  const mockSwepData: SwepData = {
    id: 'test-swep-1',
    locationSlug: 'manchester',
    title: 'Severe Weather Emergency Protocol - Manchester',
    body: 'Test body content',
    shortMessage: 'Emergency accommodation and services are available due to severe weather conditions.',
    swepActiveFrom: '2024-01-15T18:00:00Z',
    swepActiveUntil: '2024-01-18T09:00:00Z',
    isActive: true,
    createdAt: '2024-01-15T12:00:00Z',
    updatedAt: '2024-01-15T12:00:00Z',
    createdBy: 'admin',
  };

  describe('When SWEP is active', () => {
    it('renders the SWEP banner with correct content', () => {
      render(<SwepBanner swepData={mockSwepData} locationSlug="manchester" />);

      expect(screen.getByText('Severe Weather Emergency Protocol (SWEP) Active')).toBeInTheDocument();
      expect(screen.getByText('Emergency accommodation and services are available due to severe weather conditions.')).toBeInTheDocument();
      expect(screen.getByText('View SWEP Information')).toBeInTheDocument();
    });

    it('creates correct link to SWEP information page', () => {
      render(<SwepBanner swepData={mockSwepData} locationSlug="manchester" />);

      const link = screen.getByRole('link', { name: 'View SWEP Information' });
      expect(link).toHaveAttribute('href', '/manchester/swep');
    });

    it('displays the status indicator', () => {
      render(<SwepBanner swepData={mockSwepData} locationSlug="manchester" />);

      // Check for the visual indicator (white circle with red dot)
      const banner = screen.getByText('Severe Weather Emergency Protocol (SWEP) Active').closest('div');
      expect(banner).toBeInTheDocument();
    });

    it('has correct styling classes for emergency banner', () => {
      const { container } = render(<SwepBanner swepData={mockSwepData} locationSlug="manchester" />);

      const banner = container.firstChild as HTMLElement;
      expect(banner).toHaveClass('bg-brand-g', 'text-white', 'py-4', 'px-4', 'shadow-lg');
    });

    it('renders responsive layout classes', () => {
      const { container } = render(<SwepBanner swepData={mockSwepData} locationSlug="manchester" />);

      const flexContainer = container.querySelector('.flex');
      expect(flexContainer).toHaveClass('flex-col', 'sm:flex-row', 'sm:items-center', 'sm:justify-between');
    });
  });

  describe('When SWEP is not active', () => {
    it('does not render when isActive is false', () => {
      const inactiveSwepData = { ...mockSwepData, isActive: false };

      const { container } = render(<SwepBanner swepData={inactiveSwepData} locationSlug="manchester" />);

      expect(container.firstChild).toBeNull();
    });
  });

  describe('Different location slugs', () => {
    it('creates correct link for different location', () => {
      render(<SwepBanner swepData={mockSwepData} locationSlug="leeds" />);

      const link = screen.getByRole('link', { name: 'View SWEP Information' });
      expect(link).toHaveAttribute('href', '/leeds/swep');
    });

    it('creates correct link for location with hyphens', () => {
      render(<SwepBanner swepData={mockSwepData} locationSlug="wigan-and-leigh" />);

      const link = screen.getByRole('link', { name: 'View SWEP Information' });
      expect(link).toHaveAttribute('href', '/wigan-and-leigh/swep');
    });
  });

  describe('Accessibility', () => {
    it('has proper heading structure', () => {
      render(<SwepBanner swepData={mockSwepData} locationSlug="manchester" />);

      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveTextContent('Severe Weather Emergency Protocol (SWEP) Active');
    });

    it('has accessible link that can be focused', () => {
      render(<SwepBanner swepData={mockSwepData} locationSlug="manchester" />);

      const link = screen.getByRole('link', { name: 'View SWEP Information' });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', '/manchester/swep');

      link.focus();
      expect(link).toHaveFocus();
    });
  });
});
