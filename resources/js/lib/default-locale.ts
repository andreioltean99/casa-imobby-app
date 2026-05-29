/** Must match config/app.php `locale` and `available_locales`. */
export const DEFAULT_LOCALE = 'ro';

export const AVAILABLE_LOCALES = ['ro', 'en'] as const;

export type AppLocale = (typeof AVAILABLE_LOCALES)[number];
