import { Head, Link, useForm } from '@inertiajs/react';
import { useMemo } from 'react';
import {
    AdminLocalizedNameFields,
    adminLocalizedPrimaryName,
} from '@/components/admin-localized-name-fields';
import AppLayout from '@/layouts/app-layout';
import { useAdminT } from '@/hooks/use-admin-translations';
import type { BreadcrumbItem } from '@/types';
import { dashboard } from '@/routes';

const BASE = '/dashboard/property-characteristics';

type PropertyFilter = {
    id: number;
    name_en: string;
    name_ro: string;
    is_active: boolean;
    is_searchable: boolean;
    sort_order: number;
};

type Props = {
    propertyFilter: PropertyFilter;
};

export default function PropertyFiltersEdit({ propertyFilter }: Props) {
    const t = useAdminT();
    const label = adminLocalizedPrimaryName(propertyFilter.name_ro, propertyFilter.name_en);

    const { data, setData, put, processing, errors } = useForm({
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
            { title: label, href: `${BASE}/${propertyFilter.id}/edit` },
        ],
        [t, label, propertyFilter.id],
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('meta.edit_property_filter', { name: label })} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between gap-2">
                    <div>
                        <h1 className="text-lg font-semibold">{t('property_filters.edit.title')}</h1>
                        <p className="text-sm text-muted-foreground">{label}</p>
                    </div>
                    <Link href={BASE} className="text-xs font-medium text-muted-foreground hover:text-foreground">
                        {t('common.back')}
                    </Link>
                </div>
                <div className="rounded-xl border border-sidebar-border/70 bg-background p-6 dark:border-sidebar-border">
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            put(`${BASE}/${propertyFilter.id}`);
                        }}
                        className="max-w-xl space-y-4"
                    >
                        <AdminLocalizedNameFields
                            idPrefix="characteristic"
                            nameRo={data.name_ro}
                            nameEn={data.name_en}
                            onNameRoChange={(value) => setData('name_ro', value)}
                            onNameEnChange={(value) => setData('name_en', value)}
                            errors={errors}
                            defaultShowEnglish={Boolean(propertyFilter.name_en.trim())}
                        />
                        <div className="space-y-1">
                            <label className="text-xs font-medium" htmlFor="characteristic_sort_order">
                                {t('property_filters.form.sort_order')}
                            </label>
                            <input
                                id="characteristic_sort_order"
                                value={data.sort_order}
                                onChange={(e) => setData('sort_order', e.target.value)}
                                className="h-9 w-full rounded-md border border-sidebar-border bg-background px-3 text-sm"
                            />
                        </div>
                        <label className="flex items-center gap-2 text-xs">
                            <input
                                id="characteristic_is_active"
                                type="checkbox"
                                checked={data.is_active}
                                onChange={(e) => setData('is_active', e.target.checked)}
                            />
                            {t('common.active')}
                        </label>
                        <label className="flex items-center gap-2 text-xs">
                            <input
                                id="characteristic_is_searchable"
                                type="checkbox"
                                checked={data.is_searchable}
                                onChange={(e) => setData('is_searchable', e.target.checked)}
                            />
                            {t('common.searchable')}
                        </label>
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex rounded-md bg-primary px-4 py-1.5 text-xs font-medium text-primary-foreground"
                        >
                            {t('common.save')}
                        </button>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
