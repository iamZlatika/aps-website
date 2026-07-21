export function formatPrice(value: string | number): string {
  const num = typeof value === "number" ? value : Number.parseFloat(value);
  const safe = Number.isFinite(num) ? num : 0;
  return `${new Intl.NumberFormat("uk-UA", { maximumFractionDigits: 0 }).format(safe)} ₴`;
}

export function getInitial(name: string): string {
  return name.charAt(0).toUpperCase();
}
