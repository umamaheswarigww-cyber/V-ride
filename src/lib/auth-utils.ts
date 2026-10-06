// Centralized V-Ride auth utilities.

/**
 * The official VIT-AP student email domain.
 */
export const VITAP_STUDENT_DOMAIN = "vitapstudent.ac.in";

/**
 * Normalize an email: trim, lowercase, strip leading/trailing dots/spaces.
 * Returns null if the input is not a valid email shape.
 */
export function normalizeEmail(email: string | null | undefined): string | null {
  if (!email) return null;
  const trimmed = email.trim().toLowerCase();
  // Basic email shape validation
  const m = trimmed.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  return m ? trimmed : null;
}

/**
 * Safely extract the domain from a normalized email.
 * Returns null if the email is invalid or has no domain.
 */
export function emailDomain(email: string | null | undefined): string | null {
  const normalized = normalizeEmail(email);
  if (!normalized) return null;
  const at = normalized.lastIndexOf("@");
  if (at < 0) return null;
  return normalized.slice(at + 1);
}

/**
 * Exact-domain check for VIT-AP student status.
 *
 * CRITICAL: This performs a precise domain equality check, NOT a substring
 * check. `user@vitapstudent.ac.in.attacker.com` must NOT be considered a
 * VIT-AP student — only `user@vitapstudent.ac.in` is.
 *
 * @example isVitApStudent("lokesh@vitapstudent.ac.in") → true
 * @example isVitApStudent("lokesh@gmail.com") → false
 * @example isVitApStudent("user@vitapstudent.ac.in.attacker.com") → false
 */
export function isVitApStudent(email: string | null | undefined): boolean {
  const domain = emailDomain(email);
  return domain === VITAP_STUDENT_DOMAIN;
}

/**
 * Returns a friendly display name from a Google profile + email.
 */
export function displayName(name?: string | null, email?: string | null): string {
  if (name && name.trim().length > 0) return name.trim();
  if (email) return email.split("@")[0];
  return "VIT-AP Student";
}

/**
 * Returns initials for avatar fallback.
 */
export function initials(name?: string | null, email?: string | null): string {
  const base = displayName(name, email);
  return base
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}
