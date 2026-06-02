import { Head, Link, useForm, usePage } from '@inertiajs/react';
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
    sectionSettings: {
        show_on_homepage: boolean;
    };
};

export default function DashboardTestimonials({
    testimonials,
    sectionSettings,
}: Props) {
    const t = useAdminT();
    const { props } = usePage<{ status?: string }>();

    const breadcrumbs: BreadcrumbItem[] = useMemo(
        () => [
            { title: t('breadcrumb.dashboard'), href: dashboard() },
            {
                title: t('breadcrumb.testimonials'),
                href: '/dashboard/testimonials',
            },
        ],
        [t],
    );

    const {
        data: sectionData,
        setData: setSectionData,
        put: putSection,
        processing: sectionProcessing,
    } = useForm({
        show_on_homepage: sectionSettings.show_on_homepage,
    });

    const countLabel =
        testimonials.length === 1
            ? t('testimonials.index.count_one', { count: testimonials.length })
            : t('testimonials.index.count_many', {
                  count: testimonials.length,
              });

    const saveSectionSettings = (e: React.FormEvent) => {
        e.preventDefault();
        putSection('/dashboard/testimonials/section-settings', {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('meta.testimonials')} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between gap-2">
                    <div>
                        <h1 className="text-lg font-semibold">
                            {t('testimonials.index.title')}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {t('testimonials.index.description')}
                        </p>
                    </div>
                    <Link
                        href="/dashboard/testimonials/create"
                        className="inline-flex items-center rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground shadow-sm hover:bg-primary/90"
                    >
                        {t('testimonials.index.add')}
                    </Link>
                </div>

                {props.status ? (
                    <p className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-700 dark:text-emerald-300">
                        {props.status}
                    </p>
                ) : null}

                <form
                    onSubmit={saveSectionSettings}
                    className="rounded-xl border border-sidebar-border/70 bg-muted/20 p-4 dark:border-sidebar-border"
                >
                    <h2 className="text-sm font-semibold">
                        {t('testimonials.index.section_visibility_title')}
                    </h2>
                    <p className="mt-1 text-xs text-muted-foreground">
                        {t('testimonials.index.section_visibility_help')}
                    </p>
                    <label className="mt-3 flex cursor-pointer items-start gap-3">
                        <input
                            type="checkbox"
                            checked={sectionData.show_on_homepage}
                            onChange={(e) =>
                                setSectionData(
                                    'show_on_homepage',
                                    e.target.checked,
                                )
                            }
                            className="mt-0.5 h-4 w-4 rounded border-sidebar-border"
                        />
                        <span className="text-sm leading-snug">
                            {t('testimonials.index.section_visibility_label')}
                        </span>
                    </label>
                    <div className="mt-3">
                        <button
                            type="submit"
                            disabled={sectionProcessing}
                            className="inline-flex items-center rounded-md border border-sidebar-border bg-background px-3 py-1.5 text-xs font-medium hover:bg-muted disabled:opacity-60"
                        >
                            {t('testimonials.index.section_visibility_save')}
                        </button>
                    </div>
                </form>

                <div className="relative flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 bg-background dark:border-sidebar-border">
                    <div className="flex h-full flex-col">
                        <div className="border-b border-sidebar-border/70 px-4 py-3 text-xs font-medium text-muted-foreground dark:border-sidebar-border">
                            {countLabel}
                        </div>
                        <div className="flex-1 overflow-auto">
                            <table className="min-w-full border-collapse text-xs">
                                <thead>
                                    <tr className="border-b border-sidebar-border/70 bg-muted/40 text-left text-[11px] font-medium tracking-wide text-muted-foreground uppercase dark:border-sidebar-border">
                                        <th className="px-4 py-2">
                                            {t('testimonials.index.col_name')}
                                        </th>
                                        <th className="px-4 py-2">
                                            {t('testimonials.index.col_role')}
                                        </th>
                                        <th className="w-24 px-4 py-2">
                                            {t('common.published_field')}
                                        </th>
                                        <th className="w-24 px-4 py-2">
                                            {t('common.order')}
                                        </th>
                                        <th className="w-32 px-4 py-2 text-right">
                                            {t('common.actions')}
                                        </th>
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
                                                    {row.role ??
                                                        t('common.dash')}
                                                </td>
                                                <td className="px-4 py-2 align-middle">
                                                    {row.is_published ? (
                                                        <span className="inline-flex rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-300">
                                                            {t(
                                                                'common.published',
                                                            )}
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex rounded-full bg-neutral-500/10 px-2 py-0.5 text-[11px] font-medium text-neutral-600 dark:text-neutral-300">
                                                            {t('common.hidden')}
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-2 align-middle text-xs text-muted-foreground">
                                                    {row.sort_order ??
                                                        t('common.dash')}
                                                </td>
                                                <td className="px-4 py-2 text-right align-middle">
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
