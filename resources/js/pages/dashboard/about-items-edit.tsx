import { Head, Link, useForm } from '@inertiajs/react';
import { useMemo } from 'react';
import AppLayout from '@/layouts/app-layout';
import { useAdminT } from '@/hooks/use-admin-translations';
import type { BreadcrumbItem } from '@/types';

type AboutItem = {
    id: number;
    label: string;
    text: string;
    sort_order: number | null;
};

type Props = {
    aboutItem: AboutItem;
};

export default function DashboardAboutItemEdit({ aboutItem }: Props) {
    const t = useAdminT();
    const breadcrumbs: BreadcrumbItem[] = useMemo(
        () => [
            { title: t('breadcrumb.dashboard'), href: '/dashboard' },
            {
                title: t('about_items.breadcrumb_parent'),
                href: '/dashboard/about',
            },
            {
                title: t('breadcrumb.edit_key_point'),
                href: `/dashboard/about-items/${aboutItem.id}/edit`,
            },
        ],
        [t, aboutItem.id],
    );

    const { data, setData, put, processing, errors, delete: destroy } = useForm({
        label: aboutItem.label ?? '',
        text: aboutItem.text ?? '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/dashboard/about-items/${aboutItem.id}`);
    };

    const onDelete = () => {
        if (!confirm(t('about_items.edit.delete_confirm'))) return;
        destroy(`/dashboard/about-items/${aboutItem.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('meta.edit_key_point')} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between gap-2">
                    <div>
                        <h1 className="text-lg font-semibold">
                            {t('about_items.edit.title')}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {t('about_items.edit.intro')}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={onDelete}
                            className="inline-flex items-center rounded-md border border-destructive/40 bg-destructive/10 px-3 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/20"
                        >
                            {t('common.delete')}
                        </button>
                        <Link
                            href="/dashboard/about"
                            className="text-xs font-medium text-muted-foreground hover:text-foreground"
                        >
                            {t('about_items.edit.back')}
                        </Link>
                    </div>
                </div>

                <div className="relative flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 bg-background p-6 text-sm dark:border-sidebar-border">
                    <form onSubmit={submit} className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-xs font-medium" htmlFor="label">
                                {t('about_items.edit.label')}
                            </label>
                            <input
                                id="label"
                                type="text"
                                value={data.label}
                                onChange={(e) => setData('label', e.target.value)}
                                className="h-9 w-full rounded-md border border-sidebar-border bg-background px-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                                required
                            />
                            {errors.label && (
                                <p className="text-xs text-red-500">{errors.label}</p>
                            )}
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-medium" htmlFor="text">
                                {t('about_items.edit.text')}
                            </label>
                            <input
                                id="text"
                                type="text"
                                value={data.text}
                                onChange={(e) => setData('text', e.target.value)}
                                className="h-9 w-full rounded-md border border-sidebar-border bg-background px-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
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
                                {t('about_items.edit.save')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
