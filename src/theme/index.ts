/**
 * App-wide Material Design 3 theme.
 * Extends the default MD3LightTheme with a custom indigo/violet palette.
 */
import { MD3LightTheme } from 'react-native-paper';

export const theme = {
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
