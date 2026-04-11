import React from 'react';
import { cn } from '../../lib/utils';

export const Layout = ({ children, className }) => (
  <div className={cn('min-h-screen bg-slate-50 font-sans antialiased', className)}>{children}</div>
);

export const Container = ({ children, className }) => (
  <div className={cn('mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8', className)}>{children}</div>
);

export const Section = ({ children, className }) => (
  <section className={cn('py-12 md:py-16 lg:py-20', className)}>{children}</section>
);
