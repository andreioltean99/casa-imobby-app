import { Head, Link, useForm } from '@inertiajs/react';
import { useMemo } from 'react';
import { AdminLocalizedNameFields } from '@/components/admin-localized-name-fields';
import AppLayout from '@/layouts/app-layout';
import { useAdminT } from '@/hooks/use-admin-translations';
import type { BreadcrumbItem } from '@/types';
import { dashboard } from '@/routes';

const LISTING_CATEGORIES_BASE = '/dashboard/listing-categories';

export default function ListingCategoriesCreate() {
    const t = useAdminT();
    const { data, setData, post, processing, errors } = useForm<{
        name_en: string;
        name_ro: string;
        is_active: boolean;
    }>({
        name_en: '',
        name_ro: '',
        is_active: true,
    });

    const breadcrumbs: BreadcrumbItem[] = useMemo(
        () => [
            { title: t('breadcrumb.dashboard'), href: dashboard() },
            { title: t('breadcrumb.listing_categories'), href: LISTING_CATEGORIES_BASE },
            { title: t('breadcrumb.add_category'), href: `${LISTING_CATEGORIES_BASE}/create` },
        ],
        [t],
    );

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(LISTING_CATEGORIES_BASE);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('meta.add_listing_category')} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between gap-2">
                    <div>
                        <h1 className="text-lg font-semibold">{t('listing_categories.create.title')}</h1>
                        <p className="text-sm text-muted-foreground">{t('listing_categories.create.description')}</p>
                    </div>
                    <Link
                        href={LISTING_CATEGORIES_BASE}
                        className="text-xs font-medium text-muted-foreground hover:text-foreground"
                    >
                        {t('listing_categories.create.back')}
                    </Link>
                </div>

                <div className="relative flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 bg-background p-6 text-sm dark:border-sidebar-border">
                    <form onSubmit={submit} className="max-w-xl space-y-4">
                        <AdminLocalizedNameFields
                            idPrefix="listing_category"
                            nameRo={data.name_ro}
                            nameEn={data.name_en}
                            onNameRoChange={(value) => setData('name_ro', value)}
                            onNameEnChange={(value) => setData('name_en', value)}
                            errors={errors}
                        />
                        <div className="space-y-1">
                            <label className="text-xs font-medium" htmlFor="is_active">
                                {t('common.active')}
                            </label>
                            <select
                                id="is_active"
                                value={data.is_active ? '1' : '0'}
                                onChange={(e) => setData('is_active', e.target.value === '1')}
                                className="h-9 w-full max-w-xs rounded-md border border-sidebar-border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary"
                            >
                                <option value="1">{t('common.yes')}</option>
                                <option value="0">{t('common.no')}</option>
                            </select>
                        </div>
                        <div className="flex justify-end gap-2 pt-2">
                            <Link
                                href={LISTING_CATEGORIES_BASE}
                                className="inline-flex items-center rounded-md border border-sidebar-border bg-background px-3 py-1.5 text-xs font-medium hover:bg-muted"
                            >
                                {t('common.cancel')}
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center rounded-md bg-primary px-4 py-1.5 text-xs font-medium text-primary-foreground shadow-sm hover:bg-primary/90 disabled:opacity-60"
                            >
                                {t('listing_categories.create.submit')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
