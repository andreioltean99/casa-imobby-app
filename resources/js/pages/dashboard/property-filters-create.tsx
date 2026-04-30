import { Head, Link, useForm } from '@inertiajs/react';
import { useMemo } from 'react';
import AppLayout from '@/layouts/app-layout';
import { useAdminT } from '@/hooks/use-admin-translations';
import type { BreadcrumbItem } from '@/types';
import { dashboard } from '@/routes';

const BASE = '/dashboard/property-characteristics';

export default function PropertyFiltersCreate() {
    const t = useAdminT();
    const { data, setData, post, processing, errors } = useForm({
        key: '',
        name_en: '',
        name_ro: '',
        is_active: true,
        is_searchable: true,
        sort_order: '',
    });

    const breadcrumbs: BreadcrumbItem[] = useMemo(
        () => [
            { title: t('breadcrumb.dashboard'), href: dashboard() },
            { title: t('breadcrumb.property_filters'), href: BASE },
            { title: t('breadcrumb.add_property_filter'), href: `${BASE}/create` },
        ],
        [t],
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('meta.add_property_filter')} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between gap-2">
                    <div>
                        <h1 className="text-lg font-semibold">{t('property_filters.create.title')}</h1>
                        <p className="text-sm text-muted-foreground">{t('property_filters.create.description')}</p>
                    </div>
                    <Link href={BASE} className="text-xs font-medium text-muted-foreground hover:text-foreground">
                        {t('common.back')}
                    </Link>
                </div>
                <div className="rounded-xl border border-sidebar-border/70 bg-background p-6 dark:border-sidebar-border">
                    <form onSubmit={(e) => { e.preventDefault(); post(BASE); }} className="max-w-xl space-y-4">
                        <div className="space-y-1">
                            <label className="text-xs font-medium" htmlFor="characteristic_key">
                                {t('property_filters.form.key')}
                            </label>
                            <input id="characteristic_key" value={data.key} onChange={(e) => setData('key', e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))} className="h-9 w-full rounded-md border border-sidebar-border bg-background px-3 text-sm" placeholder={t('property_filters.form.key')} />
                        </div>
                        {errors.key ? <p className="text-xs text-red-500">{errors.key}</p> : null}
                        <div className="space-y-1">
                            <label className="text-xs font-medium" htmlFor="characteristic_name_en">
                                {t('property_filters.form.name_en')}
                            </label>
                            <input id="characteristic_name_en" value={data.name_en} onChange={(e) => setData('name_en', e.target.value)} className="h-9 w-full rounded-md border border-sidebar-border bg-background px-3 text-sm" placeholder={t('property_filters.form.name_en')} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-medium" htmlFor="characteristic_name_ro">
                                {t('property_filters.form.name_ro')}
                            </label>
                            <input id="characteristic_name_ro" value={data.name_ro} onChange={(e) => setData('name_ro', e.target.value)} className="h-9 w-full rounded-md border border-sidebar-border bg-background px-3 text-sm" placeholder={t('property_filters.form.name_ro')} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-medium" htmlFor="characteristic_sort_order">
                                {t('property_filters.form.sort_order')}
                            </label>
                            <input id="characteristic_sort_order" value={data.sort_order} onChange={(e) => setData('sort_order', e.target.value)} className="h-9 w-full rounded-md border border-sidebar-border bg-background px-3 text-sm" placeholder={t('property_filters.form.sort_order')} />
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
