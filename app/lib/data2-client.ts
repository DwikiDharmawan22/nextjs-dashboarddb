export const VALID_EMAIL = 'user123';
export const VALID_PASSWORD = '12345';
export const ADMIN_EMAIL = 'admin123';
export const ADMIN_PASSWORD = '12345';

export const generateRandomCaptcha = (): string => {
  // Return empty string during SSR
  if (typeof window === 'undefined') return '';
  
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length: 6 }, () => characters[Math.floor(Math.random() * characters.length)]).join('');
};