import { Head, Link, router, usePage } from '@inertiajs/react';
import { useMemo } from 'react';
import { AdminLocalizedNameCell, adminLocalizedPrimaryName } from '@/components/admin-localized-name-fields';
import AppLayout from '@/layouts/app-layout';
import { useAdminT } from '@/hooks/use-admin-translations';
import type { BreadcrumbItem } from '@/types';
import { dashboard } from '@/routes';

const LISTING_CATEGORIES_BASE = '/dashboard/listing-categories';

type CategoryRow = {
    id: number;
    name_en: string;
    name_ro: string;
    sort_order: number;
    is_active: boolean;
};

type Props = {
    categories: CategoryRow[];
};

export default function ListingCategoriesIndex({ categories }: Props) {
    const t = useAdminT();
    const { props } = usePage<{ errors?: Record<string, string> }>();
    const deleteError = props.errors?.delete;

    const breadcrumbs: BreadcrumbItem[] = useMemo(
        () => [
            { title: t('breadcrumb.dashboard'), href: dashboard() },
            { title: t('breadcrumb.listing_categories'), href: LISTING_CATEGORIES_BASE },
        ],
        [t],
    );

    const onDelete = (id: number, name: string) => {
        if (!confirm(t('listing_categories.index.delete_confirm', { name }))) {
            return;
        }
        router.delete(`${LISTING_CATEGORIES_BASE}/${id}`);
    };

    const countLabel =
        categories.length === 1
            ? t('listing_categories.index.count_one', { count: categories.length })
            : t('listing_categories.index.count_many', { count: categories.length });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('meta.listing_categories')} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {deleteError ? (
                    <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                        {deleteError}
                    </p>
                ) : null}

                <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                        <h1 className="text-lg font-semibold">{t('listing_categories.index.title')}</h1>
                        <p className="text-sm text-muted-foreground">{t('listing_categories.index.description')}</p>
                    </div>
                    <Link
                        href={`${LISTING_CATEGORIES_BASE}/create`}
                        className="inline-flex items-center rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground shadow-sm hover:bg-primary/90"
                    >
                        {t('listing_categories.index.add')}
                    </Link>
                </div>

                <div className="relative flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 bg-background dark:border-sidebar-border">
                    <div className="border-b border-sidebar-border/70 px-4 py-3 text-xs font-medium text-muted-foreground">
                        {countLabel}
                    </div>
                    <div className="overflow-auto">
                        <table className="min-w-full border-collapse text-xs">
                            <thead>
                                <tr className="border-b border-sidebar-border/70 bg-muted/40 text-left text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                                    <th className="px-4 py-2">{t('common.name')}</th>
                                    <th className="w-20 px-4 py-2">{t('common.order')}</th>
                                    <th className="w-24 px-4 py-2">{t('common.active')}</th>
                                    <th className="w-36 px-4 py-2 text-right">{t('common.actions')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-4 py-6 text-center text-muted-foreground">
                                            {t('listing_categories.index.empty')}
                                        </td>
                                    </tr>
                                ) : (
                                    categories.map((c) => (
                                        <tr
                                            key={c.id}
                                            className="border-b border-sidebar-border/50 hover:bg-muted/30"
                                        >
                                            <td className="max-w-[16rem] px-4 py-2">
                                                <AdminLocalizedNameCell nameRo={c.name_ro} nameEn={c.name_en} />
                                            </td>
                                            <td className="px-4 py-2 text-muted-foreground">{c.sort_order}</td>
                                            <td className="px-4 py-2">
                                                {c.is_active ? (
                                                    <span className="inline-flex rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-300">
                                                        {t('common.yes')}
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex rounded-full bg-neutral-500/10 px-2 py-0.5 text-[11px] font-medium text-neutral-600 dark:text-neutral-300">
                                                        {t('common.no')}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-4 py-2 text-right">
                                                <Link
                                                    href={`${LISTING_CATEGORIES_BASE}/${c.id}/edit`}
                                                    className="text-primary hover:underline"
                                                >
                                                    {t('common.edit')}
                                                </Link>
                                                {' · '}
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        onDelete(
                                                            c.id,
                                                            adminLocalizedPrimaryName(c.name_ro, c.name_en) ||
                                                                String(c.id),
                                                        )
                                                    }
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
