export function absoluteDate(date: Date | string) {
  const d = typeof date === 'string' ? new Date(date) : date;

  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
