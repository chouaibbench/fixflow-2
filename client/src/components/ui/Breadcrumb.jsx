import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '../../lib/utils';

export const Breadcrumb = ({ items, className }) => (
  <nav className={cn('flex items-center space-x-2 text-sm text-slate-500', className)} aria-label="Breadcrumb">
    <ol className="inline-flex items-center space-x-1 md:space-x-3">
      <li className="inline-flex items-center">
        <a href="/" className="inline-flex items-center hover:text-indigo-600">
          <Home className="mr-2 h-4 w-4" />
          Home
        </a>
      </li>
      {items.map((item, index) => (
        <li key={index}>
          <div className="flex items-center">
            <ChevronRight className="h-4 w-4 text-slate-400" />
            {item.href ? (
              <a href={item.href} className="ml-1 font-medium hover:text-indigo-600 md:ml-2">{item.label}</a>
            ) : (
              <span className="ml-1 font-medium text-slate-900 md:ml-2">{item.label}</span>
            )}
          </div>
        </li>
      ))}
    </ol>
  </nav>
);
