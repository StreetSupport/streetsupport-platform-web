'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState, useCallback, Suspense } from 'react';

function ProgressBarInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const tickRef = useRef<ReturnType<typeof setInterval>>(undefined);
  const completeRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const prevPathRef = useRef(pathname);
  const prevSearchRef = useRef(searchParams.toString());

  const cleanup = useCallback(() => {
    if (tickRef.current) clearInterval(tickRef.current);
    if (completeRef.current) clearTimeout(completeRef.current);
  }, []);

  const start = useCallback(() => {
    cleanup();
    setProgress(15);
    setVisible(true);
    tickRef.current = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) return prev;
        // Slow down as we approach 90%
        return prev + (90 - prev) * 0.08;
      });
    }, 300);
  }, [cleanup]);

  const complete = useCallback(() => {
    cleanup();
    setProgress(100);
    completeRef.current = setTimeout(() => {
      setVisible(false);
      setProgress(0);
    }, 250);
  }, [cleanup]);

  // Navigation complete: pathname or search params changed
  useEffect(() => {
    const currentSearch = searchParams.toString();
    if (pathname !== prevPathRef.current || currentSearch !== prevSearchRef.current) {
      prevPathRef.current = pathname;
      prevSearchRef.current = currentSearch;
      if (visible) {
        complete();
      }
    }
  }, [pathname, searchParams, visible, complete]);

  // Intercept link clicks to detect navigation start
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest('a');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('tel:') || href.startsWith('mailto:')) return;
      if (anchor.target === '_blank') return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (anchor.getAttribute('download') != null) return;

      try {
        const url = new URL(href, window.location.origin);
        if (url.origin !== window.location.origin) return;
        // Don't show for same-page navigations
        if (url.pathname === pathname && url.search === window.location.search) return;
      } catch {
        return;
      }

      start();
    };

    // Also intercept programmatic navigation (router.push)
    const originalPushState = window.history.pushState.bind(window.history);
    const originalReplaceState = window.history.replaceState.bind(window.history);

    window.history.pushState = function (...args) {
      const url = args[2];
      if (url && typeof url === 'string') {
        try {
          const target = new URL(url, window.location.origin);
          if (target.pathname !== pathname) {
            start();
          }
        } catch {
          // ignore invalid URLs
        }
      }
      return originalPushState(...args);
    };

    window.history.replaceState = function (...args) {
      return originalReplaceState(...args);
    };

    document.addEventListener('click', handleClick, true);

    return () => {
      document.removeEventListener('click', handleClick, true);
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;
      cleanup();
    };
  }, [pathname, start, cleanup]);

  if (!visible && progress === 0) return null;

  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Page loading"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '3px',
        zIndex: 99999,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          height: '100%',
          width: `${progress}%`,
          backgroundColor: '#38ae8e',
          transition: visible
            ? 'width 300ms ease'
            : 'width 150ms ease, opacity 250ms ease 100ms',
          opacity: visible ? 1 : 0,
          boxShadow: '0 0 8px rgba(56, 174, 142, 0.5)',
        }}
      />
    </div>
  );
}

export default function ProgressBar() {
  return (
    <Suspense fallback={null}>
      <ProgressBarInner />
    </Suspense>
  );
}
