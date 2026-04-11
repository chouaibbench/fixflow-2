import React from 'react';
import { Container } from './Layout';
import { cn } from '../../lib/utils';

export const Footer = ({ children, className }) => (
  <footer className={cn('w-full border-t border-slate-200 bg-white py-8 md:py-12', className)}>
    <Container className="flex flex-col items-center justify-between gap-4 md:flex-row">{children}</Container>
  </footer>
);

export const FooterText = ({ children, className }) => (
  <p className={cn('text-sm text-slate-500', className)}>{children}</p>
);
