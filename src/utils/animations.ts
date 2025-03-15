
import { useEffect, useState } from 'react';

// Fade in animation for elements that need to appear smoothly
export const useFadeIn = (initialState = false, delay = 0) => {
  const [isVisible, setIsVisible] = useState(initialState);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return isVisible;
};

// Staggered animation for lists where items should appear one after another
export const useStaggeredFadeIn = (items: any[], baseDelay = 50) => {
  const [visibleItems, setVisibleItems] = useState<boolean[]>([]);

  useEffect(() => {
    // Reset visible items when items change
    setVisibleItems(new Array(items.length).fill(false));
    
    // Stagger the animations
    items.forEach((_, index) => {
      setTimeout(() => {
        setVisibleItems(prev => {
          const newVisible = [...prev];
          newVisible[index] = true;
          return newVisible;
        });
      }, baseDelay * index);
    });
  }, [items, baseDelay]);

  return visibleItems;
};

// Smooth scroll to element utility
export const scrollToElement = (elementId: string, offset = 0) => {
  const element = document.getElementById(elementId);
  if (element) {
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;
    
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
};

// Intersection observer hook for triggering animations when elements come into view
export const useIntersectionObserver = (options = {}) => {
  const [ref, setRef] = useState<HTMLElement | null>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    if (!ref) return;
    
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);
    
    observer.observe(ref);
    
    return () => {
      observer.disconnect();
    };
  }, [ref, options]);

  return [setRef, isIntersecting] as const;
};
