/**
 * Shared Zod schemas and derived TypeScript types used across the API layer.
 * Schemas double as runtime validators — parse raw server responses through
 * them so shape mismatches surface immediately rather than silently propagating.
 */
import { z } from 'zod';

/** Authenticated user returned by the server. */
export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  avatarUrl: z.string().url().optional(),
});

/** Session payload received after a successful login or signup. */
export const AuthSessionSchema = z.object({
  user: UserSchema,
  token: z.string(),
});

/** A single expense entry. `date` is an ISO-8601 date string (YYYY-MM-DD). */
export const ExpenseSchema = z.object({
  id: z.string(),
  name: z.string(),
  amount: z.number().positive(),
  date: z.string(),
  category: z.string(),
});

/** Array schema used to validate the full expenses list from the API. */
export const ExpenseListSchema = z.array(ExpenseSchema);

export type User = z.infer<typeof UserSchema>;
export type AuthSession = z.infer<typeof AuthSessionSchema>;
export type Expense = z.infer<typeof ExpenseSchema>;
