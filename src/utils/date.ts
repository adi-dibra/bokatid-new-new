export function format(date: Date): string {
  return date.toLocaleDateString('sv-SE', {
    day: 'numeric',
    month: 'short',
  }).replace('.', '');
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}