import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { dashboard } from '@/routes';

type TestimonialRow = {
    id: number;
    name: string;
    role: string | null;
    quote: string;
    image_path: string | null;
    is_published: boolean;
    sort_order: number | null;
};

type Props = {
    testimonials: TestimonialRow[];
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
    },
    {
        title: 'Testimonials',
        href: '/dashboard/testimonials',
    },
];

export default function DashboardTestimonials({ testimonials }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Testimonials – Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between gap-2">
                    <div>
                        <h1 className="text-lg font-semibold">Testimonials</h1>
                        <p className="text-sm text-muted-foreground">
                            Manage client testimonials shown on the public website.
                        </p>
                    </div>
                    <Link
                        href="/dashboard/testimonials/create"
                        className="inline-flex items-center rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground shadow-sm hover:bg-primary/90"
                    >
                        Add testimonial
                    </Link>
                </div>

                <div className="relative flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 bg-background dark:border-sidebar-border">
                    <div className="flex h-full flex-col">
                        <div className="border-b border-sidebar-border/70 px-4 py-3 text-xs font-medium text-muted-foreground dark:border-sidebar-border">
                            {testimonials.length} testimonial
                            {testimonials.length === 1 ? '' : 's'}
                        </div>
                        <div className="flex-1 overflow-auto">
                            <table className="min-w-full border-collapse text-xs">
                                <thead>
                                    <tr className="border-b border-sidebar-border/70 bg-muted/40 text-left text-[11px] font-medium uppercase tracking-wide text-muted-foreground dark:border-sidebar-border">
                                        <th className="px-4 py-2">Name</th>
                                        <th className="px-4 py-2">Role</th>
                                        <th className="px-4 py-2 w-24">Published</th>
                                        <th className="px-4 py-2 w-24">Order</th>
                                        <th className="px-4 py-2 w-32 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {testimonials.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={5}
                                                className="px-4 py-6 text-center text-xs text-muted-foreground"
                                            >
                                                No testimonials yet. Use &quot;Add testimonial&quot; to create
                                                one.
                                            </td>
                                        </tr>
                                    ) : (
                                        testimonials.map((t) => (
                                            <tr
                                                key={t.id}
                                                className="border-b border-sidebar-border/40 last:border-b-0 hover:bg-muted/40 dark:border-sidebar-border"
                                            >
                                                <td className="px-4 py-2 align-middle text-sm">
                                                    {t.name}
                                                </td>
                                                <td className="px-4 py-2 align-middle text-xs text-muted-foreground">
                                                    {t.role ?? '—'}
                                                </td>
                                                <td className="px-4 py-2 align-middle">
                                                    {t.is_published ? (
                                                        <span className="inline-flex rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-300">
                                                            Published
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex rounded-full bg-neutral-500/10 px-2 py-0.5 text-[11px] font-medium text-neutral-600 dark:text-neutral-300">
                                                            Hidden
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-2 align-middle text-xs text-muted-foreground">
                                                    {t.sort_order ?? '—'}
                                                </td>
                                                <td className="px-4 py-2 align-middle text-right">
                                                    <Link
                                                        href={`/dashboard/testimonials/${t.id}/edit`}
                                                        className="text-xs font-medium text-primary hover:underline"
                                                    >
                                                        Edit
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

