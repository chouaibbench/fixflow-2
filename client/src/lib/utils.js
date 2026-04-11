import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatDate(date) {
  if (!date) return 'N/A';
  if (date.toDate) {
    return date.toDate().toLocaleString();
  }
  return new Date(date).toLocaleString();
}

const LOG_RETENTION_DAYS = 30;

export function getDaysLeft(createdAt) {
  const expiresAt = new Date(createdAt);
  expiresAt.setDate(expiresAt.getDate() + LOG_RETENTION_DAYS);
  return Math.ceil((expiresAt - new Date()) / (1000 * 60 * 60 * 24));
}

export function getExpiryMessage(createdAt) {
  const days = getDaysLeft(createdAt);
  if (days <= 0) return 'Expires today';
  if (days === 1) return 'Disappears in 1 day';
  return `Disappears in ${days} days`;
}
