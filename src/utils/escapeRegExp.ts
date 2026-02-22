/**
 * Escapes all RegExp metacharacters in a string so it can be safely
 * used inside `new RegExp(...)` without risk of injection.
 */
export function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
