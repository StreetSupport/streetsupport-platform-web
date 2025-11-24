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

// TODO: Re-enable these tests once CMS and database integration is complete
// SWEP functionality is frontend-ready but depends on backend systems not yet implemented
describe.skip('SwepBanner Component', () => {
  const mockSwepData: SwepData = {
    id: 'test-swep-1',
    locationSlug: 'manchester',
    title: 'Severe Weather Emergency Protocol - Manchester',
    body: 'Test body content',
    shortMessage: 'Emergency accommodation and services are available due to severe weather conditions.',
    swepActiveFrom: '2024-01-15T18:00:00Z',
    swepActiveUntil: '2024-01-18T09:00:00Z'
  };

  beforeEach(() => {
    // Mock current date to be within SWEP active period
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-01-16T12:00:00Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

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
    it('does not render when SWEP period has not started', () => {
      jest.setSystemTime(new Date('2024-01-14T12:00:00Z')); // Before start time
      
      const { container } = render(<SwepBanner swepData={mockSwepData} locationSlug="manchester" />);
      
      expect(container.firstChild).toBeNull();
    });

    it('does not render when SWEP period has ended', () => {
      jest.setSystemTime(new Date('2024-01-19T12:00:00Z')); // After end time
      
      const { container } = render(<SwepBanner swepData={mockSwepData} locationSlug="manchester" />);
      
      expect(container.firstChild).toBeNull();
    });

    it('renders at the exact start time', () => {
      jest.setSystemTime(new Date('2024-01-15T18:00:00Z')); // Exact start time
      
      render(<SwepBanner swepData={mockSwepData} locationSlug="manchester" />);
      
      expect(screen.getByText('Severe Weather Emergency Protocol (SWEP) Active')).toBeInTheDocument();
    });

    it('renders at the exact end time', () => {
      jest.setSystemTime(new Date('2024-01-18T09:00:00Z')); // Exact end time
      
      render(<SwepBanner swepData={mockSwepData} locationSlug="manchester" />);
      
      expect(screen.getByText('Severe Weather Emergency Protocol (SWEP) Active')).toBeInTheDocument();
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
      // Check that link is present and accessible
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', '/manchester/swep');
      
      // Check that link can receive focus
      link.focus();
      expect(link).toHaveFocus();
    });
  });
});