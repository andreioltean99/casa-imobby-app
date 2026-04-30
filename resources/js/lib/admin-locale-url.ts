/**
 * Switches Laravel locale for dashboard requests (session + admin_locale cookie).
 * Use this from admin pages so switching works even when Referer is missing.
 */
export function adminLocaleSwitchUrl(locale: string): string {
    const enc = encodeURIComponent(locale);
    return `/lang/${enc}?context=admin`;
}
