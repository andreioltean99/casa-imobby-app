import { Head, Link, router, usePage } from '@inertiajs/react';
import { useMemo } from 'react';
import AppLayout from '@/layouts/app-layout';
import { useAdminT } from '@/hooks/use-admin-translations';
import type { BreadcrumbItem } from '@/types';
import { dashboard } from '@/routes';

const BASE = '/dashboard/property-characteristics';

type PropertyFilterRow = {
    id: number;
    key: string;
    name_en: string;
    name_ro: string;
    is_active: boolean;
    is_searchable: boolean;
    sort_order: number;
};

type Props = {
    filters: PropertyFilterRow[];
};

export default function PropertyFiltersIndex({ filters }: Props) {
    const t = useAdminT();
    const { props } = usePage<{ errors?: Record<string, string> }>();
    const deleteError = props.errors?.delete;

    const breadcrumbs: BreadcrumbItem[] = useMemo(
        () => [
            { title: t('breadcrumb.dashboard'), href: dashboard() },
            { title: t('breadcrumb.property_filters'), href: BASE },
        ],
        [t],
    );

    const onDelete = (id: number, key: string) => {
        if (!confirm(t('property_filters.index.delete_confirm', { key }))) {
            return;
        }
        router.delete(`${BASE}/${id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('meta.property_filters')} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {deleteError ? (
                    <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                        {deleteError}
                    </p>
                ) : null}
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                        <h1 className="text-lg font-semibold">{t('property_filters.index.title')}</h1>
                        <p className="text-sm text-muted-foreground">{t('property_filters.index.description')}</p>
                    </div>
                    <Link href={`${BASE}/create`} className="inline-flex items-center rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground shadow-sm hover:bg-primary/90">
                        {t('property_filters.index.add')}
                    </Link>
                </div>

                <div className="overflow-auto rounded-xl border border-sidebar-border/70 bg-background dark:border-sidebar-border">
                    <table className="min-w-full border-collapse text-xs">
                        <thead>
                            <tr className="border-b border-sidebar-border/70 bg-muted/40 text-left text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                                <th className="px-4 py-2">{t('common.key')}</th>
                                <th className="px-4 py-2">{t('common.english')}</th>
                                <th className="px-4 py-2">{t('common.romanian')}</th>
                                <th className="px-4 py-2">{t('common.active')}</th>
                                <th className="px-4 py-2">{t('common.searchable')}</th>
                                <th className="px-4 py-2 text-right">{t('common.actions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filters.map((f) => (
                                <tr key={f.id} className="border-b border-sidebar-border/50 hover:bg-muted/30">
                                    <td className="px-4 py-2 font-mono text-[11px]">{f.key}</td>
                                    <td className="px-4 py-2 text-sm">{f.name_en}</td>
                                    <td className="px-4 py-2 text-sm">{f.name_ro}</td>
                                    <td className="px-4 py-2">{f.is_active ? t('common.yes') : t('common.no')}</td>
                                    <td className="px-4 py-2">{f.is_searchable ? t('common.yes') : t('common.no')}</td>
                                    <td className="px-4 py-2 text-right">
                                        <Link href={`${BASE}/${f.id}/edit`} className="text-primary hover:underline">
                                            {t('common.edit')}
                                        </Link>
                                        {' · '}
                                        <button type="button" onClick={() => onDelete(f.id, f.key)} className="text-destructive hover:underline">
                                            {t('common.delete')}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
