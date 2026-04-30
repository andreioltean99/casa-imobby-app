import { Head, useForm, usePage } from '@inertiajs/react';
import { useMemo } from 'react';
import AppLayout from '@/layouts/app-layout';
import { useAdminT } from '@/hooks/use-admin-translations';
import type { BreadcrumbItem } from '@/types';
import { TinyTextEditor } from '@/components/tiny-text-editor';
import { dashboard } from '@/routes';

type Props = {
    page: {
        id: number;
        title: string;
        body: string;
    };
};

export default function DashboardLegalTerms({ page }: Props) {
    const t = useAdminT();

    const breadcrumbs: BreadcrumbItem[] = useMemo(
        () => [
            { title: t('breadcrumb.dashboard'), href: dashboard() },
            { title: t('breadcrumb.legal'), href: '/dashboard/legal/terms' },
            { title: t('breadcrumb.terms'), href: '/dashboard/legal/terms' },
        ],
        [t],
    );

    const { data, setData, processing, put, errors } = useForm({
        title: page.title ?? '',
        body: page.body ?? '',
    });
    const { props } = usePage<{
        status?: string;
    }>();

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put('/dashboard/legal/terms');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('legal.terms_meta')} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between gap-2">
                    <div>
                        <h1 className="text-lg font-semibold">{t('legal.terms_title')}</h1>
                        <p className="text-sm text-muted-foreground">{t('legal.terms_intro')}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        {props.status && (
                            <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200">
                                {props.status}
                            </div>
                        )}
                    </div>
                </div>

                <div className="relative flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 bg-background p-6 text-sm dark:border-sidebar-border">
                    <form onSubmit={submit} className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-xs font-medium" htmlFor="title">
                                {t('common.title')}
                            </label>
                            <input
                                id="title"
                                type="text"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                className="h-9 w-full rounded-md border border-sidebar-border bg-background px-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                                required
                            />
                            {errors.title && (
                                <p className="text-xs text-red-500">{errors.title}</p>
                            )}
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-medium" htmlFor="body">
                                {t('legal.content_label')}
                            </label>
                            <TinyTextEditor
                                id="body"
                                value={data.body}
                                onChange={(val) => setData('body', val)}
                                className="w-full"
                            />
                            {errors.body && (
                                <p className="text-xs text-red-500">{errors.body}</p>
                            )}
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center rounded-md bg-primary px-4 py-1.5 text-xs font-medium text-primary-foreground shadow-sm hover:bg-primary/90 disabled:opacity-60"
                            >
                                {t('legal.save')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
