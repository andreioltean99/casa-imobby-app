import { Head, Link, useForm } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { useAdminT } from '@/hooks/use-admin-translations';
import type { BreadcrumbItem } from '@/types';

export default function DashboardTestimonialCreate() {
    const t = useAdminT();
    const breadcrumbs: BreadcrumbItem[] = useMemo(
        () => [
            { title: t('breadcrumb.dashboard'), href: '/dashboard' },
            {
                title: t('breadcrumb.testimonials'),
                href: '/dashboard/testimonials',
            },
            {
                title: t('breadcrumb.add_testimonial'),
                href: '/dashboard/testimonials/create',
            },
        ],
        [t],
    );

    const { data, setData, post, processing, errors } = useForm<{
        name: string;
        role: string;
        quote: string;
        is_published: boolean;
        image: File | null;
    }>({
        name: '',
        role: '',
        quote: '',
        is_published: true,
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
        post('/dashboard/testimonials', {
            forceFormData: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('meta.add_testimonial')} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between gap-2">
                    <div>
                        <h1 className="text-lg font-semibold">
                            {t('testimonials.create.title')}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {t('testimonials.create.intro')}
                        </p>
                    </div>
                    <Link
                        href="/dashboard/testimonials"
                        className="text-xs font-medium text-muted-foreground hover:text-foreground"
                    >
                        {t('testimonials.create.back')}
                    </Link>
                </div>

                <div className="relative flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 bg-background p-6 text-sm dark:border-sidebar-border">
                    <form onSubmit={submit} className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-xs font-medium" htmlFor="name">
                                {t('common.name')}
                            </label>
                            <input
                                id="name"
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="h-9 w-full rounded-md border border-sidebar-border bg-background px-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                                required
                            />
                            {errors.name && (
                                <p className="text-xs text-red-500">{errors.name}</p>
                            )}
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-medium" htmlFor="role">
                                {t('testimonials.create.role_optional')}
                            </label>
                            <input
                                id="role"
                                type="text"
                                value={data.role}
                                onChange={(e) => setData('role', e.target.value)}
                                className="h-9 w-full rounded-md border border-sidebar-border bg-background px-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                            />
                            {errors.role && (
                                <p className="text-xs text-red-500">{errors.role}</p>
                            )}
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-medium" htmlFor="quote">
                                {t('testimonials.create.quote')}
                            </label>
                            <textarea
                                id="quote"
                                value={data.quote}
                                onChange={(e) => setData('quote', e.target.value)}
                                className="min-h-[120px] w-full rounded-md border border-sidebar-border bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                                required
                            />
                            {errors.quote && (
                                <p className="text-xs text-red-500">{errors.quote}</p>
                            )}
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
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
                                    className="h-9 w-full rounded-md border border-sidebar-border bg-background px-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                                >
                                    <option value="1">{t('common.yes')}</option>
                                    <option value="0">{t('common.no')}</option>
                                </select>
                                {errors.is_published && (
                                    <p className="text-xs text-red-500">
                                        {errors.is_published}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-medium" htmlFor="image">
                                    {t('testimonials.create.photo')}
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
                                    <div className="mt-2 space-y-1">
                                        <p className="text-xs text-muted-foreground">
                                            {t('testimonials.create.photo_preview')}
                                        </p>
                                        <div className="overflow-hidden rounded-md border border-sidebar-border/70 bg-muted">
                                            <img
                                                src={imagePreview}
                                                alt={t('common.preview')}
                                                className="h-24 w-24 object-cover"
                                            />
                                        </div>
                                    </div>
                                )}
                                {errors.image && (
                                    <p className="text-xs text-red-500">{errors.image}</p>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                            <button
                                type="button"
                                className="inline-flex items-center rounded-md border border-sidebar-border bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
                                onClick={() => history.back()}
                            >
                                {t('common.cancel')}
                            </button>
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center rounded-md bg-primary px-4 py-1.5 text-xs font-medium text-primary-foreground shadow-sm hover:bg-primary/90 disabled:opacity-60"
                            >
                                {t('testimonials.create.save')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
