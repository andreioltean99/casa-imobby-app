import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { TinyTextEditor } from '@/components/tiny-text-editor';
import { useAdminT } from '@/hooks/use-admin-translations';
import type { BreadcrumbItem } from '@/types';
import { dashboard } from '@/routes';
import type { ListingCategoryOption } from '@/lib/portfolioListingCategories';

type GalleryImage = {
    id: number;
    image_path: string;
    sort_order: number | null;
};

type SpecRow = { label: string; value: string };
type PropertyFilterRow = { property_filter_id: string; value: string };
type PropertyFilterOption = { id: number; key: string; label: string; is_searchable: boolean; is_active: boolean };

type PortfolioItem = {
    id: number;
    title: string;
    slug?: string;
    short_description?: string | null;
    description: string | null;
    listing_specs?: SpecRow[] | null;
    external_storia_url?: string | null;
    external_imobiliare_url?: string | null;
    external_olx_url?: string | null;
    image_path: string | null;
    date: string | null;
    price?: string | number | null;
    is_published: boolean;
    sort_order: number | null;
    listing_category?: string | null;
    zone?: string | null;
    pinned_home?: boolean;
    pinned_home_order?: number | null;
    gallery?: GalleryImage[];
    property_filter_values?: Array<{
        property_filter_id: number;
        value: string;
    }>;
};

function initialSpecRows(listing_specs: unknown): SpecRow[] {
    if (!Array.isArray(listing_specs) || listing_specs.length === 0) {
        return [{ label: '', value: '' }];
    }
    return listing_specs.map((row) => ({
        label: typeof row === 'object' && row && 'label' in row ? String((row as { label: unknown }).label ?? '') : '',
        value: typeof row === 'object' && row && 'value' in row ? String((row as { value: unknown }).value ?? '') : '',
    }));
}

type Props = {
    portfolioItem: PortfolioItem;
    listingCategoryOptions?: ListingCategoryOption[];
    propertyFilterOptions?: PropertyFilterOption[];
};

function listingCategoryOptionsFromTitles(
    titles: Record<string, string> | undefined,
): ListingCategoryOption[] {
    if (!titles) {
        return [];
    }
    return Object.entries(titles).map(([value, label]) => ({ value, label }));
}

export default function DashboardPortfolioEdit({
    portfolioItem,
    listingCategoryOptions: listingCategoryOptionsProp = [],
    propertyFilterOptions = [],
}: Props) {
    const t = useAdminT();
    const { props } = usePage<{
        errors?: Record<string, string | string[]>;
        listingCategoryOptions?: ListingCategoryOption[];
        portfolioListingAdmin?: {
            categoryLabel: string;
            categoryPlaceholder: string;
            pinnedHomeLabel: string;
            pinnedHomeOrderLabel: string;
            categoryTitles: Record<string, string>;
        };
    }>();
    const listingAdmin = props.portfolioListingAdmin;
    const fromInertiaPage = props.listingCategoryOptions ?? [];
    const listingCategoryOptions =
        listingCategoryOptionsProp.length > 0
            ? listingCategoryOptionsProp
            : fromInertiaPage.length > 0
              ? fromInertiaPage
              : listingCategoryOptionsFromTitles(listingAdmin?.categoryTitles);

    const breadcrumbs: BreadcrumbItem[] = useMemo(
        () => [
            { title: t('breadcrumb.dashboard'), href: dashboard() },
            { title: t('breadcrumb.property_listings'), href: '/dashboard/portfolio' },
            {
                title: portfolioItem.title,
                href: `/dashboard/portfolio/${portfolioItem.id}/edit`,
            },
        ],
        [t, portfolioItem.title, portfolioItem.id],
    );

    const [specRows, setSpecRows] = useState<SpecRow[]>(() => initialSpecRows(portfolioItem.listing_specs));
    const [propertyFilterRows, setPropertyFilterRows] = useState<PropertyFilterRow[]>(
        () =>
            portfolioItem.property_filter_values?.length
                ? portfolioItem.property_filter_values.map((row) => ({
                      property_filter_id: String(row.property_filter_id),
                      value: row.value ?? '',
                  }))
                : [{ property_filter_id: '', value: '' }],
    );

    const { data, setData, put, processing, errors, delete: destroy } = useForm<{
        title: string;
        short_description: string;
        description: string;
        date: string;
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
    }>({
        title: portfolioItem.title ?? '',
        short_description: portfolioItem.short_description ?? '',
        description: portfolioItem.description ?? '',
        date: portfolioItem.date ?? '',
        price:
            portfolioItem.price !== null && portfolioItem.price !== undefined && portfolioItem.price !== ''
                ? String(portfolioItem.price)
                : '',
        is_published: portfolioItem.is_published ?? true,
        external_storia_url: portfolioItem.external_storia_url ?? '',
        external_imobiliare_url: portfolioItem.external_imobiliare_url ?? '',
        external_olx_url: portfolioItem.external_olx_url ?? '',
        listing_category: portfolioItem.listing_category ?? '',
        zone: portfolioItem.zone ?? '',
        pinned_home: portfolioItem.pinned_home ?? false,
        pinned_home_order:
            portfolioItem.pinned_home_order != null
                ? String(portfolioItem.pinned_home_order)
                : '',
        image: null,
    });

    const [imagePreview, setImagePreview] = useState<string | null>(null);

    useEffect(() => {
        if (!data.image) {
            setImagePreview(null);
            return;
        }
        const url = URL.createObjectURL(data.image);
        setImagePreview(url);
        return () => URL.revokeObjectURL(url);
    }, [data.image]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        const specsPayload = specRows
            .map((r) => ({ label: r.label.trim(), value: r.value.trim() }))
            .filter((r) => r.label || r.value);
        put(`/dashboard/portfolio/${portfolioItem.id}`, {
            forceFormData: true,
            transform: (form) => ({
                ...form,
                listing_specs_json: JSON.stringify(specsPayload),
                property_filters_json: JSON.stringify(
                    propertyFilterRows
                        .map((row) => ({ property_filter_id: Number(row.property_filter_id), value: row.value.trim() }))
                        .filter((row) => row.property_filter_id > 0 && row.value !== ''),
                ),
            }),
        });
    };

    const onDelete = () => {
        if (!confirm(t('portfolio.edit.delete_confirm'))) return;
        destroy(`/dashboard/portfolio/${portfolioItem.id}`);
    };

    const gallery = portfolioItem.gallery ?? [];
    const galleryFormRef = useRef<HTMLFormElement>(null);
    const [galleryUploading, setGalleryUploading] = useState(false);

    const onGallerySubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const form = galleryFormRef.current;
        if (!form) return;
        const fileInput = form.querySelector<HTMLInputElement>('input[type="file"]');
        const files = fileInput?.files;
        if (!files?.length) return;
        setGalleryUploading(true);
        const formData = new FormData();
        Array.from(files).forEach((file) => {
            formData.append('images[]', file);
        });
        router.post(`/dashboard/portfolio/${portfolioItem.id}/gallery`, formData, {
            forceFormData: true,
            onFinish: () => {
                setGalleryUploading(false);
                if (fileInput) {
                    fileInput.value = '';
                }
            },
        });
    };

    const deleteGalleryImage = (imageId: number) => {
        if (!confirm(t('portfolio.edit.remove_gallery_confirm'))) return;
        router.delete(`/dashboard/portfolio/${portfolioItem.id}/gallery/${imageId}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('meta.edit_listing', { title: portfolioItem.title })} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between gap-2">
                    <div>
                        <h1 className="text-lg font-semibold">{t('portfolio.edit.title')}</h1>
                        <p className="text-sm text-muted-foreground">{t('portfolio.edit.description')}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={onDelete}
                            className="inline-flex items-center rounded-md border border-destructive/40 bg-destructive/10 px-3 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/20"
                        >
                            {t('common.delete')}
                        </button>
                        <Link
                            href="/dashboard/portfolio"
                            className="text-xs font-medium text-muted-foreground hover:text-foreground"
                        >
                            {t('portfolio.edit.back')}
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
                        <div className="space-y-2 rounded-md border border-sidebar-border/70 bg-muted/20 p-3">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <label className="text-xs font-medium">{t('portfolio.form.listing_specs_heading')}</label>
                                <button
                                    type="button"
                                    className="text-xs font-medium text-primary hover:underline"
                                    onClick={() => setSpecRows((rows) => [...rows, { label: '', value: '' }])}
                                >
                                    {t('portfolio.form.add_row')}
                                </button>
                            </div>
                            <p className="text-[11px] text-muted-foreground">
                                {t('portfolio.form.listing_specs_hint')}
                            </p>
                            <div className="space-y-2">
                                {specRows.map((row, index) => (
                                    <div key={index} className="flex flex-wrap items-start gap-2">
                                        <input
                                            type="text"
                                            value={row.label}
                                            onChange={(e) =>
                                                setSpecRows((rows) =>
                                                    rows.map((r, i) =>
                                                        i === index ? { ...r, label: e.target.value } : r,
                                                    ),
                                                )
                                            }
                                            placeholder={t('portfolio.form.placeholder_label')}
                                            className="h-9 min-w-[8rem] flex-1 rounded-md border border-sidebar-border bg-background px-2 text-xs outline-none focus-visible:ring-2 focus-visible:ring-primary"
                                        />
                                        <input
                                            type="text"
                                            value={row.value}
                                            onChange={(e) =>
                                                setSpecRows((rows) =>
                                                    rows.map((r, i) =>
                                                        i === index ? { ...r, value: e.target.value } : r,
                                                    ),
                                                )
                                            }
                                            placeholder={t('portfolio.form.placeholder_value')}
                                            className="h-9 min-w-[8rem] flex-1 rounded-md border border-sidebar-border bg-background px-2 text-xs outline-none focus-visible:ring-2 focus-visible:ring-primary"
                                        />
                                        <button
                                            type="button"
                                            disabled={specRows.length <= 1}
                                            onClick={() =>
                                                setSpecRows((rows) => rows.filter((_, i) => i !== index))
                                            }
                                            className="h-9 shrink-0 rounded-md border border-sidebar-border px-2 text-xs text-muted-foreground hover:bg-muted disabled:opacity-40"
                                        >
                                            {t('common.remove')}
                                        </button>
                                    </div>
                                ))}
                            </div>
                            {errors.listing_specs_json && (
                                <p className="text-xs text-red-500">{errors.listing_specs_json}</p>
                            )}
                        </div>
                        <div className="space-y-2 rounded-md border border-sidebar-border/70 bg-muted/20 p-3">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-medium">Caracteristici proprietate</label>
                                <button type="button" className="text-xs font-medium text-primary hover:underline" onClick={() => setPropertyFilterRows((rows) => [...rows, { property_filter_id: '', value: '' }])}>
                                    {t('portfolio.form.add_row')}
                                </button>
                            </div>
                            {propertyFilterRows.map((row, index) => (
                                <div key={index} className="flex flex-wrap items-center gap-2">
                                    <select value={row.property_filter_id} onChange={(e) => setPropertyFilterRows((rows) => rows.map((r, i) => i === index ? { ...r, property_filter_id: e.target.value } : r))} className="h-9 min-w-[12rem] flex-1 rounded-md border border-sidebar-border bg-background px-2 text-xs">
                                        <option value="">Alege filtru</option>
                                        {propertyFilterOptions.filter((f) => f.is_active).map((filter) => (
                                            <option key={filter.id} value={filter.id}>{filter.label}</option>
                                        ))}
                                    </select>
                                    <input value={row.value} onChange={(e) => setPropertyFilterRows((rows) => rows.map((r, i) => i === index ? { ...r, value: e.target.value } : r))} placeholder={t('portfolio.form.placeholder_value')} className="h-9 min-w-[8rem] flex-1 rounded-md border border-sidebar-border bg-background px-2 text-xs" />
                                    <button type="button" disabled={propertyFilterRows.length <= 1} onClick={() => setPropertyFilterRows((rows) => rows.filter((_, i) => i !== index))} className="h-9 rounded-md border border-sidebar-border px-2 text-xs text-muted-foreground disabled:opacity-40">{t('common.remove')}</button>
                                </div>
                            ))}
                        </div>
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
                        <div className="space-y-1">
                            <label className="text-xs font-medium" htmlFor="date">
                                {t('portfolio.form.date')}
                            </label>
                            <input
                                id="date"
                                type="text"
                                value={data.date}
                                onChange={(e) => setData('date', e.target.value)}
                                className="h-9 w-full max-w-md rounded-md border border-sidebar-border bg-background px-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                            />
                            {errors.date && (
                                <p className="text-xs text-red-500">{errors.date}</p>
                            )}
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-1">
                                <label className="text-xs font-medium" htmlFor="listing_category">
                                    {listingAdmin?.categoryLabel ?? 'Listing category'}
                                </label>
                                <select
                                    id="listing_category"
                                    value={data.listing_category}
                                    onChange={(e) => setData('listing_category', e.target.value)}
                                    className="h-9 w-full rounded-md border border-sidebar-border bg-background px-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                                >
                                    <option value="">
                                        {listingAdmin?.categoryPlaceholder ?? '—'}
                                    </option>
                                    {listingCategoryOptions.map((opt: ListingCategoryOption) => (
                                        <option key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </option>
                                    ))}
                                </select>
                                {errors.listing_category && (
                                    <p className="text-xs text-red-500">{errors.listing_category}</p>
                                )}
                            </div>
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
                                        {t('portfolio.edit.preview_new_image')}
                                    </p>
                                    <div className="h-24 w-24 overflow-hidden rounded-md border border-sidebar-border/70 bg-muted">
                                        <img
                                            src={imagePreview}
                                            alt={t('portfolio.edit.new_image_preview_alt')}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                </div>
                            )}
                            {portfolioItem.image_path && !imagePreview && (
                                <div className="mt-2">
                                    <p className="mb-1 text-xs text-muted-foreground">
                                        {t('portfolio.edit.current_image')}
                                    </p>
                                    <div className="h-24 w-24 overflow-hidden rounded-md border border-sidebar-border/70 bg-muted">
                                        <img
                                            src={`/storage/${portfolioItem.image_path}`}
                                            alt={portfolioItem.title}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                </div>
                            )}
                            {errors.image && (
                                <p className="text-xs text-red-500">{errors.image}</p>
                            )}
                        </div>
                        <div className="flex flex-wrap items-center justify-end gap-2 pt-2">
                            {portfolioItem.slug && (
                                <a
                                    href={`/portfolio/${portfolioItem.slug}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center rounded-md border border-sidebar-border bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
                                >
                                    {t('portfolio.edit.view_public')}
                                </a>
                            )}
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
                                {t('portfolio.edit.save_changes')}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="rounded-xl border border-sidebar-border/70 bg-background p-6 dark:border-sidebar-border">
                    <h2 className="mb-4 text-sm font-semibold">{t('portfolio.edit.gallery_section_title')}</h2>
                    <p className="mb-4 text-xs text-muted-foreground">
                        {t('portfolio.edit.gallery_section_help')}
                    </p>
                    <form ref={galleryFormRef} onSubmit={onGallerySubmit} className="mb-4 flex flex-wrap items-end gap-2">
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            name="images[]"
                            className="block max-w-full text-xs text-muted-foreground file:mr-2 file:rounded-md file:border file:border-sidebar-border file:bg-muted file:px-2 file:py-1 file:text-xs file:font-medium file:text-foreground hover:file:bg-muted/80"
                        />
                        <button
                            type="submit"
                            disabled={galleryUploading}
                            className="inline-flex items-center rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground shadow-sm hover:bg-primary/90 disabled:opacity-60"
                        >
                            {galleryUploading ? t('portfolio.edit.gallery_uploading') : t('portfolio.edit.gallery_add_photos')}
                        </button>
                    </form>
                    {props.errors?.images ? (
                        <p className="mb-3 text-xs text-red-500">
                            {Array.isArray(props.errors.images)
                                ? props.errors.images.join(' ')
                                : props.errors.images}
                        </p>
                    ) : null}
                    {gallery.length > 0 ? (
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                            {gallery.map((img) => (
                                <div
                                    key={img.id}
                                    className="group relative overflow-hidden rounded-lg border border-sidebar-border/70 bg-muted"
                                >
                                    <img
                                        src={`/storage/${img.image_path}`}
                                        alt=""
                                        className="h-24 w-full object-cover sm:h-28"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => deleteGalleryImage(img.id)}
                                        className="absolute right-1 top-1 rounded bg-destructive/90 px-1.5 py-0.5 text-[10px] font-medium text-white opacity-0 transition group-hover:opacity-100"
                                    >
                                        {t('common.remove')}
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-xs text-muted-foreground">
                            {t('portfolio.edit.gallery_empty')}
                        </p>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
