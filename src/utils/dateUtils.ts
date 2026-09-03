/**
 * Utility functions for date parsing, formatting, and sorting.
 * Supports Indonesian date formats (e.g., "10 Jun 2026", "28 Mei 2026"),
 * ISO dates ("2026-06-10"), and standard JS Date inputs.
 */

const MONTH_MAP: Record<string, number> = {
  jan: 0, januari: 0, january: 0,
  feb: 1, februari: 1, february: 1,
  mar: 2, maret: 2, march: 2,
  apr: 3, april: 3,
  mei: 4, may: 4,
  jun: 5, juni: 5, june: 5,
  jul: 6, juli: 6, july: 6,
  agu: 7, agt: 7, agustus: 7, aug: 7, august: 7,
  sep: 8, september: 8,
  okt: 9, oct: 9, oktober: 9, october: 9,
  nov: 10, november: 10,
  des: 11, dec: 11, desember: 11, december: 11,
};

const MONTH_NAMES_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
  'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
];

/**
 * Parses any date string (Indonesian text, ISO format, or timestamp) into a Unix timestamp (ms).
 */
export function parseDateToTimestamp(dateStr?: string | null): number {
  if (!dateStr || typeof dateStr !== 'string') return 0;

  const trimmed = dateStr.trim();
  if (!trimmed) return 0;

  // 1. Check for standard ISO format: YYYY-MM-DD
  const isoMatch = trimmed.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (isoMatch) {
    const year = parseInt(isoMatch[1], 10);
    const month = parseInt(isoMatch[2], 10) - 1;
    const day = parseInt(isoMatch[3], 10);
    return new Date(year, month, day).getTime();
  }

  // 2. Check for Indonesian / English textual format: DD Month YYYY (e.g., "10 Jun 2026" or "5 Mei 2026")
  const textMatch = trimmed.match(/^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})/);
  if (textMatch) {
    const day = parseInt(textMatch[1], 10);
    const monthKey = textMatch[2].toLowerCase();
    const year = parseInt(textMatch[3], 10);
    const month = MONTH_MAP[monthKey] ?? -1;

    if (month !== -1) {
      return new Date(year, month, day).getTime();
    }
  }

  // 3. Fallback: native Date.parse
  const parsed = Date.parse(trimmed);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Formats any date string into a neat and readable format: "10 Jun 2026".
 */
export function formatDateDisplay(dateStr?: string | null): string {
  if (!dateStr || typeof dateStr !== 'string') return '-';

  const ts = parseDateToTimestamp(dateStr);
  if (!ts) return dateStr; // fallback to original string if cannot be parsed

  const date = new Date(ts);
  const day = String(date.getDate()).padStart(2, '0');
  const month = MONTH_NAMES_SHORT[date.getMonth()] || '';
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
}

/**
 * Converts any date string to "YYYY-MM-DD" for HTML5 <input type="date"> value.
 */
export function toInputDateFormat(dateStr?: string | null): string {
  if (!dateStr || typeof dateStr !== 'string') {
    return getTodayInputDate();
  }

  // If already YYYY-MM-DD, return directly
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr.trim())) {
    return dateStr.trim();
  }

  const ts = parseDateToTimestamp(dateStr);
  if (!ts) {
    return getTodayInputDate();
  }

  const d = new Date(ts);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

/**
 * Returns today's date in "YYYY-MM-DD" string format.
 */
export function getTodayInputDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Sorts an array of objects descending by `date` (newest first).
 */
export function sortByDateDesc<T extends { date: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    const timeA = parseDateToTimestamp(a.date);
    const timeB = parseDateToTimestamp(b.date);
    return timeB - timeA;
  });
}
