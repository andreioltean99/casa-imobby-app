import { Head, Link } from '@inertiajs/react';
import { useMemo } from 'react';
import AppLayout from '@/layouts/app-layout';
import { useAdminT } from '@/hooks/use-admin-translations';
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

export default function DashboardTestimonials({ testimonials }: Props) {
    const t = useAdminT();

    const breadcrumbs: BreadcrumbItem[] = useMemo(
        () => [
            { title: t('breadcrumb.dashboard'), href: dashboard() },
            { title: t('breadcrumb.testimonials'), href: '/dashboard/testimonials' },
        ],
        [t],
    );

    const countLabel =
        testimonials.length === 1
            ? t('testimonials.index.count_one', { count: testimonials.length })
            : t('testimonials.index.count_many', { count: testimonials.length });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('meta.testimonials')} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between gap-2">
                    <div>
                        <h1 className="text-lg font-semibold">{t('testimonials.index.title')}</h1>
                        <p className="text-sm text-muted-foreground">{t('testimonials.index.description')}</p>
                    </div>
                    <Link
                        href="/dashboard/testimonials/create"
                        className="inline-flex items-center rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground shadow-sm hover:bg-primary/90"
                    >
                        {t('testimonials.index.add')}
                    </Link>
                </div>

                <div className="relative flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 bg-background dark:border-sidebar-border">
                    <div className="flex h-full flex-col">
                        <div className="border-b border-sidebar-border/70 px-4 py-3 text-xs font-medium text-muted-foreground dark:border-sidebar-border">
                            {countLabel}
                        </div>
                        <div className="flex-1 overflow-auto">
                            <table className="min-w-full border-collapse text-xs">
                                <thead>
                                    <tr className="border-b border-sidebar-border/70 bg-muted/40 text-left text-[11px] font-medium uppercase tracking-wide text-muted-foreground dark:border-sidebar-border">
                                        <th className="px-4 py-2">{t('testimonials.index.col_name')}</th>
                                        <th className="px-4 py-2">{t('testimonials.index.col_role')}</th>
                                        <th className="w-24 px-4 py-2">{t('common.published_field')}</th>
                                        <th className="w-24 px-4 py-2">{t('common.order')}</th>
                                        <th className="w-32 px-4 py-2 text-right">{t('common.actions')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {testimonials.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={5}
                                                className="px-4 py-6 text-center text-xs text-muted-foreground"
                                            >
                                                {t('testimonials.index.empty')}
                                            </td>
                                        </tr>
                                    ) : (
                                        testimonials.map((row) => (
                                            <tr
                                                key={row.id}
                                                className="border-b border-sidebar-border/40 last:border-b-0 hover:bg-muted/40 dark:border-sidebar-border"
                                            >
                                                <td className="px-4 py-2 align-middle text-sm">
                                                    {row.name}
                                                </td>
                                                <td className="px-4 py-2 align-middle text-xs text-muted-foreground">
                                                    {row.role ?? t('common.dash')}
                                                </td>
                                                <td className="px-4 py-2 align-middle">
                                                    {row.is_published ? (
                                                        <span className="inline-flex rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-300">
                                                            {t('common.published')}
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex rounded-full bg-neutral-500/10 px-2 py-0.5 text-[11px] font-medium text-neutral-600 dark:text-neutral-300">
                                                            {t('common.hidden')}
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-2 align-middle text-xs text-muted-foreground">
                                                    {row.sort_order ?? t('common.dash')}
                                                </td>
                                                <td className="px-4 py-2 align-middle text-right">
                                                    <Link
                                                        href={`/dashboard/testimonials/${row.id}/edit`}
                                                        className="text-xs font-medium text-primary hover:underline"
                                                    >
                                                        {t('common.edit')}
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
