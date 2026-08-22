/**
 * Route-level auth guards for TanStack Router `beforeLoad`.
 *
 * These run OUTSIDE React (no hooks), so they read localStorage
 * directly via `getStoredAuth()`.
 *
 * Usage inside a route file:
 *   import { requireAuth } from "@/lib/auth-guard";
 *   export const Route = createFileRoute("/payroll")({
 *     beforeLoad: () => requireAuth(),
 *     component: PayrollPage,
 *   });
 */

import { redirect } from "@tanstack/react-router";
import { getStoredAuth } from "./auth";

/**
 * Require any authenticated user.
 * Redirects to /login if no valid token is stored.
 */
export function requireAuth() {
  const { token, user } = getStoredAuth();

  if (!token || !user) {
    throw redirect({ to: "/login" });
  }

  return { token, user };
}

/**
 * Require the HR_ADMIN role.
 * Redirects to / if the user is authenticated but not HR.
 */
export function requireHR() {
  const auth = requireAuth(); // first check login

  if (auth.user.role !== "HR_ADMIN") {
    throw redirect({ to: "/" });
  }

  return auth;
}

/**
 * If the user is already logged in, bounce them away from /login.
 */
export function redirectIfAuthenticated() {
  const { token, user } = getStoredAuth();

  if (token && user) {
    throw redirect({
      to: user.role === "HR_ADMIN" ? "/admin" : "/",
    });
  }
}
