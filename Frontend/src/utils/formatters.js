/**
 * Formatting helpers for USD currency ($), dates, percentages, and IDs
 */

export const formatCurrency = (amount) => {
  const num = Number(amount) || 0;
  // Format with up to 2 decimal places for converted USD values (e.g. $1.20)
  const hasDecimals = num % 1 !== 0;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: hasDecimals ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(num);
};

export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return new Intl.DateTimeFormat('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

export const formatPercent = (value) => {
  return `${Number(value) || 0}%`;
};

export const generateShortId = (prefix = 'TXN') => {
  const randomStr = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `${prefix}-${randomStr}`;
};

/**
 * Resolves screenshot / uploaded asset URLs dynamically based on API origin
 * Supports absolute URLs, relative URLs with leading slashes, and relative URLs without leading slashes.
 */
export const getImageUrl = (path) => {
  if (!path || typeof path !== 'string') return null;
  const cleanPath = path.trim();
  if (!cleanPath) return null;

  // If already absolute URL (http://, https://, data:, blob:), return as is
  if (/^(https?:\/\/|data:|blob:)/i.test(cleanPath)) {
    return cleanPath;
  }

  // Derive backend origin from VITE_API_URL or default 'http://localhost:5000/api'
  const apiUrl = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) || 'http://localhost:5000/api';
  const origin = apiUrl.replace(/\/api\/?$/, '');

  // Normalize path to ensure leading slash
  const normalizedPath = cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`;

  return `${origin}${normalizedPath}`;
};
