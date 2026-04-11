import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { Button } from './Button';

export const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.pageYOffset > 300);
    };
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!isVisible) return null;

  return (
    <Button variant="primary" size="icon" onClick={scrollToTop} className="fixed bottom-4 right-4 z-50 rounded-full shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-300">
      <ArrowUp className="h-5 w-5" />
    </Button>
  );
};
