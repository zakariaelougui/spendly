/**
 * Global authentication store (Zustand).
 *
 * Holds the current session and exposes async actions that call the auth API.
 * `isLoading` is set to `true` for the duration of any in-flight auth request.
 */
import { create } from 'zustand';
import * as authApi from '../api/auth';
import { User } from '../api/types';

interface AuthState {
  /** Authenticated user, or `null` when logged out. */
  user: User | null;
  /** Bearer token for API requests, or `null` when logged out. */
  token: string | null;
  /** `true` while any auth action is in flight. */
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  guestLogin: () => Promise<void>;
  /** Clears session state after calling the server logout endpoint. */
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isLoading: false,

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const session = await authApi.login(email, password);
      set({ user: session.user, token: session.token });
    } finally {
      set({ isLoading: false });
    }
  },

  signup: async (name, email, password) => {
    set({ isLoading: true });
    try {
      const session = await authApi.signup(name, email, password);
      set({ user: session.user, token: session.token });
    } finally {
      set({ isLoading: false });
    }
  },

  guestLogin: async () => {
    set({ isLoading: true });
    try {
      const session = await authApi.guestLogin();
      set({ user: session.user, token: session.token });
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    const { token } = get();
    if (token) await authApi.logout(token);
    set({ user: null, token: null });
  },
}));
