/** Canonical public site origin (SEO, structured data fallbacks). */
export const SITE_ORIGIN = 'https://agentia-casa-imobby.ro';

export function resolveAppOrigin(appUrl?: string | null): string {
    const trimmed = (appUrl ?? '').trim().replace(/\/+$/, '');
    return trimmed || SITE_ORIGIN;
}

export function absolutePublicUrl(origin: string, path?: string): string {
    if (!path || path.trim() === '') {
        return origin;
    }
    if (/^https?:\/\//i.test(path)) {
        return path;
    }
    const normalized = path.startsWith('/') ? path : `/${path}`;
    return `${origin.replace(/\/+$/, '')}${normalized}`;
}

const JSON_LD_URL_KEYS = new Set(['url', '@id', 'item']);

function normalizeJsonLdValue(value: unknown, origin: string): unknown {
    if (Array.isArray(value)) {
        return value.map((entry) => normalizeJsonLdValue(entry, origin));
    }
    if (value && typeof value === 'object') {
        const record = value as Record<string, unknown>;
        const next: Record<string, unknown> = {};
        for (const [key, child] of Object.entries(record)) {
            if (JSON_LD_URL_KEYS.has(key) && typeof child === 'string') {
                next[key] = absolutePublicUrl(origin, child);
            } else {
                next[key] = normalizeJsonLdValue(child, origin);
            }
        }
        return next;
    }
    return value;
}

export function normalizeJsonLd(
    jsonLd: Record<string, unknown> | Array<Record<string, unknown>>,
    origin: string,
): Record<string, unknown> | Array<Record<string, unknown>> {
    return normalizeJsonLdValue(jsonLd, origin) as
        | Record<string, unknown>
        | Array<Record<string, unknown>>;
}
