import { useState, useEffect } from 'react';

interface UseMediaQueryOptions {
  fallback?: boolean;
}

const useMediaQuery = (
  query: string,
  options: UseMediaQueryOptions = { fallback: false }
): boolean => {
  const [matches, setMatches] = useState(options.fallback);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const media = window.matchMedia(query);

    // Set initial value
    setMatches(media.matches);

    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Use addEventListener for modern browsers
    if (media.addEventListener) {
      media.addEventListener('change', listener);
      return () => {
        media.removeEventListener('change', listener);
      };
    }
    // Fallback for older browsers
    else {
      media.addListener(listener);
      return () => {
        media.removeListener(listener);
      };
    }
  }, [query]);

  return matches;
};

export { useMediaQuery };

// Predefined breakpoints for easier usage
export const useIsMobile = () => useMediaQuery('(max-width: 768px)');
export const useIsTablet = () => useMediaQuery('(min-width: 769px) and (max-width: 1024px)');
export const useIsDesktop = () => useMediaQuery('(min-width: 1025px)');