import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { TinyTextEditor } from '@/components/tiny-text-editor';
import type { BreadcrumbItem } from '@/types';
import { dashboard } from '@/routes';

type GalleryImage = {
    id: number;
    image_path: string;
    sort_order: number | null;
};

type PortfolioItem = {
    id: number;
    title: string;
    slug?: string;
    short_description?: string | null;
    description: string | null;
    image_path: string | null;
    date: string | null;
    duration: string | null;
    is_published: boolean;
    sort_order: number | null;
    gallery?: GalleryImage[];
};

type Props = {
    portfolioItem: PortfolioItem;
};

export default function DashboardPortfolioEdit({ portfolioItem }: Props) {
    const { props } = usePage<{ locale?: string; availableLocales?: string[] }>();
    const currentLocale = props.locale ?? 'en';
    const availableLocales = props.availableLocales?.length
        ? props.availableLocales
        : ['en', 'ro'];

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Portfolio', href: '/dashboard/portfolio' },
        {
            title: portfolioItem.title,
            href: `/dashboard/portfolio/${portfolioItem.id}/edit`,
        },
    ];

    const { data, setData, put, processing, errors, delete: destroy } = useForm<{
        title: string;
        short_description: string;
        description: string;
        date: string;
        duration: string;
        is_published: boolean;
        sort_order: string;
        image: File | null;
    }>({
        title: portfolioItem.title ?? '',
        short_description: portfolioItem.short_description ?? '',
        description: portfolioItem.description ?? '',
        date: portfolioItem.date ?? '',
        duration: portfolioItem.duration ?? '',
        is_published: portfolioItem.is_published ?? true,
        sort_order:
            portfolioItem.sort_order != null
                ? String(portfolioItem.sort_order)
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
        put(`/dashboard/portfolio/${portfolioItem.id}`, {
            forceFormData: true,
        });
    };

    const onDelete = () => {
        if (!confirm('Delete this portfolio project?')) return;
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
        if (!fileInput?.files?.length) return;
        setGalleryUploading(true);
        const formData = new FormData();
        formData.append('image', fileInput.files[0]);
        router.post(
            `/dashboard/portfolio/${portfolioItem.id}/gallery`,
            formData,
            {
                forceFormData: true,
                onFinish: () => {
                    setGalleryUploading(false);
                    fileInput.value = '';
                },
            }
        );
    };

    const deleteGalleryImage = (imageId: number) => {
        if (!confirm('Remove this image from the gallery?')) return;
        router.delete(`/dashboard/portfolio/${portfolioItem.id}/gallery/${imageId}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit project – ${portfolioItem.title}`} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between gap-2">
                    <div>
                        <h1 className="text-lg font-semibold">Edit portfolio project</h1>
                        <p className="text-sm text-muted-foreground">
                            Update the project details and visibility.
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
                        <button
                            type="button"
                            onClick={onDelete}
                            className="inline-flex items-center rounded-md border border-destructive/40 bg-destructive/10 px-3 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/20"
                        >
                            Delete
                        </button>
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
                                    <p className="text-xs text-red-500">
                                        {errors.sort_order}
                                    </p>
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
                                    <p className="mb-1 text-xs text-muted-foreground">
                                        Preview (new image):
                                    </p>
                                    <div className="h-24 w-24 overflow-hidden rounded-md border border-sidebar-border/70 bg-muted">
                                        <img
                                            src={imagePreview}
                                            alt="New image preview"
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                </div>
                            )}
                            {portfolioItem.image_path && !imagePreview && (
                                <div className="mt-2">
                                    <p className="mb-1 text-xs text-muted-foreground">
                                        Current image:
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
                                    View project
                                </a>
                            )}
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
                                Save changes
                            </button>
                        </div>
                    </form>
                </div>

                <div className="rounded-xl border border-sidebar-border/70 bg-background p-6 dark:border-sidebar-border">
                    <h2 className="mb-4 text-sm font-semibold">Project gallery</h2>
                    <p className="mb-4 text-xs text-muted-foreground">
                        Add photos to display in a gallery on the project page. Upload one image at a time.
                    </p>
                    <form ref={galleryFormRef} onSubmit={onGallerySubmit} className="mb-4 flex flex-wrap items-end gap-2">
                        <input
                            type="file"
                            accept="image/*"
                            name="image"
                            className="block text-xs text-muted-foreground file:mr-2 file:rounded-md file:border file:border-sidebar-border file:bg-muted file:px-2 file:py-1 file:text-xs file:font-medium file:text-foreground hover:file:bg-muted/80"
                        />
                        <button
                            type="submit"
                            disabled={galleryUploading}
                            className="inline-flex items-center rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground shadow-sm hover:bg-primary/90 disabled:opacity-60"
                        >
                            {galleryUploading ? 'Uploading…' : 'Add photo'}
                        </button>
                    </form>
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
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-xs text-muted-foreground">
                            No gallery photos yet. Use the form above to add some.
                        </p>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
