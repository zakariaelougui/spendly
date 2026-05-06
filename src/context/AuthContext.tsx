// Compatibility shim — keeps existing useAuth() calls working without changes.
// New code can import useAuthStore directly from '../store/authStore'.
import React, { ReactNode } from 'react';
export { useAuthStore as useAuth } from '../store/authStore';

// AuthProvider is now a no-op wrapper; Zustand state is global.
export function AuthProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
