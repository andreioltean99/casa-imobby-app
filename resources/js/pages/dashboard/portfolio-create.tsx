import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { TinyTextEditor } from '@/components/tiny-text-editor';
import type { BreadcrumbItem } from '@/types';
import { dashboard } from '@/routes';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard() },
    { title: 'Portfolio', href: '/dashboard/portfolio' },
    { title: 'Add project', href: '/dashboard/portfolio/create' },
];

export default function DashboardPortfolioCreate() {
    const { data, setData, post, processing, errors } = useForm<{
        title: string;
        short_description: string;
        description: string;
        date: string;
        duration: string;
        is_published: boolean;
        sort_order: string;
        image: File | null;
        gallery_images: File[];
    }>({
        title: '',
        short_description: '',
        description: '',
        date: '',
        duration: '',
        is_published: true,
        sort_order: '',
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
        post('/dashboard/portfolio', { forceFormData: true });
    };

    const { props } = usePage<{ locale?: string; availableLocales?: string[] }>();
    const currentLocale = props.locale ?? 'en';
    const availableLocales = props.availableLocales?.length
        ? props.availableLocales
        : ['en', 'ro'];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Add project – Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between gap-2">
                    <div>
                        <h1 className="text-lg font-semibold">Add portfolio project</h1>
                        <p className="text-sm text-muted-foreground">
                            Create a new project to show in the portfolio section.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 rounded-full border border-border bg-background/80 px-1 py-0.5 text-[11px] font-medium text-muted-foreground">
                            {availableLocales.map((code) => {
                                const isActive = code === currentLocale;
                                return (
                                    <a
                                        key={code}
                                        href={`/lang/${code}`}
                                        className={[
                                            'inline-flex h-6 items-center justify-center rounded-full px-2 transition-colors',
                                            isActive
                                                ? 'bg-foreground text-background'
                                                : 'hover:bg-muted hover:text-foreground',
                                        ].join(' ')}
                                    >
                                        {code.toUpperCase()}
                                    </a>
                                );
                            })}
                        </div>
                        <Link
                            href="/dashboard/portfolio"
                            className="text-xs font-medium text-muted-foreground hover:text-foreground"
                        >
                            Back to portfolio
                        </Link>
                    </div>
                </div>

                <div className="relative flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 bg-background p-6 text-sm dark:border-sidebar-border">
                    <form onSubmit={submit} className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-xs font-medium" htmlFor="title">
                                Title
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
                                Short description (for project card)
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
                                Full description (project page)
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
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-1">
                                <label className="text-xs font-medium" htmlFor="date">
                                    Date (e.g. 31 August 2024)
                                </label>
                                <input
                                    id="date"
                                    type="text"
                                    value={data.date}
                                    onChange={(e) => setData('date', e.target.value)}
                                    className="h-9 w-full rounded-md border border-sidebar-border bg-background px-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                                />
                                {errors.date && (
                                    <p className="text-xs text-red-500">{errors.date}</p>
                                )}
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-medium" htmlFor="duration">
                                    Duration (e.g. 6 months)
                                </label>
                                <input
                                    id="duration"
                                    type="text"
                                    value={data.duration}
                                    onChange={(e) => setData('duration', e.target.value)}
                                    className="h-9 w-full rounded-md border border-sidebar-border bg-background px-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                                />
                                {errors.duration && (
                                    <p className="text-xs text-red-500">{errors.duration}</p>
                                )}
                            </div>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-1">
                                <label className="text-xs font-medium" htmlFor="is_published">
                                    Published
                                </label>
                                <select
                                    id="is_published"
                                    value={data.is_published ? '1' : '0'}
                                    onChange={(e) =>
                                        setData('is_published', e.target.value === '1')
                                    }
                                    className="h-9 w-full rounded-md border border-sidebar-border bg-background px-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                                >
                                    <option value="1">Yes</option>
                                    <option value="0">No</option>
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-medium" htmlFor="sort_order">
                                    Sort order
                                </label>
                                <input
                                    id="sort_order"
                                    type="number"
                                    min={0}
                                    value={data.sort_order}
                                    onChange={(e) => setData('sort_order', e.target.value)}
                                    className="h-9 w-full max-w-[120px] rounded-md border border-sidebar-border bg-background px-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                                />
                                {errors.sort_order && (
                                    <p className="text-xs text-red-500">{errors.sort_order}</p>
                                )}
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-medium" htmlFor="image">
                                Image (optional)
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
                                    <p className="text-xs text-muted-foreground mb-1">
                                        Preview:
                                    </p>
                                    <div className="overflow-hidden rounded-md border border-sidebar-border/70 bg-muted w-24 h-24">
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
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
                                Gallery images (optional)
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
                                        {data.gallery_images.length} image(s) selected
                                    </p>
                                    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
                                        {galleryPreviews.map((src, index) => (
                                            <div
                                                key={`${src}-${index}`}
                                                className="overflow-hidden rounded-md border border-sidebar-border/70 bg-muted"
                                            >
                                                <img
                                                    src={src}
                                                    alt={`Gallery preview ${index + 1}`}
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
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center rounded-md bg-primary px-4 py-1.5 text-xs font-medium text-primary-foreground shadow-sm hover:bg-primary/90 disabled:opacity-60"
                            >
                                Save project
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
