/**
 * Utility helpers for formatting telephone links and text.
 */

/**
 * Strips all non-digit and non-plus characters to format a valid RFC 3966 tel: URI.
 * Example: "+91 90000 00001 (demo)" -> "tel:+919000000001"
 */
export function formatTelHref(phone: string | null | undefined): string {
  if (!phone) return "tel:";
  const digitsAndPlus = phone.replace(/[^\d+]/g, "");
  return `tel:${digitsAndPlus}`;
}
