export interface TimezoneConfig {
  value: string;
  label: string;
  utc: string;
}

// Stub hook - no backend functionality
export function useZonaHoraria() {
  return {
    timezone: "America/Lima",
    setTimezone: (_tz: string) => { },
    config: { value: "America/Lima", label: "Lima", utc: "-05:00" } as TimezoneConfig,
  };
}
