'use client';

import React, { useEffect, useState } from 'react';
import { Cloud } from 'lucide-react';
import { SiFacebook, SiX } from 'react-icons/si';

export default function OrganisationFooter() {
  const [currentUrl, setCurrentUrl] = useState('');
  const [currentTitle, setCurrentTitle] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.href);
      setCurrentTitle(document.title);
    }
  }, []);

  const shareOnBluesky = () => {
    const text = encodeURIComponent(
      `Help is out there – check out this page on Street Support Network: ${currentTitle} ${currentUrl}`
    );
    const shareUrl = `https://bsky.app/intent/compose?text=${text}`;
    window.open(shareUrl, 'blank', 'width=600,height=300');
  };

  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    currentUrl
  )}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    `Help is out there - check out this page on Street Support Network: ${currentTitle} ${currentUrl}`
  )}`;

  return (
    <footer className="mt-6 text-sm text-gray-600">
      {/** ✅ This is always rendered, immediately */}
      <p>Information provided by Street Support for demonstration purposes only.</p>

      <div className="mb-4 flex items-center gap-4">
        <span>Share this page:</span>
        <button
          onClick={shareOnBluesky}
          className="flex items-center text-brand-h hover:underline"
        >
          <Cloud className="h-4 w-4 mr-1" />
          <span className="sr-only md:not-sr-only">Share on Bluesky</span>
        </button>
        <a
          href={facebookUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center text-brand-h hover:underline"
        >
          <SiFacebook className="h-4 w-4 mr-1" />
          <span className="sr-only md:not-sr-only">Share on Facebook</span>
        </a>
        <a
          href={twitterUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center text-brand-h hover:underline"
        >
          <SiX className="h-4 w-4 mr-1" />
          <span className="sr-only md:not-sr-only">Share on X</span>
        </a>
      </div>
    </footer>
  );
}
