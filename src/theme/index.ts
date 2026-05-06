/**
 * App-wide Material Design 3 themes (light + dark).
 * Both share the same indigo/violet primary palette, adapted for each scheme.
 */
import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#6366f1',
    primaryContainer: '#e0e7ff',
    onPrimaryContainer: '#312e81',
    secondary: '#8b5cf6',
    secondaryContainer: '#ede9fe',
    background: '#f8fafc',
    surface: '#ffffff',
    surfaceVariant: '#f1f5f9',
    onSurface: '#1e293b',
    onSurfaceVariant: '#64748b',
    outline: '#cbd5e1',
    error: '#ef4444',
    onSurfaceDisabled: '#94a3b8',
  },
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#818cf8',
    primaryContainer: '#312e81',
    onPrimaryContainer: '#e0e7ff',
    secondary: '#a78bfa',
    secondaryContainer: '#4c1d95',
    background: '#0f172a',
    surface: '#1e293b',
    surfaceVariant: '#334155',
    onSurface: '#f1f5f9',
    onSurfaceVariant: '#94a3b8',
    outline: '#475569',
    error: '#f87171',
    onSurfaceDisabled: '#475569',
  },
};

/** Kept for any legacy imports expecting `theme`. */
export const theme = lightTheme;
