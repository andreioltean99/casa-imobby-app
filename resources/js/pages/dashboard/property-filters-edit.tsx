import { Head, Link, useForm } from '@inertiajs/react';
import { useMemo } from 'react';
import AppLayout from '@/layouts/app-layout';
import { useAdminT } from '@/hooks/use-admin-translations';
import type { BreadcrumbItem } from '@/types';
import { dashboard } from '@/routes';

const BASE = '/dashboard/property-characteristics';

type Props = {
    propertyFilter: {
        id: number;
        key: string;
        name_en: string;
        name_ro: string;
        is_active: boolean;
        is_searchable: boolean;
        sort_order: number;
    };
};

export default function PropertyFiltersEdit({ propertyFilter }: Props) {
    const t = useAdminT();
    const { data, setData, put, processing } = useForm({
        name_en: propertyFilter.name_en,
        name_ro: propertyFilter.name_ro,
        is_active: propertyFilter.is_active,
        is_searchable: propertyFilter.is_searchable,
        sort_order: String(propertyFilter.sort_order ?? 0),
    });

    const breadcrumbs: BreadcrumbItem[] = useMemo(
        () => [
            { title: t('breadcrumb.dashboard'), href: dashboard() },
            { title: t('breadcrumb.property_filters'), href: BASE },
            { title: propertyFilter.key, href: `${BASE}/${propertyFilter.id}/edit` },
        ],
        [t, propertyFilter.id, propertyFilter.key],
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('meta.edit_property_filter', { key: propertyFilter.key })} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between gap-2">
                    <h1 className="text-lg font-semibold">{t('property_filters.edit.title')}</h1>
                    <Link href={BASE} className="text-xs font-medium text-muted-foreground hover:text-foreground">{t('common.back')}</Link>
                </div>
                <div className="rounded-xl border border-sidebar-border/70 bg-background p-6 dark:border-sidebar-border">
                    <form onSubmit={(e) => { e.preventDefault(); put(`${BASE}/${propertyFilter.id}`); }} className="max-w-xl space-y-4">
                        <div className="space-y-1">
                            <label className="text-xs font-medium" htmlFor="characteristic_key">
                                {t('property_filters.form.key')}
                            </label>
                            <p id="characteristic_key" className="text-xs text-muted-foreground">{propertyFilter.key}</p>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-medium" htmlFor="characteristic_name_en">
                                {t('property_filters.form.name_en')}
                            </label>
                            <input id="characteristic_name_en" value={data.name_en} onChange={(e) => setData('name_en', e.target.value)} className="h-9 w-full rounded-md border border-sidebar-border bg-background px-3 text-sm" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-medium" htmlFor="characteristic_name_ro">
                                {t('property_filters.form.name_ro')}
                            </label>
                            <input id="characteristic_name_ro" value={data.name_ro} onChange={(e) => setData('name_ro', e.target.value)} className="h-9 w-full rounded-md border border-sidebar-border bg-background px-3 text-sm" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-medium" htmlFor="characteristic_sort_order">
                                {t('property_filters.form.sort_order')}
                            </label>
                            <input id="characteristic_sort_order" value={data.sort_order} onChange={(e) => setData('sort_order', e.target.value)} className="h-9 w-full rounded-md border border-sidebar-border bg-background px-3 text-sm" />
                        </div>
                        <label className="flex items-center gap-2 text-xs"><input id="characteristic_is_active" type="checkbox" checked={data.is_active} onChange={(e) => setData('is_active', e.target.checked)} />{t('common.active')}</label>
                        <label className="flex items-center gap-2 text-xs"><input id="characteristic_is_searchable" type="checkbox" checked={data.is_searchable} onChange={(e) => setData('is_searchable', e.target.checked)} />{t('common.searchable')}</label>
                        <button type="submit" disabled={processing} className="inline-flex rounded-md bg-primary px-4 py-1.5 text-xs font-medium text-primary-foreground">{t('common.save')}</button>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
