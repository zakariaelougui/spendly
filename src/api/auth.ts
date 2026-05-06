/**
 * Authentication API.
 *
 * Currently backed by mock data. Replace each function body with a real HTTP
 * call when the server is ready — the `AuthSessionSchema.parse()` calls
 * will keep validating the shape regardless of the data source.
 *
 * Demo credentials: alex@example.com / password
 */
import { delay } from './client';
import { AuthSessionSchema, AuthSession, User } from './types';

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_USER: User = {
  id: 'user-1',
  name: 'Alex Rivera',
  email: 'alex@example.com',
  avatarUrl: 'https://i.pravatar.cc/150?img=47',
};

const GUEST_USER: User = {
  id: 'guest',
  name: 'Guest',
  email: 'guest@example.com',
};

// ─── API ──────────────────────────────────────────────────────────────────────
// Replace each function body with a real HTTP call when the server is ready.
// AuthSessionSchema.parse() validates the shape at runtime — swap mock objects
// for raw server JSON and the guarantee stays intact.
// Use credentials: alex@example.com / password to test the mock.

/** Authenticates with email + password. Throws if credentials are invalid. */
export async function login(email: string, password: string): Promise<AuthSession> {
  await delay(800);
  if (email.trim().toLowerCase() === 'alex@example.com' && password === 'password') {
    return AuthSessionSchema.parse({ user: MOCK_USER, token: 'mock-jwt-token' });
  }
  throw new Error('Invalid email or password');
}

/** Creates a new account and returns a session. */
export async function signup(
  name: string,
  email: string,
  _password: string,
): Promise<AuthSession> {
  await delay(1000);
  return AuthSessionSchema.parse({
    user: {
      id: `user-${Date.now()}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      avatarUrl: 'https://i.pravatar.cc/150?img=12',
    },
    token: 'mock-jwt-token',
  });
}

/** Returns a limited guest session without requiring credentials. */
export async function guestLogin(): Promise<AuthSession> {
  await delay(300);
  return AuthSessionSchema.parse({ user: GUEST_USER, token: 'guest-token' });
}

/** Invalidates the session token on the server. */
export async function logout(_token: string): Promise<void> {
  await delay(200);
}
