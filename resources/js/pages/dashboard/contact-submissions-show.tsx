import { Head, Link, router, usePage } from '@inertiajs/react';
import { useMemo } from 'react';
import AppLayout from '@/layouts/app-layout';
import { useAdminT } from '@/hooks/use-admin-translations';
import type { BreadcrumbItem } from '@/types';
import { dashboard } from '@/routes';

type Submission = {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    message: string;
    source: string;
    read_at: string | null;
    created_at: string;
    updated_at: string;
};

type Props = {
    submission: Submission;
};

function formatDate(value: string): string {
    try {
        return new Intl.DateTimeFormat(undefined, {
            dateStyle: 'long',
            timeStyle: 'short',
        }).format(new Date(value));
    } catch {
        return value;
    }
}

export default function DashboardContactSubmissionsShow({ submission }: Props) {
    const t = useAdminT();
    const { props } = usePage<{ status?: string }>();

    const fullName = `${submission.first_name} ${submission.last_name}`.trim();

    const breadcrumbs: BreadcrumbItem[] = useMemo(
        () => [
            { title: t('breadcrumb.dashboard'), href: dashboard() },
            { title: t('breadcrumb.contact_messages'), href: '/dashboard/contact-messages' },
            { title: fullName, href: `/dashboard/contact-messages/${submission.id}` },
        ],
        [fullName, submission.id, t],
    );

    const sourceLabel =
        submission.source === 'contact'
            ? t('contact_submissions.source.contact_page')
            : t('contact_submissions.source.home');

    const onDelete = () => {
        if (!confirm(t('contact_submissions.show.delete_confirm'))) {
            return;
        }
        router.delete(`/dashboard/contact-messages/${submission.id}`);
    };

    const onMarkUnread = () => {
        router.put(`/dashboard/contact-messages/${submission.id}/unread`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('meta.contact_message_show', { name: fullName })} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                        <h1 className="text-lg font-semibold">{fullName}</h1>
                        <p className="text-sm text-muted-foreground">
                            {t('contact_submissions.show.received', { date: formatDate(submission.created_at) })}
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Link
                            href="/dashboard/contact-messages"
                            className="inline-flex items-center rounded-md border border-sidebar-border bg-background px-3 py-1.5 text-xs font-medium hover:bg-muted"
                        >
                            {t('common.back')}
                        </Link>
                        {submission.read_at ? (
                            <button
                                type="button"
                                onClick={onMarkUnread}
                                className="inline-flex items-center rounded-md border border-sidebar-border bg-background px-3 py-1.5 text-xs font-medium hover:bg-muted"
                            >
                                {t('contact_submissions.show.mark_unread')}
                            </button>
                        ) : null}
                        <button
                            type="button"
                            onClick={onDelete}
                            className="inline-flex items-center rounded-md border border-destructive/30 bg-destructive/10 px-3 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/15"
                        >
                            {t('common.delete')}
                        </button>
                    </div>
                </div>

                {props.status ? (
                    <div className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-800 dark:text-emerald-200">
                        {props.status}
                    </div>
                ) : null}

                <dl className="grid max-w-2xl gap-4 rounded-xl border border-sidebar-border/70 bg-background p-6 text-sm dark:border-sidebar-border">
                    <Detail label={t('common.email')} value={submission.email} href={`mailto:${submission.email}`} />
                    <Detail label={t('contact_submissions.show.source')} value={sourceLabel} />
                </dl>

                <div className="max-w-2xl rounded-xl border border-sidebar-border/70 bg-background p-6 dark:border-sidebar-border">
                    <h2 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        {t('contact_submissions.show.message')}
                    </h2>
                    <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed">{submission.message}</p>
                </div>
            </div>
        </AppLayout>
    );
}

function Detail({
    label,
    value,
    href,
}: {
    label: string;
    value: string;
    href?: string;
}) {
    return (
        <div className="grid gap-1 sm:grid-cols-[10rem_1fr]">
            <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</dt>
            <dd className="text-sm">
                {href ? (
                    <a href={href} className="font-medium text-brand hover:underline">
                        {value}
                    </a>
                ) : (
                    value
                )}
            </dd>
        </div>
    );
}
