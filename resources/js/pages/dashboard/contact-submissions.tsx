import { Head, Link } from '@inertiajs/react';
import { useMemo } from 'react';
import AppLayout from '@/layouts/app-layout';
import { useAdminT } from '@/hooks/use-admin-translations';
import type { BreadcrumbItem } from '@/types';
import { dashboard } from '@/routes';

type SubmissionRow = {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    company: string | null;
    source: string;
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

export default function DashboardContactSubmissions({ submissions }: Props) {
    const t = useAdminT();

    const breadcrumbs: BreadcrumbItem[] = useMemo(
        () => [
            { title: t('breadcrumb.dashboard'), href: dashboard() },
            { title: t('breadcrumb.contact_messages'), href: '/dashboard/contact-messages' },
        ],
        [t],
    );

    const unreadCount = submissions.filter((row) => !row.read_at).length;
    const countLabel =
        submissions.length === 1
            ? t('contact_submissions.index.count_one', { count: submissions.length })
            : t('contact_submissions.index.count_many', { count: submissions.length });

    const sourceLabel = (source: string) => {
        if (source === 'contact') {
            return t('contact_submissions.source.contact_page');
        }
        return t('contact_submissions.source.home');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('meta.contact_messages')} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div>
                    <h1 className="text-lg font-semibold">{t('contact_submissions.index.title')}</h1>
                    <p className="text-sm text-muted-foreground">{t('contact_submissions.index.description')}</p>
                    {unreadCount > 0 ? (
                        <p className="mt-2 text-xs font-medium text-brand">
                            {unreadCount === 1
                                ? t('contact_submissions.index.unread_one', { count: unreadCount })
                                : t('contact_submissions.index.unread_many', { count: unreadCount })}
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
                                        <th className="px-4 py-2">{t('contact_submissions.index.col_date')}</th>
                                        <th className="px-4 py-2">{t('common.name')}</th>
                                        <th className="px-4 py-2">{t('common.email')}</th>
                                        <th className="px-4 py-2">{t('contact_submissions.index.col_source')}</th>
                                        <th className="w-24 px-4 py-2">{t('contact_submissions.index.col_status')}</th>
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
                                                {t('contact_submissions.index.empty')}
                                            </td>
                                        </tr>
                                    ) : (
                                        submissions.map((row) => {
                                            const fullName = `${row.first_name} ${row.last_name}`.trim();
                                            return (
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
                                                        {fullName}
                                                    </td>
                                                    <td className="px-4 py-2 align-middle text-xs">{row.email}</td>
                                                    <td className="px-4 py-2 align-middle text-xs text-muted-foreground">
                                                        {sourceLabel(row.source)}
                                                    </td>
                                                    <td className="px-4 py-2 align-middle">
                                                        {row.read_at ? (
                                                            <span className="inline-flex rounded-full bg-neutral-500/10 px-2 py-0.5 text-[11px] font-medium text-neutral-600 dark:text-neutral-300">
                                                                {t('contact_submissions.status.read')}
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex rounded-full bg-brand/15 px-2 py-0.5 text-[11px] font-medium text-brand">
                                                                {t('contact_submissions.status.new')}
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-2 align-middle text-right">
                                                        <Link
                                                            href={`/dashboard/contact-messages/${row.id}`}
                                                            className="text-xs font-medium text-primary hover:underline"
                                                        >
                                                            {t('contact_submissions.index.view')}
                                                        </Link>
                                                    </td>
                                                </tr>
                                            );
                                        })
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
