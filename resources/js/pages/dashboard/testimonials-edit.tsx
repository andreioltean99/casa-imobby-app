import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { dashboard } from '@/routes';

type Testimonial = {
    id: number;
    name: string;
    role: string | null;
    quote: string;
    is_published: boolean;
    sort_order: number | null;
    image_path: string | null;
};

type Props = {
    testimonial: Testimonial;
};

export default function DashboardTestimonialEdit({ testimonial }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
        {
            title: 'Testimonials',
            href: '/dashboard/testimonials',
        },
        {
            title: testimonial.name,
            href: `/dashboard/testimonials/${testimonial.id}/edit`,
        },
    ];

    const { data, setData, put, processing, errors, delete: destroy } = useForm<{
        name: string;
        role: string;
        quote: string;
        is_published: boolean;
        sort_order: string;
        image: File | null;
    }>({
        name: testimonial.name ?? '',
        role: testimonial.role ?? '',
        quote: testimonial.quote ?? '',
        is_published: testimonial.is_published ?? true,
        sort_order:
            testimonial.sort_order != null ? String(testimonial.sort_order) : '',
        image: null,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/dashboard/testimonials/${testimonial.id}`, {
            forceFormData: true,
        });
    };

    const onDelete = () => {
        if (!confirm('Delete this testimonial?')) return;
        destroy(`/dashboard/testimonials/${testimonial.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit testimonial – ${testimonial.name}`} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between gap-2">
                    <div>
                        <h1 className="text-lg font-semibold">Edit testimonial</h1>
                        <p className="text-sm text-muted-foreground">
                            Update the content and visibility of this testimonial.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={onDelete}
                            className="inline-flex items-center rounded-md border border-destructive/40 bg-destructive/10 px-3 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/20"
                        >
                            Delete
                        </button>
                        <Link
                            href="/dashboard/testimonials"
                            className="text-xs font-medium text-muted-foreground hover:text-foreground"
                        >
                            Back to testimonials
                        </Link>
                    </div>
                </div>

                <div className="relative flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 bg-background p-6 text-sm dark:border-sidebar-border">
                    <form onSubmit={submit} className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-xs font-medium" htmlFor="name">
                                Name
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
                                Role / Company (optional)
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
                                Quote
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

                        <div className="grid gap-4 md:grid-cols-3">
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
                                {errors.is_published && (
                                    <p className="text-xs text-red-500">
                                        {errors.is_published}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-medium" htmlFor="sort_order">
                                    Sort order
                                </label>
                                <input
                                    id="sort_order"
                                    type="number"
                                    value={data.sort_order}
                                    onChange={(e) => setData('sort_order', e.target.value)}
                                    className="h-9 w-full rounded-md border border-sidebar-border bg-background px-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                                />
                                {errors.sort_order && (
                                    <p className="text-xs text-red-500">
                                        {errors.sort_order}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-medium" htmlFor="image">
                                    Photo (optional)
                                </label>
                                <input
                                    id="image"
                                    type="file"
                                    onChange={(e) =>
                                        setData('image', e.target.files?.[0] ?? null)
                                    }
                                    className="block w-full text-xs text-muted-foreground file:mr-2 file:rounded-md file:border file:border-sidebar-border file:bg-muted file:px-2 file:py-1 file:text-xs file:font-medium file:text-foreground hover:file:bg-muted/80"
                                />
                                {testimonial.image_path && (
                                    <div className="mt-2 space-y-1">
                                        <p className="text-xs text-muted-foreground">
                                            Current photo preview:
                                        </p>
                                        <div className="overflow-hidden rounded-md border border-sidebar-border/70 bg-muted">
                                            <img
                                                src={`/storage/${testimonial.image_path}`}
                                                alt={testimonial.name}
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
                                Cancel
                            </button>
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
            </div>
        </AppLayout>
    );
}

