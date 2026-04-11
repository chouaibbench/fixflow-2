import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from './Button';

export const Pagination = ({ currentPage, totalPages, onPageChange, className }) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav className={cn('flex items-center justify-center space-x-2', className)}>
      <Button variant="outline" size="sm" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
        <ChevronLeft className="mr-2 h-4 w-4" />
        Previous
      </Button>
      <div className="flex items-center space-x-1">
        {pages.map((page) => (
          <Button key={page} variant={currentPage === page ? 'primary' : 'outline'} size="sm" onClick={() => onPageChange(page)} className="w-10">
            {page}
          </Button>
        ))}
      </div>
      <Button variant="outline" size="sm" onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
        Next
        <ChevronRight className="ml-2 h-4 w-4" />
      </Button>
    </nav>
  );
};
