import { Head, Link } from '@inertiajs/react';
import { useMemo } from 'react';
import AppLayout from '@/layouts/app-layout';
import { useAdminT } from '@/hooks/use-admin-translations';
import type { BreadcrumbItem } from '@/types';

type SubmissionRow = {
    id: number;
    full_name: string;
    email: string;
    phone: string;
    budget: string | null;
    newsletter: boolean;
    read_at: string | null;
    created_at: string;
};

type Props = {
    submissions: SubmissionRow[];
};

function formatDate(value: string): string {
    try {
        return new Intl.DateTimeFormat(undefined, {
            dateStyle: 'medium',
            timeStyle: 'short',
        }).format(new Date(value));
    } catch {
        return value;
    }
}

export default function DashboardLeadSubmissions({ submissions }: Props) {
    const t = useAdminT();

    const breadcrumbs: BreadcrumbItem[] = useMemo(
        () => [
            { title: t('breadcrumb.dashboard'), href: '/dashboard' },
            { title: t('breadcrumb.lead_submissions'), href: '/dashboard/lead-submissions' },
        ],
        [t],
    );

    const unreadCount = submissions.filter((row) => !row.read_at).length;
    const countLabel =
        submissions.length === 1
            ? t('lead_submissions.index.count_one', { count: submissions.length })
            : t('lead_submissions.index.count_many', { count: submissions.length });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('meta.lead_submissions')} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div>
                    <h1 className="text-lg font-semibold">{t('lead_submissions.index.title')}</h1>
                    <p className="text-sm text-muted-foreground">{t('lead_submissions.index.description')}</p>
                    {unreadCount > 0 ? (
                        <p className="mt-2 text-xs font-medium text-brand">
                            {unreadCount === 1
                                ? t('lead_submissions.index.unread_one', { count: unreadCount })
                                : t('lead_submissions.index.unread_many', { count: unreadCount })}
                        </p>
                    ) : null}
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
                                        <th className="px-4 py-2">{t('lead_submissions.index.col_date')}</th>
                                        <th className="px-4 py-2">{t('common.name')}</th>
                                        <th className="px-4 py-2">{t('common.email')}</th>
                                        <th className="px-4 py-2">{t('lead_submissions.index.col_phone')}</th>
                                        <th className="w-24 px-4 py-2">{t('lead_submissions.index.col_status')}</th>
                                        <th className="w-28 px-4 py-2 text-right">{t('common.actions')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {submissions.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={6}
                                                className="px-4 py-6 text-center text-xs text-muted-foreground"
                                            >
                                                {t('lead_submissions.index.empty')}
                                            </td>
                                        </tr>
                                    ) : (
                                        submissions.map((row) => (
                                            <tr
                                                key={row.id}
                                                className={`border-b border-sidebar-border/40 last:border-b-0 hover:bg-muted/40 dark:border-sidebar-border ${
                                                    row.read_at ? '' : 'bg-brand/5'
                                                }`}
                                            >
                                                <td className="px-4 py-2 align-middle text-xs text-muted-foreground">
                                                    {formatDate(row.created_at)}
                                                </td>
                                                <td className="px-4 py-2 align-middle text-sm font-medium">
                                                    {row.full_name}
                                                </td>
                                                <td className="px-4 py-2 align-middle text-xs">{row.email}</td>
                                                <td className="px-4 py-2 align-middle text-xs">{row.phone}</td>
                                                <td className="px-4 py-2 align-middle">
                                                    {row.read_at ? (
                                                        <span className="inline-flex rounded-full bg-neutral-500/10 px-2 py-0.5 text-[11px] font-medium text-neutral-600 dark:text-neutral-300">
                                                            {t('lead_submissions.status.read')}
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex rounded-full bg-brand/15 px-2 py-0.5 text-[11px] font-medium text-brand">
                                                            {t('lead_submissions.status.new')}
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-2 align-middle text-right">
                                                    <Link
                                                        href={`/dashboard/lead-submissions/${row.id}`}
                                                        className="text-xs font-medium text-primary hover:underline"
                                                    >
                                                        {t('lead_submissions.index.view')}
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
