import React from 'react';
import { cn } from '../../lib/utils';
import { Avatar } from './Avatar';

export const AvatarGroup = ({ users, limit = 3, className }) => {
  const visibleUsers = users.slice(0, limit);
  const remainingCount = users.length - limit;

  return (
    <div className={cn('flex -space-x-3 overflow-hidden', className)}>
      {visibleUsers.map((user, i) => (
        <Avatar key={i} src={user.src} alt={user.alt} fallback={user.fallback} className="inline-block border-2 border-white ring-2 ring-white" />
      ))}
      {remainingCount > 0 && (
        <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-slate-100 text-xs font-medium text-slate-500 ring-2 ring-white">
          +{remainingCount}
        </div>
      )}
    </div>
  );
};
