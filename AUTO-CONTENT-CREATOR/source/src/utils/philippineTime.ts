/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Philippine Standard Time (PST / Asia/Manila) is fixed at UTC+8.
export const PHILIPPINES_TIMEZONE = 'Asia/Manila';

/**
 * Returns current Date in Philippine Time
 */
export function getNowInManila(): Date {
  const now = new Date();
  const manilaString = now.toLocaleString('en-US', { timeZone: PHILIPPINES_TIMEZONE });
  return new Date(manilaString);
}

/**
 * Formats a date into Asia/Manila display string (e.g., "Nov 1, 2026, 06:05 PM PHT")
 */
export function formatManilaDateTime(date: Date | string | number): string {
  const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-PH', {
    timeZone: PHILIPPINES_TIMEZONE,
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  }).format(d);
}

/**
 * Returns Manila YYYY-MM-DD
 */
export function getManilaDateString(date: Date = new Date()): string {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: PHILIPPINES_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  return formatter.format(date); // outputs YYYY-MM-DD
}

/**
 * Returns Manila HH:mm (24-hour format)
 */
export function getManilaTimeString(date: Date = new Date()): string {
  const formatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: PHILIPPINES_TIMEZONE,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  return formatter.format(date); // outputs HH:mm
}

/**
 * Checks if a scheduled date and time is due (equal to or in the past relative to Manila time)
 */
export function isScheduleDueInManila(scheduledDate: string, scheduledTime: string): boolean {
  try {
    const todayStr = getManilaDateString();
    const timeStr = getManilaTimeString();

    if (scheduledDate < todayStr) return true;
    if (scheduledDate === todayStr && scheduledTime <= timeStr) return true;
    return false;
  } catch {
    return false;
  }
}

/**
 * Calculate difference in minutes from current Manila time
 */
export function getMinutesUntilDue(scheduledDate: string, scheduledTime: string): number {
  try {
    const manilaNow = getNowInManila();
    const [year, month, day] = scheduledDate.split('-').map(Number);
    const [hours, minutes] = scheduledTime.split(':').map(Number);
    const target = new Date(year, month - 1, day, hours, minutes, 0);

    const diffMs = target.getTime() - manilaNow.getTime();
    return Math.round(diffMs / 60000);
  } catch {
    return 0;
  }
}

/**
 * High engagement time slots for Philippine audience
 */
export const PHILIPPINES_PEAK_SLOTS = [
  { label: 'Morning Commute (08:30)', time: '08:30', description: 'Basa habang bumibiyahe sa MRT / bus' },
  { label: 'Lunch Break (12:15)', time: '12:15', description: 'Kain at doomscroll sa opisina / school' },
  { label: 'Merienda / Afternoon (15:30)', time: '15:30', description: 'Breaktime snack & casual scrolling' },
  { label: 'Prime Evening (18:45)', time: '18:45', description: 'Peak social engagement pag-uwi' },
  { label: 'Night Bedtime (21:30)', time: '21:30', description: 'Highest reel & short video engagement' },
];
