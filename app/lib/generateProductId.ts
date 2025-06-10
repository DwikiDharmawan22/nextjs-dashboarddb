export function generateProductId(): string {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const letter = letters[Math.floor(Math.random() * letters.length)];
  const number = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `#${letter}${number}`;
}