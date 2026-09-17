export const colors = {
  primary: "#006A4E",
  primaryDark: "#00503A",
  primaryMuted: "#E6F4EA",
  secondary: "#2B6CB0",
  secondarySubtle: "#EFF6FF",
  gold: "#F2A900",
  goldHover: "#D9822B",
  ochre: "#C2611A",
  canvas: "#F8FAFC",
  card: "#FFFFFF",
  muted: "#F1F5F9",
  border: "#E2E8F0",
  borderStrong: "#CBD5E1",
  text: "#0F172A",
  textSecondary: "#475569",
  textMuted: "#64748B",
  success: "#15803D",
  warning: "#B45309",
  error: "#BA1A1A",
  onPrimary: "#FFFFFF",
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const radii = {
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  pill: 9999,
} as const;

export const typography = {
  display: { fontSize: 32, fontWeight: "700" as const, lineHeight: 40 },
  headlineLg: { fontSize: 26, fontWeight: "700" as const, lineHeight: 34 },
  headlineMd: { fontSize: 20, fontWeight: "600" as const, lineHeight: 28 },
  headlineSm: { fontSize: 18, fontWeight: "600" as const, lineHeight: 26 },
  bodyLg: { fontSize: 17, fontWeight: "400" as const, lineHeight: 26 },
  bodyMd: { fontSize: 15, fontWeight: "400" as const, lineHeight: 24 },
  bodySm: { fontSize: 13, fontWeight: "400" as const, lineHeight: 20 },
  labelLg: { fontSize: 14, fontWeight: "600" as const, lineHeight: 20 },
  labelMd: { fontSize: 12, fontWeight: "600" as const, lineHeight: 16 },
  caption: { fontSize: 11, fontWeight: "500" as const, lineHeight: 16 },
} as const;

export const shadows = {
  card: {
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
} as const;

export const layout = {
  gutter: 16,
  minTouch: 48,
} as const;
