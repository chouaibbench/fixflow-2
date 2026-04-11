import React from 'react';
import { Container } from './Layout';
import { cn } from '../../lib/utils';

export const Navbar = ({ children, className }) => (
  <nav className={cn('sticky top-0 z-40 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md', className)}>
    <Container className="flex h-16 items-center justify-between">{children}</Container>
  </nav>
);

export const NavbarBrand = ({ children, className }) => (
  <div className={cn('flex items-center gap-2 font-bold text-xl text-indigo-600', className)}>{children}</div>
);

export const NavbarContent = ({ children, className }) => (
  <div className={cn('flex items-center gap-4', className)}>{children}</div>
);
