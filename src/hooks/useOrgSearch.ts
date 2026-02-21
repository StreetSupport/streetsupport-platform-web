import { useState } from 'react';

interface UseOrgSearchReturn {
  orgSearchInput: string;
  setOrgSearchInput: (value: string) => void;
  isOrgSearching: boolean;
  orgSearchError: string | null;
  setOrgSearchError: (error: string | null) => void;
  handleOrgSearch: (e: React.FormEvent) => Promise<void>;
}

export function useOrgSearch(): UseOrgSearchReturn {
  const [orgSearchInput, setOrgSearchInput] = useState('');
  const [isOrgSearching, setIsOrgSearching] = useState(false);
  const [orgSearchError, setOrgSearchError] = useState<string | null>(null);

  const handleOrgSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedQuery = orgSearchInput.trim();
    if (!trimmedQuery) {
      setOrgSearchError('Please enter an organisation name');
      return;
    }

    setIsOrgSearching(true);
    setOrgSearchError(null);

    try {
      const response = await fetch(`/api/organisations/search?q=${encodeURIComponent(trimmedQuery)}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          setOrgSearchError('No organisations found matching your search');
        } else if (response.status >= 500) {
          setOrgSearchError('Server error. Please try again later.');
        } else {
          setOrgSearchError('Search failed. Please try again.');
        }
        return;
      }

      const data = await response.json();

      if (data.organisations && data.organisations.length > 0) {
        if (data.organisations.length === 1) {
          window.location.href = `/find-help/organisation/${data.organisations[0].slug}`;
        } else {
          window.location.href = `/find-help/organisations?search=${encodeURIComponent(trimmedQuery)}`;
        }
      } else {
        setOrgSearchError('No organisations found matching your search');
      }
    } catch (err) {
      console.error('Organisation search error:', err);
      setOrgSearchError('Network error. Please check your connection and try again.');
    } finally {
      setIsOrgSearching(false);
    }
  };

  return {
    orgSearchInput,
    setOrgSearchInput,
    isOrgSearching,
    orgSearchError,
    setOrgSearchError,
    handleOrgSearch,
  };
}
