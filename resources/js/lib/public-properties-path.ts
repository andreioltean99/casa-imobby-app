/** Public index of all listings (filters + grid). */
export const PROPERTIES_INDEX_PATH = '/proprietati';

export function propertiesIndexUrl(params?: Record<string, string | null | undefined>): string {
    if (!params) {
        return PROPERTIES_INDEX_PATH;
    }
    const q = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
        if (value !== null && value !== undefined && value !== '') {
            q.set(key, value);
        }
    }
    const s = q.toString();
    return s ? `${PROPERTIES_INDEX_PATH}?${s}` : PROPERTIES_INDEX_PATH;
}
