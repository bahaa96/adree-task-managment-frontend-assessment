import { useState, useEffect, useCallback } from 'react';

interface UseInfiniteScrollOptions {
  threshold?: number;
  rootMargin?: string;
  enabled?: boolean;
}

interface UseInfiniteScrollReturn {
  ref: (node: HTMLElement | null) => void;
  isIntersecting: boolean;
  reset: () => void;
}

const useInfiniteScroll = (
  callback: () => void,
  options: UseInfiniteScrollOptions = {}
): UseInfiniteScrollReturn => {
  const {
    threshold = 0.1,
    rootMargin = '100px',
    enabled = true,
  } = options;

  const [ref, setRef] = useState<HTMLElement | null>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  const reset = useCallback(() => {
    setIsIntersecting(false);
  }, []);

  useEffect(() => {
    if (!ref || !enabled) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        if (entry.isIntersecting) {
          callback();
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(ref);

    return () => {
      observer.disconnect();
    };
  }, [ref, callback, threshold, rootMargin, enabled]);

  const setElementRef = useCallback((node: HTMLElement | null) => {
    setRef(node);
  }, []);

  return {
    ref: setElementRef,
    isIntersecting,
    reset,
  };
};

export { useInfiniteScroll };