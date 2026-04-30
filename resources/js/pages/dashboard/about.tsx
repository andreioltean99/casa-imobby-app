import { Head, Link, router, useForm } from '@inertiajs/react';
import { useMemo } from 'react';
import AppLayout from '@/layouts/app-layout';
import { useAdminT } from '@/hooks/use-admin-translations';
import type { BreadcrumbItem } from '@/types';
import { dashboard } from '@/routes';

type About = {
    id: number;
    title: string;
    body: string;
    principles_heading: string | null;
} | null;

type AboutItemRow = {
    id: number;
    label: string;
    text: string;
    sort_order: number | null;
};

type PrincipleRow = {
    id: number;
    text: string;
    sort_order: number | null;
};

type Props = {
    about: About;
    aboutItems: AboutItemRow[];
    principles: PrincipleRow[];
};

export default function DashboardAbout({ about, aboutItems, principles }: Props) {
    const t = useAdminT();
    const breadcrumbs: BreadcrumbItem[] = useMemo(
        () => [
            { title: t('breadcrumb.dashboard'), href: dashboard() },
            { title: t('breadcrumb.about_page'), href: '/dashboard/about' },
        ],
        [t],
    );

    const { data, setData, put, processing, errors } = useForm({
        title: about?.title ?? 'About Casa Imobby',
        body: about?.body ?? '',
        principles_heading: about?.principles_heading ?? 'Our principles',
    });

    const submitAbout = (e: React.FormEvent) => {
        e.preventDefault();
        put('/dashboard/about');
    };

    const deleteAboutItem = (id: number) => {
        if (!confirm(t('about.delete_key_point_confirm'))) return;
        router.delete(`/dashboard/about-items/${id}`);
    };

    const deletePrinciple = (id: number) => {
        if (!confirm(t('about.delete_principle_confirm'))) return;
        router.delete(`/dashboard/principles/${id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('about.meta')} />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between gap-2">
                    <div>
                        <h1 className="text-lg font-semibold">{t('about.page_title')}</h1>
                        <p className="text-sm text-muted-foreground">{t('about.page_description')}</p>
                    </div>
                </div>

                <div className="rounded-xl border border-sidebar-border/70 bg-background p-6 dark:border-sidebar-border">
                    <h2 className="mb-4 text-sm font-semibold">{t('about.section_about')}</h2>
                    <form onSubmit={submitAbout} className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-xs font-medium" htmlFor="title">
                                {t('about.section_title_label')}
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
                                {t('about.body_label')}
                            </label>
                            <textarea
                                id="body"
                                value={data.body}
                                onChange={(e) => setData('body', e.target.value)}
                                rows={5}
                                className="w-full rounded-md border border-sidebar-border bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                                required
                            />
                            {errors.body && (
                                <p className="text-xs text-red-500">{errors.body}</p>
                            )}
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-medium" htmlFor="principles_heading">
                                {t('about.principles_heading_label')}
                            </label>
                            <input
                                id="principles_heading"
                                type="text"
                                value={data.principles_heading}
                                onChange={(e) =>
                                    setData('principles_heading', e.target.value)
                                }
                                className="h-9 w-full rounded-md border border-sidebar-border bg-background px-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                            />
                            {errors.principles_heading && (
                                <p className="text-xs text-red-500">
                                    {errors.principles_heading}
                                </p>
                            )}
                        </div>
                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center rounded-md bg-primary px-4 py-1.5 text-xs font-medium text-primary-foreground shadow-sm hover:bg-primary/90 disabled:opacity-60"
                            >
                                {t('about.save_about')}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="rounded-xl border border-sidebar-border/70 bg-background dark:border-sidebar-border">
                    <div className="flex items-center justify-between gap-2 border-b border-sidebar-border/70 px-4 py-3">
                        <h2 className="text-sm font-semibold">{t('about.key_points_heading')}</h2>
                        <Link
                            href="/dashboard/about-items/create"
                            className="inline-flex items-center rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground shadow-sm hover:bg-primary/90"
                        >
                            {t('about.add_key_point')}
                        </Link>
                    </div>
                    <div className="overflow-auto">
                        <table className="min-w-full border-collapse text-xs">
                            <thead>
                                <tr className="border-b border-sidebar-border/70 bg-muted/40 text-left text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                                    <th className="px-4 py-2">{t('about.col_label')}</th>
                                    <th className="px-4 py-2">{t('about.col_text')}</th>
                                    <th className="w-20 px-4 py-2">{t('about.col_order')}</th>
                                    <th className="w-32 px-4 py-2 text-right">{t('common.actions')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {aboutItems.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={4}
                                            className="px-4 py-6 text-center text-muted-foreground"
                                        >
                                            {t('about.empty_key_points')}
                                        </td>
                                    </tr>
                                ) : (
                                    aboutItems.map((item) => (
                                        <tr
                                            key={item.id}
                                            className="border-b border-sidebar-border/50 hover:bg-muted/30"
                                        >
                                            <td className="px-4 py-2 font-medium">{item.label}</td>
                                            <td className="max-w-md truncate px-4 py-2">
                                                {item.text}
                                            </td>
                                            <td className="px-4 py-2 text-muted-foreground">
                                                {item.sort_order ?? '–'}
                                            </td>
                                            <td className="px-4 py-2 text-right">
                                                <Link
                                                    href={`/dashboard/about-items/${item.id}/edit`}
                                                    className="text-primary hover:underline"
                                                >
                                                    {t('common.edit')}
                                                </Link>
                                                {' · '}
                                                <button
                                                    type="button"
                                                    onClick={() => deleteAboutItem(item.id)}
                                                    className="text-destructive hover:underline"
                                                >
                                                    {t('common.delete')}
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="rounded-xl border border-sidebar-border/70 bg-background dark:border-sidebar-border">
                    <div className="flex items-center justify-between gap-2 border-b border-sidebar-border/70 px-4 py-3">
                        <h2 className="text-sm font-semibold">{t('about.principles_heading')}</h2>
                        <Link
                            href="/dashboard/principles/create"
                            className="inline-flex items-center rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground shadow-sm hover:bg-primary/90"
                        >
                            {t('about.add_principle')}
                        </Link>
                    </div>
                    <div className="overflow-auto">
                        <table className="min-w-full border-collapse text-xs">
                            <thead>
                                <tr className="border-b border-sidebar-border/70 bg-muted/40 text-left text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                                    <th className="px-4 py-2">{t('about.principles_col_text')}</th>
                                    <th className="w-20 px-4 py-2">{t('about.col_order')}</th>
                                    <th className="w-32 px-4 py-2 text-right">{t('common.actions')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {principles.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={3}
                                            className="px-4 py-6 text-center text-muted-foreground"
                                        >
                                            {t('about.empty_principles')}
                                        </td>
                                    </tr>
                                ) : (
                                    principles.map((p) => (
                                        <tr
                                            key={p.id}
                                            className="border-b border-sidebar-border/50 hover:bg-muted/30"
                                        >
                                            <td className="max-w-md truncate px-4 py-2">
                                                {p.text}
                                            </td>
                                            <td className="px-4 py-2 text-muted-foreground">
                                                {p.sort_order ?? '–'}
                                            </td>
                                            <td className="px-4 py-2 text-right">
                                                <Link
                                                    href={`/dashboard/principles/${p.id}/edit`}
                                                    className="text-primary hover:underline"
                                                >
                                                    {t('common.edit')}
                                                </Link>
                                                {' · '}
                                                <button
                                                    type="button"
                                                    onClick={() => deletePrinciple(p.id)}
                                                    className="text-destructive hover:underline"
                                                >
                                                    {t('common.delete')}
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
