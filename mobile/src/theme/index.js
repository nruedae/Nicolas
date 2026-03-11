export const colors = {
  primary: '#6366f1',       // indigo
  primaryDark: '#4f46e5',
  accent: '#a78bfa',        // purple
  background: '#0f172a',    // slate-900
  surface: '#1e293b',       // slate-800
  surfaceLight: '#334155',  // slate-700
  text: '#f8fafc',
  textMuted: '#94a3b8',
  border: '#334155',
  success: '#10b981',
  error: '#f43f5e',
  warning: '#f59e0b',
  white: '#ffffff',
}

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
}

export const radius = {
  sm: 8,
  md: 12,
  lg: 20,
  full: 9999,
}

export const typography = {
  heading: { fontSize: 28, fontWeight: '700', color: colors.text },
  subheading: { fontSize: 20, fontWeight: '600', color: colors.text },
  body: { fontSize: 16, color: colors.text },
  caption: { fontSize: 13, color: colors.textMuted },
  label: { fontSize: 12, fontWeight: '600', color: colors.textMuted, letterSpacing: 1, textTransform: 'uppercase' },
}
