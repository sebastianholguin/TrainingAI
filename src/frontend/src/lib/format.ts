/** Mockups show hire dates as "Jan 12, 2021". */
export function formatDate(isoDate: string): string {
  if (!isoDate) return ''
  const [year, month, day] = isoDate.split('-').map(Number)
  if (!year || !month || !day) return isoDate
  return new Date(year, month - 1, day).toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  })
}

/**
 * Parse a "YYYY-MM-DD" input value into a *local* midnight Date.
 *
 * `new Date('2026-09-08')` parses as UTC midnight, so comparing it against `new Date()`
 * misjudges the day by up to a full date east or west of UTC — in Sydney that made an
 * employee hired today read as hired in the future. Date-only values have no timezone;
 * building them locally keeps the comparison on the same calendar the user sees.
 */
export function parseDateOnly(value: string): Date | null {
  const [year, month, day] = value.split('-').map(Number)
  if (!year || !month || !day) return null
  return new Date(year, month - 1, day)
}

/** Today at local midnight, so date-only comparisons don't trip over the current time. */
export function todayDateOnly(): Date {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), now.getDate())
}

/**
 * Add whole years the way .NET's `DateOnly.AddYears` does: clamp to the last valid day of
 * the target month rather than rolling forward. JavaScript's `setFullYear` turns
 * 2000-02-29 + 18y into 2018-03-01, while the backend produces 2018-02-28 — a one-day
 * disagreement that rejected valid input for leap-day birthdays.
 */
export function addYearsClamped(date: Date, years: number): Date {
  const year = date.getFullYear() + years
  const month = date.getMonth()
  const lastDayOfMonth = new Date(year, month + 1, 0).getDate()
  return new Date(year, month, Math.min(date.getDate(), lastDayOfMonth))
}

/** "Johnathan Doe" -> "JD" for the avatar circle in the directory table. */
export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}
