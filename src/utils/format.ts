const compact = new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 });
const decimal = new Intl.NumberFormat("en");

export const formatCompact = (n: number) => compact.format(n);
export const formatNumber = (n: number) => decimal.format(n);

export function formatDate(input: string | number | Date, locale = "en") {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(input));
}
