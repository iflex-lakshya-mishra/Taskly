// App color palette
export const Colors = {
  // Backgrounds
  background: "#161622",
  surface: "#1E293B",
  surfaceDark: "#0F172A",

  // Brand
  primary: "#7C3AED", // purple
  primaryLight: "#A78BFA",
  accent: "#2563EB", // blue
  accentLight: "#06B6D4", // cyan

  // Text
  textPrimary: "#FFFFFF",
  textSecondary: "#94A3B8",
  textMuted: "#64748B",

  // Status
  success: "#22C55E",
  warning: "#F59E0B",
  error: "#EF4444",
  errorLight: "#FCA5A5",

  // Priority
  priorityLow: "#22C55E",
  priorityNormal: "#F59E0B",
  priorityUrgent: "#EF4444",

  // Borders
  border: "#334155",
} as const;

export type ColorKey = keyof typeof Colors;
