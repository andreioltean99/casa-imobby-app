import { usePage } from '@inertiajs/react';
import { useCallback, useMemo } from 'react';

export type AdminTranslations = Record<string, unknown>;

function valueAtPath(obj: unknown, path: string): unknown {
    const parts = path.split('.');
    let cur: unknown = obj;
    for (const p of parts) {
        if (cur === null || typeof cur !== 'object') {
            return undefined;
        }
        cur = (cur as Record<string, unknown>)[p];
    }
    return cur;
}

function applyReplacements(
    template: string,
    replacements?: Record<string, string | number | undefined>,
): string {
    if (!replacements) {
        return template;
    }
    return template.replace(/:([a-zA-Z0-9_]+)/g, (match, key: string) => {
        const v = replacements[key];
        return v === undefined || v === null ? match : String(v);
    });
}

/**
 * Admin UI copy from lang/{locale}/admin.php (shared via Inertia).
 * Keys use dot notation, e.g. t('nav.property_listings').
 */
export function useAdminT(): (key: string, replacements?: Record<string, string | number | undefined>) => string {
    const admin = usePage().props.admin as AdminTranslations | undefined;

    return useCallback(
        (key: string, replacements?: Record<string, string | number | undefined>) => {
            const raw = valueAtPath(admin, key);
            const template = typeof raw === 'string' ? raw : key;
            return applyReplacements(template, replacements);
        },
        [admin],
    );
}

export function useAdminTranslations(): AdminTranslations | undefined {
    const { admin } = usePage().props as { admin?: AdminTranslations };
    return useMemo(() => admin, [admin]);
}
