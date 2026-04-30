import { Head, Link, useForm } from '@inertiajs/react';
import { useMemo } from 'react';
import AppLayout from '@/layouts/app-layout';
import { useAdminT } from '@/hooks/use-admin-translations';
import type { BreadcrumbItem } from '@/types';
import { dashboard } from '@/routes';

export default function DashboardUsersCreate() {
    const t = useAdminT();
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
    });

    const breadcrumbs: BreadcrumbItem[] = useMemo(
        () => [
            { title: t('breadcrumb.dashboard'), href: dashboard() },
            { title: t('breadcrumb.users'), href: '/dashboard/users' },
            { title: t('breadcrumb.add_user'), href: '/dashboard/users/create' },
        ],
        [t],
    );

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/dashboard/users', { forceFormData: false });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('meta.add_user')} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between gap-2">
                    <div>
                        <h1 className="text-lg font-semibold">{t('users.create.title')}</h1>
                        <p className="text-sm text-muted-foreground">{t('users.create.description')}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link
                            href="/dashboard/users"
                            className="text-xs font-medium text-muted-foreground hover:text-foreground"
                        >
                            {t('users.create.back')}
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
                                <p className="text-xs text-red-500">
                                    {errors.name}
                                </p>
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
                                <p className="text-xs text-red-500">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-medium" htmlFor="password">
                                {t('common.password')}
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={data.password}
                                onChange={(e) =>
                                    setData('password', e.target.value)
                                }
                                className="h-9 w-full rounded-md border border-sidebar-border bg-background px-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                                required
                            />
                            {errors.password && (
                                <p className="text-xs text-red-500">
                                    {errors.password}
                                </p>
                            )}
                            <p className="text-xs text-muted-foreground">
                                {t('users.create.password_hint')}
                            </p>
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
                                {t('users.create.save')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
