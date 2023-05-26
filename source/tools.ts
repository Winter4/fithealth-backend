/**
 * Convert `dd.mm.yyyy` string to Date object
 * @param date `dd.mm.yyyy` string
 * @returns `new Date(string[2], string[1] - 1, string[0])`
 */
export function stringToDate(date: string): Date {
  const parts = date.split(".").map((item: string) => Number(item));
  // day.month.year => 3 parts of date
  if (parts.length !== 3) throw new Error("Invalid stringyfied Date value");

  return new Date(+parts[2], parts[1] - 1, +parts[0]);
}

/**
 * Convert Date object to `dd.mm.yyyy` string
 * @param date
 * @returns `dd.mm.yyyy` string
 */
export function dateToString(date: Date): string {
  const day = date.getDate();
  const dayString = day < 10 ? `0${day}` : `${day}`;

  const month = date.getMonth();
  const monthString = month + 1 < 10 ? `0${month + 1}` : `${month + 1}`;

  return `${dayString}.${monthString}.${date.getFullYear()}`;
}
