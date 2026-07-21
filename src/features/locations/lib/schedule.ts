export function parseScheduleLines(scheduleDisplay: string): string[] {
  return scheduleDisplay.split(", ").filter(Boolean);
}
