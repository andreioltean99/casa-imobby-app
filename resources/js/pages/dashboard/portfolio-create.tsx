import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { ListingTypeSelector } from '@/components/dashboard/ListingTypeSelector';
import {
    PropertyCharacteristicsFields,
    type PropertyFilterRow,
} from '@/components/dashboard/PropertyCharacteristicsFields';
import { TinyTextEditor } from '@/components/tiny-text-editor';
import { useAdminT } from '@/hooks/use-admin-translations';
import { usePortfolioFormOptions } from '@/hooks/use-portfolio-form-options';
import type { BreadcrumbItem } from '@/types';
import { dashboard } from '@/routes';
import type { ListingCategoryOption } from '@/lib/portfolioListingCategories';
import type { PropertyFilterOption } from '@/hooks/use-portfolio-form-options';

type Props = {
    listingCategoryOptions?: ListingCategoryOption[];
    propertyFilterOptions?: PropertyFilterOption[];
};

export default function DashboardPortfolioCreate({
    listingCategoryOptions: listingCategoryOptionsProp = [],
    propertyFilterOptions: propertyFilterOptionsProp = [],
}: Props) {
    const t = useAdminT();
    const [propertyFilterRows, setPropertyFilterRows] = useState<PropertyFilterRow[]>([
        { property_filter_id: '', value: '' },
    ]);

    const { data, setData, post, processing, errors } = useForm<{
        title: string;
        short_description: string;
        description: string;
        price: string;
        is_published: boolean;
        external_storia_url: string;
        external_imobiliare_url: string;
        external_olx_url: string;
        listing_category: string;
        zone: string;
        pinned_home: boolean;
        pinned_home_order: string;
        image: File | null;
        gallery_images: File[];
    }>({
        title: '',
        short_description: '',
        description: '',
        price: '',
        is_published: true,
        sort_order: '',
        external_storia_url: '',
        external_imobiliare_url: '',
        external_olx_url: '',
        listing_category: 'apartment_sale',
        zone: '',
        pinned_home: false,
        pinned_home_order: '',
        image: null,
        gallery_images: [],
    });

    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);

    useEffect(() => {
        if (!data.image) {
            setImagePreview(null);
            return;
        }
        const url = URL.createObjectURL(data.image);
        setImagePreview(url);
        return () => URL.revokeObjectURL(url);
    }, [data.image]);

    useEffect(() => {
        if (!data.gallery_images || data.gallery_images.length === 0) {
            setGalleryPreviews([]);
            return;
        }

        const urls = data.gallery_images.map((file) => URL.createObjectURL(file));
        setGalleryPreviews(urls);

        return () => {
            urls.forEach((url) => URL.revokeObjectURL(url));
        };
    }, [data.gallery_images]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/dashboard/portfolio', {
            forceFormData: true,
            transform: (form) => ({
                ...form,
                property_filters_json: JSON.stringify(
                    propertyFilterRows
                        .map((row) => ({ property_filter_id: Number(row.property_filter_id), value: row.value.trim() }))
                        .filter((row) => row.property_filter_id > 0 && row.value !== ''),
                ),
            }),
        });
    };

    const { props } = usePage<{
        listingCategoryOptions?: ListingCategoryOption[];
        propertyFilterOptions?: PropertyFilterOption[];
        portfolioListingAdmin?: {
            pinnedHomeLabel: string;
            pinnedHomeOrderLabel: string;
        };
    }>();
    const listingAdmin = props.portfolioListingAdmin;
    const {
        propertyFilterOptions,
        listingCategoryOptions,
        optionsLoading,
        optionsError,
        refreshOnDropdownFocus,
    } = usePortfolioFormOptions({
        propertyFilterOptions:
            propertyFilterOptionsProp.length > 0
                ? propertyFilterOptionsProp
                : props.propertyFilterOptions,
        listingCategoryOptions:
            listingCategoryOptionsProp.length > 0
                ? listingCategoryOptionsProp
                : props.listingCategoryOptions,
    });

    const breadcrumbs: BreadcrumbItem[] = useMemo(
        () => [
            { title: t('breadcrumb.dashboard'), href: dashboard() },
            { title: t('breadcrumb.property_listings'), href: '/dashboard/portfolio' },
            { title: t('breadcrumb.add_listing'), href: '/dashboard/portfolio/create' },
        ],
        [t],
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('meta.add_listing')} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between gap-2">
                    <div>
                        <h1 className="text-lg font-semibold">{t('portfolio.create.title')}</h1>
                        <p className="text-sm text-muted-foreground">{t('portfolio.create.description')}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link
                            href="/dashboard/portfolio"
                            className="text-xs font-medium text-muted-foreground hover:text-foreground"
                        >
                            {t('portfolio.create.back')}
                        </Link>
                    </div>
                </div>

                <div className="relative flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 bg-background p-6 text-sm dark:border-sidebar-border">
                    <form onSubmit={submit} className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-xs font-medium" htmlFor="title">
                                {t('portfolio.form.title')}
                            </label>
                            <input
                                id="title"
                                type="text"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                className="h-9 w-full rounded-md border border-sidebar-border bg-background px-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                                required
                            />
                            {errors.title && (
                                <p className="text-xs text-red-500">{errors.title}</p>
                            )}
                        </div>
                        <ListingTypeSelector
                            value={data.listing_category}
                            onChange={(key) => setData('listing_category', key)}
                            categoryOptions={listingCategoryOptions}
                            error={errors.listing_category}
                            optionsLoading={optionsLoading}
                            onSelectFocus={refreshOnDropdownFocus}
                        />
                        <div className="space-y-1">
                            <label className="text-xs font-medium" htmlFor="short_description">
                                {t('portfolio.form.short_description')}
                            </label>
                            <textarea
                                id="short_description"
                                value={data.short_description}
                                onChange={(e) => setData('short_description', e.target.value)}
                                rows={2}
                                className="w-full rounded-md border border-sidebar-border bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                            />
                            {errors.short_description && (
                                <p className="text-xs text-red-500">{errors.short_description}</p>
                            )}
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-medium" htmlFor="description">
                                {t('portfolio.form.description')}
                            </label>
                            <TinyTextEditor
                                id="description"
                                value={data.description}
                                onChange={(value) => setData('description', value)}
                                className="rounded-md border border-sidebar-border/70 bg-background p-2"
                            />
                            {errors.description && (
                                <p className="text-xs text-red-500">{errors.description}</p>
                            )}
                        </div>
                        <PropertyCharacteristicsFields
                            rows={propertyFilterRows}
                            onRowsChange={setPropertyFilterRows}
                            options={propertyFilterOptions}
                            loading={optionsLoading}
                            loadError={optionsError}
                            onSelectFocus={refreshOnDropdownFocus}
                        />
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            <div className="space-y-1">
                                <label className="text-xs font-medium" htmlFor="external_storia_url">
                                    {t('portfolio.form.storia_url')}
                                </label>
                                <input
                                    id="external_storia_url"
                                    type="url"
                                    inputMode="url"
                                    value={data.external_storia_url}
                                    onChange={(e) => setData('external_storia_url', e.target.value)}
                                    placeholder="https://www.storia.ro/…"
                                    className="h-9 w-full rounded-md border border-sidebar-border bg-background px-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                                />
                                {errors.external_storia_url && (
                                    <p className="text-xs text-red-500">{errors.external_storia_url}</p>
                                )}
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-medium" htmlFor="external_imobiliare_url">
                                    {t('portfolio.form.imobiliare_url')}
                                </label>
                                <input
                                    id="external_imobiliare_url"
                                    type="url"
                                    inputMode="url"
                                    value={data.external_imobiliare_url}
                                    onChange={(e) => setData('external_imobiliare_url', e.target.value)}
                                    placeholder="https://www.imobiliare.ro/…"
                                    className="h-9 w-full rounded-md border border-sidebar-border bg-background px-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                                />
                                {errors.external_imobiliare_url && (
                                    <p className="text-xs text-red-500">{errors.external_imobiliare_url}</p>
                                )}
                            </div>
                            <div className="space-y-1 sm:col-span-2 lg:col-span-1">
                                <label className="text-xs font-medium" htmlFor="external_olx_url">
                                    {t('portfolio.form.olx_url')}
                                </label>
                                <input
                                    id="external_olx_url"
                                    type="url"
                                    inputMode="url"
                                    value={data.external_olx_url}
                                    onChange={(e) => setData('external_olx_url', e.target.value)}
                                    placeholder="https://www.olx.ro/d/oferta/…"
                                    className="h-9 w-full rounded-md border border-sidebar-border bg-background px-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                                />
                                {errors.external_olx_url && (
                                    <p className="text-xs text-red-500">{errors.external_olx_url}</p>
                                )}
                            </div>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-1">
                                <label className="text-xs font-medium" htmlFor="zone">
                                    Oras / zona
                                </label>
                                <input
                                    id="zone"
                                    type="text"
                                    value={data.zone}
                                    onChange={(e) => setData('zone', e.target.value)}
                                    placeholder="ex. Cluj-Napoca, Buna Ziua"
                                    className="h-9 w-full rounded-md border border-sidebar-border bg-background px-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                                />
                                {errors.zone && <p className="text-xs text-red-500">{errors.zone}</p>}
                            </div>
                            <div className="space-y-2">
                                <label className="flex cursor-pointer items-center gap-2 text-xs font-medium">
                                    <input
                                        type="checkbox"
                                        checked={data.pinned_home}
                                        onChange={(e) => setData('pinned_home', e.target.checked)}
                                        className="h-4 w-4 rounded border-sidebar-border"
                                    />
                                    {listingAdmin?.pinnedHomeLabel ?? 'Pin to homepage'}
                                </label>
                                <div className="space-y-1">
                                    <label className="text-xs font-medium" htmlFor="pinned_home_order">
                                        {listingAdmin?.pinnedHomeOrderLabel ?? 'Pin order'}
                                    </label>
                                    <input
                                        id="pinned_home_order"
                                        type="number"
                                        min={0}
                                        max={9999}
                                        value={data.pinned_home_order}
                                        onChange={(e) => setData('pinned_home_order', e.target.value)}
                                        disabled={!data.pinned_home}
                                        className="h-9 w-full max-w-[140px] rounded-md border border-sidebar-border bg-background px-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50"
                                    />
                                    {errors.pinned_home_order && (
                                        <p className="text-xs text-red-500">{errors.pinned_home_order}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-medium" htmlFor="price">
                                {t('portfolio.form.price')}
                            </label>
                            <input
                                id="price"
                                type="number"
                                inputMode="decimal"
                                min={0}
                                step="0.01"
                                required
                                value={data.price}
                                onChange={(e) => setData('price', e.target.value)}
                                placeholder={t('portfolio.form.price_ph')}
                                className="h-9 w-full max-w-xs rounded-md border border-sidebar-border bg-background px-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                            />
                            {errors.price && <p className="text-xs text-red-500">{errors.price}</p>}
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-medium" htmlFor="is_published">
                                {t('common.published_field')}
                            </label>
                            <select
                                id="is_published"
                                value={data.is_published ? '1' : '0'}
                                onChange={(e) =>
                                    setData('is_published', e.target.value === '1')
                                }
                                className="h-9 w-full max-w-xs rounded-md border border-sidebar-border bg-background px-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                            >
                                <option value="1">{t('common.yes')}</option>
                                <option value="0">{t('common.no')}</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-medium" htmlFor="image">
                                {t('portfolio.form.image')}
                            </label>
                            <input
                                id="image"
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                    setData('image', e.target.files?.[0] ?? null)
                                }
                                className="block w-full text-xs text-muted-foreground file:mr-2 file:rounded-md file:border file:border-sidebar-border file:bg-muted file:px-2 file:py-1 file:text-xs file:font-medium file:text-foreground hover:file:bg-muted/80"
                            />
                            {imagePreview && (
                                <div className="mt-2">
                                    <p className="mb-1 text-xs text-muted-foreground">
                                        {t('common.preview')}:
                                    </p>
                                    <div className="overflow-hidden rounded-md border border-sidebar-border/70 bg-muted w-24 h-24">
                                        <img
                                            src={imagePreview}
                                            alt={t('portfolio.form.image_alt_preview')}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                </div>
                            )}
                            {errors.image && (
                                <p className="text-xs text-red-500">{errors.image}</p>
                            )}
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-medium" htmlFor="gallery_images">
                                {t('portfolio.form.gallery')}
                            </label>
                            <input
                                id="gallery_images"
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={(e) =>
                                    setData(
                                        'gallery_images',
                                        e.target.files ? Array.from(e.target.files) : [],
                                    )
                                }
                                className="block w-full text-xs text-muted-foreground file:mr-2 file:rounded-md file:border file:border-sidebar-border file:bg-muted file:px-2 file:py-1 file:text-xs file:font-medium file:text-foreground hover:file:bg-muted/80"
                            />
                            {errors.gallery_images && (
                                <p className="text-xs text-red-500">{errors.gallery_images}</p>
                            )}
                            {errors['gallery_images.0'] && (
                                <p className="text-xs text-red-500">{errors['gallery_images.0']}</p>
                            )}
                            {data.gallery_images.length > 0 && (
                                <div className="space-y-2">
                                    <p className="text-xs text-muted-foreground">
                                        {t('portfolio.form.gallery_selected', {
                                            count: data.gallery_images.length,
                                        })}
                                    </p>
                                    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
                                        {galleryPreviews.map((src, index) => (
                                            <div
                                                key={`${src}-${index}`}
                                                className="overflow-hidden rounded-md border border-sidebar-border/70 bg-muted"
                                            >
                                                <img
                                                    src={src}
                                                    alt={t('portfolio.form.gallery_alt', { num: index + 1 })}
                                                    className="h-16 w-full object-cover"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="flex justify-end gap-2 pt-2">
                            <Link
                                href="/dashboard/portfolio"
                                className="inline-flex items-center rounded-md border border-sidebar-border bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
                            >
                                {t('common.cancel')}
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center rounded-md bg-primary px-4 py-1.5 text-xs font-medium text-primary-foreground shadow-sm hover:bg-primary/90 disabled:opacity-60"
                            >
                                {t('portfolio.form.save_listing')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
