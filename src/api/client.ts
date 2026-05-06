/**
 * HTTP client foundation.
 *
 * Swap this file's internals to point at a real server.
 * All API modules import only `delay` (and eventually `request`) from here,
 * so replacing these two exports is the only change needed for a live backend.
 */

/** Simulates network latency in mock API calls. */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Future:
// export const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'https://api.example.com';
//
// export async function request<T>(
//   path: string,
//   opts?: RequestInit & { token?: string },
// ): Promise<T> {
//   const res = await fetch(`${BASE_URL}${path}`, {
//     ...opts,
//     headers: {
//       'Content-Type': 'application/json',
//       ...(opts?.token ? { Authorization: `Bearer ${opts.token}` } : {}),
//       ...opts?.headers,
//     },
//   });
//   if (!res.ok) throw new Error(await res.text());
//   return res.json() as Promise<T>;
// }
