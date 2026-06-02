import { Head, Link, useForm } from '@inertiajs/react';
import { useMemo } from 'react';
import AppLayout from '@/layouts/app-layout';
import { useAdminT } from '@/hooks/use-admin-translations';
import type { BreadcrumbItem } from '@/types';

export default function DashboardPrincipleCreate() {
    const t = useAdminT();
    const breadcrumbs: BreadcrumbItem[] = useMemo(
        () => [
            { title: t('breadcrumb.dashboard'), href: '/dashboard' },
            {
                title: t('principles.breadcrumb_parent'),
                href: '/dashboard/about',
            },
            {
                title: t('breadcrumb.add_principle'),
                href: '/dashboard/principles/create',
            },
        ],
        [t],
    );

    const { data, setData, post, processing, errors } = useForm({
        text: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/dashboard/principles');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('meta.add_principle')} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between gap-2">
                    <div>
                        <h1 className="text-lg font-semibold">
                            {t('principles.create.title')}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {t('principles.create.intro')}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link
                            href="/dashboard/about"
                            className="text-xs font-medium text-muted-foreground hover:text-foreground"
                        >
                            {t('principles.create.back')}
                        </Link>
                    </div>
                </div>

                <div className="relative flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 bg-background p-6 text-sm dark:border-sidebar-border">
                    <form onSubmit={submit} className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-xs font-medium" htmlFor="text">
                                {t('principles.create.principle_text')}
                            </label>
                            <textarea
                                id="text"
                                value={data.text}
                                onChange={(e) => setData('text', e.target.value)}
                                rows={3}
                                className="w-full rounded-md border border-sidebar-border bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                                required
                            />
                            {errors.text && (
                                <p className="text-xs text-red-500">{errors.text}</p>
                            )}
                        </div>
                        <div className="flex justify-end gap-2 pt-2">
                            <Link
                                href="/dashboard/about"
                                className="inline-flex items-center rounded-md border border-sidebar-border bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
                            >
                                {t('common.cancel')}
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center rounded-md bg-primary px-4 py-1.5 text-xs font-medium text-primary-foreground shadow-sm hover:bg-primary/90 disabled:opacity-60"
                            >
                                {t('principles.create.submit')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
