import { usePage } from '@inertiajs/react';
import { adminLocaleSwitchUrl } from '@/lib/admin-locale-url';
import { AVAILABLE_LOCALES, DEFAULT_LOCALE } from '@/lib/default-locale';
import { useAdminT } from '@/hooks/use-admin-translations';

export function AdminLocaleSwitch() {
    const t = useAdminT();
    const { locale, availableLocales } = usePage().props as {
        locale?: string;
        availableLocales?: string[];
    };
    const currentLocale = locale ?? DEFAULT_LOCALE;
    const locales = availableLocales?.length ? availableLocales : [...AVAILABLE_LOCALES];

    return (
        <div className="ml-auto flex items-center gap-2">
            <span className="hidden text-[11px] font-medium text-muted-foreground sm:inline">
                {t('locale_switch.label')}
            </span>
            <div className="flex items-center gap-1 rounded-full border border-border bg-background/80 px-1 py-0.5 text-[11px] font-medium text-muted-foreground">
                {locales.map((code) => {
                    const isActive = code === currentLocale;
                    return (
                        <a
                            key={code}
                            href={adminLocaleSwitchUrl(code)}
                            className={[
                                'inline-flex h-6 items-center justify-center rounded-full px-2 transition-colors',
                                isActive
                                    ? 'bg-foreground text-background'
                                    : 'hover:bg-muted hover:text-foreground',
                            ].join(' ')}
                            title={t('locale_switch.option_title', { code: code.toUpperCase() })}
                        >
                            {code.toUpperCase()}
                        </a>
                    );
                })}
            </div>
        </div>
    );
}
