import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useMemo } from 'react';
import AppLayout from '@/layouts/app-layout';
import { useAdminT } from '@/hooks/use-admin-translations';
import type { BreadcrumbItem } from '@/types';
import { dashboard } from '@/routes';

type UserRow = {
    id: number;
    name: string;
    email: string;
    created_at?: string | null;
};

type Props = {
    users: UserRow[];
};

export default function DashboardUsers({ users }: Props) {
    const t = useAdminT();
    const { delete: destroy, processing } = useForm();
    const { props } = usePage<{
        status?: string;
        errors?: { delete?: string };
    }>();

    const breadcrumbs: BreadcrumbItem[] = useMemo(
        () => [
            { title: t('breadcrumb.dashboard'), href: dashboard() },
            { title: t('breadcrumb.users'), href: '/dashboard/users' },
        ],
        [t],
    );

    const onDelete = (userId: number) => {
        if (!confirm(t('users.index.delete_confirm'))) return;
        destroy(`/dashboard/users/${userId}`);
    };

    const countLabel =
        users.length === 1
            ? t('users.index.count_one', { count: users.length })
            : t('users.index.count_many', { count: users.length });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('meta.users')} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between gap-2">
                    <div>
                        <h1 className="text-lg font-semibold">{t('users.index.title')}</h1>
                        <p className="text-sm text-muted-foreground">{t('users.index.description')}</p>
                    </div>
                    <Link
                        href="/dashboard/users/create"
                        className="inline-flex items-center rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground shadow-sm hover:bg-primary/90"
                    >
                        {t('users.index.add')}
                    </Link>
                </div>

                {(props.status || props.errors?.delete) && (
                    <div className="rounded-md border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                        {props.status ? <div>{props.status}</div> : null}
                        {props.errors?.delete ? <div>{props.errors.delete}</div> : null}
                    </div>
                )}

                <div className="relative flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 bg-background dark:border-sidebar-border">
                    <div className="flex h-full flex-col">
                        <div className="border-b border-sidebar-border/70 px-4 py-3 text-xs font-medium text-muted-foreground dark:border-sidebar-border">
                            {countLabel}
                        </div>
                        <div className="flex-1 overflow-auto">
                            <table className="min-w-full border-collapse text-xs">
                                <thead>
                                    <tr className="border-b border-sidebar-border/70 bg-muted/40 text-left text-[11px] font-medium uppercase tracking-wide text-muted-foreground dark:border-sidebar-border">
                                        <th className="px-4 py-2">{t('common.name')}</th>
                                        <th className="px-4 py-2">{t('common.email')}</th>
                                        <th className="w-40 px-4 py-2">{t('users.index.col_created')}</th>
                                        <th className="w-32 px-4 py-2 text-right">{t('common.actions')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={4}
                                                className="px-4 py-6 text-center text-xs text-muted-foreground"
                                            >
                                                {t('users.index.empty')}
                                            </td>
                                        </tr>
                                    ) : (
                                        users.map((u) => (
                                            <tr
                                                key={u.id}
                                                className="border-b border-sidebar-border/40 last:border-b-0 hover:bg-muted/40 dark:border-sidebar-border"
                                            >
                                                <td className="px-4 py-2 align-middle text-sm">
                                                    {u.name}
                                                </td>
                                                <td className="px-4 py-2 align-middle text-xs text-muted-foreground">
                                                    {u.email}
                                                </td>
                                                <td className="px-4 py-2 align-middle text-xs text-muted-foreground">
                                                    {u.created_at
                                                        ? new Date(u.created_at).toLocaleDateString()
                                                        : t('common.dash')}
                                                </td>
                                                <td className="px-4 py-2 align-middle text-right">
                                                    <div className="flex items-center justify-end gap-3">
                                                        <Link
                                                            href={`/dashboard/users/${u.id}/edit`}
                                                            className="text-xs font-medium text-primary hover:underline"
                                                        >
                                                            {t('common.edit')}
                                                        </Link>
                                                        <button
                                                            type="button"
                                                            disabled={processing}
                                                            onClick={() => onDelete(u.id)}
                                                            className="text-xs font-medium text-destructive hover:underline disabled:opacity-60"
                                                        >
                                                            {t('common.delete')}
                                                        </button>
                                                    </div>
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
