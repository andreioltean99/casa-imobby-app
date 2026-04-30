import { Head, Link, useForm } from '@inertiajs/react';
import { useMemo } from 'react';
import AppLayout from '@/layouts/app-layout';
import { useAdminT } from '@/hooks/use-admin-translations';
import type { BreadcrumbItem } from '@/types';
import { dashboard } from '@/routes';

type User = {
    id: number;
    name: string;
    email: string;
};

type Props = {
    user: User;
};

export default function DashboardUsersEdit({ user }: Props) {
    const t = useAdminT();
    const { data, setData, put, processing, errors, delete: destroy } = useForm<{
        name: string;
        email: string;
        password: string;
    }>({
        name: user.name ?? '',
        email: user.email ?? '',
        password: '',
    });

    const breadcrumbs: BreadcrumbItem[] = useMemo(
        () => [
            { title: t('breadcrumb.dashboard'), href: dashboard() },
            { title: t('breadcrumb.users'), href: '/dashboard/users' },
            {
                title: user.name,
                href: `/dashboard/users/${user.id}/edit`,
            },
        ],
        [t, user.name, user.id],
    );

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/dashboard/users/${user.id}`);
    };

    const onDelete = () => {
        if (!confirm(t('users.edit.delete_confirm'))) return;
        destroy(`/dashboard/users/${user.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('meta.edit_user', { name: user.name })} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between gap-2">
                    <div>
                        <h1 className="text-lg font-semibold">{t('users.edit.title')}</h1>
                        <p className="text-sm text-muted-foreground">{t('users.edit.intro')}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={onDelete}
                            className="inline-flex items-center rounded-md border border-destructive/40 bg-destructive/10 px-3 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/20"
                            disabled={processing}
                        >
                            {t('common.delete')}
                        </button>
                        <Link
                            href="/dashboard/users"
                            className="text-xs font-medium text-muted-foreground hover:text-foreground"
                        >
                            {t('users.edit.back')}
                        </Link>
                    </div>
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
                            <label className="text-xs font-medium" htmlFor="email">
                                {t('common.email')}
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="h-9 w-full rounded-md border border-sidebar-border bg-background px-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                                required
                            />
                            {errors.email && (
                                <p className="text-xs text-red-500">{errors.email}</p>
                            )}
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-medium" htmlFor="password">
                                {t('users.edit.new_password')}
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={data.password}
                                onChange={(e) =>
                                    setData('password', e.target.value)
                                }
                                placeholder={t('users.edit.password_optional')}
                                className="h-9 w-full rounded-md border border-sidebar-border bg-background px-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                            />
                            {errors.password && (
                                <p className="text-xs text-red-500">{errors.password}</p>
                            )}
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                            <button
                                type="button"
                                className="inline-flex items-center rounded-md border border-sidebar-border bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
                                onClick={() => history.back()}
                                disabled={processing}
                            >
                                {t('common.cancel')}
                            </button>
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center rounded-md bg-primary px-4 py-1.5 text-xs font-medium text-primary-foreground shadow-sm hover:bg-primary/90 disabled:opacity-60"
                            >
                                {t('users.edit.save')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
