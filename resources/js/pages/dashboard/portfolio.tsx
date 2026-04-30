import { Head, Link, router, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { useAdminT } from '@/hooks/use-admin-translations';
import type { BreadcrumbItem } from '@/types';
import { dashboard } from '@/routes';

type PortfolioRow = {
    id: number;
    title: string;
    description: string | null;
    image_path: string | null;
    date: string | null;
    duration: string | null;
    is_published: boolean;
    sort_order: number | null;
    listing_category?: string | null;
    pinned_home?: boolean;
};

type Props = {
    portfolioItems: PortfolioRow[];
    characteristicFilters?: Array<{
        key: string;
        label: string;
    }>;
    characteristicFilterState?: Record<string, string | null>;
    searchQuery?: string | null;
};

export default function DashboardPortfolio({
    portfolioItems,
    characteristicFilters = [],
    characteristicFilterState = {},
    searchQuery = null,
}: Props) {
    const t = useAdminT();
    const [characteristicSearch, setCharacteristicSearch] = useState('');
    const [filtersVisible, setFiltersVisible] = useState(true);
    const { props } = usePage<{
        portfolioListingAdmin?: {
            categoryLabel: string;
            categoryTitles: Record<string, string>;
        };
    }>();
    const listingAdmin = props.portfolioListingAdmin;
    const categoryTitles = listingAdmin?.categoryTitles;

    const breadcrumbs: BreadcrumbItem[] = useMemo(
        () => [
            { title: t('breadcrumb.dashboard'), href: dashboard() },
            { title: t('breadcrumb.property_listings'), href: '/dashboard/portfolio' },
        ],
        [t],
    );

    const deleteItem = (id: number) => {
        if (!confirm(t('portfolio.index.delete_confirm'))) return;
        router.delete(`/dashboard/portfolio/${id}`);
    };

    const countLabel =
        portfolioItems.length === 1
            ? t('portfolio.index.count_one', { count: portfolioItems.length })
            : t('portfolio.index.count_many', { count: portfolioItems.length });

    const visibleCharacteristicFilters = useMemo(() => {
        const needle = characteristicSearch.trim().toLowerCase();
        if (needle === '') {
            return characteristicFilters;
        }

        return characteristicFilters.filter((filter) =>
            filter.label.toLowerCase().includes(needle),
        );
    }, [characteristicFilters, characteristicSearch]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('meta.property_listings')} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between gap-2">
                    <div>
                        <h1 className="text-lg font-semibold">{t('portfolio.index.title')}</h1>
                        <p className="text-sm text-muted-foreground">{t('portfolio.index.description')}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link
                            href="/dashboard/portfolio/create"
                            className="inline-flex items-center rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground shadow-sm hover:bg-primary/90"
                        >
                            {t('portfolio.index.add_listing')}
                        </Link>
                    </div>
                </div>

                <form
                    method="get"
                    action="/dashboard/portfolio"
                    className="rounded-xl border border-sidebar-border/70 bg-background p-4 dark:border-sidebar-border"
                >
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                        <label className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                            Filtre proprietăți
                        </label>
                        <button
                            type="button"
                            onClick={() => setFiltersVisible((v) => !v)}
                            className="inline-flex items-center rounded-md border border-sidebar-border bg-background px-2.5 py-1 text-[11px] font-medium hover:bg-muted"
                        >
                            {filtersVisible ? 'Ascunde filtrele' : 'Afișează filtrele'}
                        </button>
                    </div>

                    {filtersVisible ? (
                        <div className="space-y-3">
                            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                <div className="space-y-1">
                                    <label className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                                        Titlu proprietate
                                    </label>
                                    <input
                                        type="text"
                                        name="q"
                                        defaultValue={searchQuery ?? ''}
                                        placeholder="Caută după titlu…"
                                        className="h-9 w-full rounded-md border border-sidebar-border bg-background px-2 text-xs"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                                        Caută caracteristică
                                    </label>
                                    <input
                                        type="text"
                                        value={characteristicSearch}
                                        onChange={(e) => setCharacteristicSearch(e.target.value)}
                                        placeholder="ex. camere, finisaj…"
                                        className="h-9 w-full rounded-md border border-sidebar-border bg-background px-2 text-xs"
                                    />
                                </div>
                            </div>

                            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {visibleCharacteristicFilters.map((filter) => (
                                    <div key={filter.key} className="space-y-1">
                                        <label className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                                            {filter.label}
                                        </label>
                                        <input
                                            type="text"
                                            name={`cf_${filter.key}`}
                                            defaultValue={characteristicFilterState[filter.key] ?? ''}
                                            placeholder={`Caută după ${filter.label.toLowerCase()}…`}
                                            className="h-9 w-full rounded-md border border-sidebar-border bg-background px-2 text-xs"
                                        />
                                    </div>
                                ))}
                            </div>

                            {characteristicFilters.length > 0 && visibleCharacteristicFilters.length === 0 ? (
                                <p className="text-xs text-muted-foreground">
                                    Nu am găsit caracteristici care să se potrivească textului introdus.
                                </p>
                            ) : null}
                        </div>
                    ) : null}
                    {characteristicFilters.length === 0 ? (
                        <p className="mt-3 text-xs text-muted-foreground">
                            Nu există încă valori pe caracteristici pentru limba selectată.
                        </p>
                    ) : null}
                    <div className="mt-3 flex items-center gap-2">
                        <button
                            type="submit"
                            className="inline-flex items-center rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground shadow-sm hover:bg-primary/90"
                        >
                            Caută
                        </button>
                        <Link
                            href="/dashboard/portfolio"
                            className="inline-flex items-center rounded-md border border-sidebar-border bg-background px-3 py-1.5 text-xs font-medium hover:bg-muted"
                        >
                            Resetează
                        </Link>
                    </div>
                </form>

                <div className="relative flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 bg-background dark:border-sidebar-border">
                    <div className="border-b border-sidebar-border/70 px-4 py-3 text-xs font-medium text-muted-foreground">
                        {countLabel}
                    </div>
                    <div className="overflow-auto">
                        <table className="min-w-full border-collapse text-xs">
                            <thead>
                                <tr className="border-b border-sidebar-border/70 bg-muted/40 text-left text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                                    <th className="px-4 py-2">{t('common.title')}</th>
                                    <th className="w-36 px-4 py-2">{t('common.category')}</th>
                                    <th className="w-16 px-4 py-2">{t('common.pin')}</th>
                                    <th className="w-24 px-4 py-2">{t('common.published_field')}</th>
                                    <th className="w-20 px-4 py-2">{t('common.order')}</th>
                                    <th className="w-32 px-4 py-2 text-right">{t('common.actions')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {portfolioItems.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="px-4 py-6 text-center text-muted-foreground"
                                        >
                                            {t('portfolio.index.empty')}
                                        </td>
                                    </tr>
                                ) : (
                                    portfolioItems.map((item) => (
                                        <tr
                                            key={item.id}
                                            className="border-b border-sidebar-border/50 hover:bg-muted/30"
                                        >
                                            <td className="max-w-md truncate px-4 py-2">
                                                {item.title}
                                            </td>
                                            <td className="max-w-[16rem] px-4 py-2 text-[11px] leading-snug text-muted-foreground">
                                                {item.listing_category
                                                    ? (categoryTitles?.[item.listing_category] ??
                                                      item.listing_category)
                                                    : t('common.dash')}
                                            </td>
                                            <td className="px-4 py-2 text-muted-foreground">
                                                {item.pinned_home
                                                    ? t('portfolio.index.pin_yes')
                                                    : t('portfolio.index.pin_dash')}
                                            </td>
                                            <td className="px-4 py-2">
                                                {item.is_published ? (
                                                    <span className="inline-flex rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-300">
                                                        {t('portfolio.index.status_published')}
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex rounded-full bg-neutral-500/10 px-2 py-0.5 text-[11px] font-medium text-neutral-600 dark:text-neutral-300">
                                                        {t('portfolio.index.status_hidden')}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-4 py-2 text-muted-foreground">
                                                {item.sort_order ?? '–'}
                                            </td>
                                            <td className="px-4 py-2 text-right">
                                                <Link
                                                    href={`/dashboard/portfolio/${item.id}/edit`}
                                                    className="text-primary hover:underline"
                                                >
                                                    {t('common.edit')}
                                                </Link>
                                                {' · '}
                                                <button
                                                    type="button"
                                                    onClick={() => deleteItem(item.id)}
                                                    className="text-destructive hover:underline"
                                                >
                                                    {t('common.delete')}
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
