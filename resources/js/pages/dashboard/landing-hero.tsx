import { Head, useForm, usePage } from '@inertiajs/react';
import { useMemo } from 'react';
import AppLayout from '@/layouts/app-layout';
import { useAdminT } from '@/hooks/use-admin-translations';
import type { BreadcrumbItem } from '@/types';
import { TinyTextEditor } from '@/components/tiny-text-editor';
import { dashboard } from '@/routes';

type PageProps = {
    page: {
        locale: string;
        eyebrow: string | null;
        title: string | null;
        body: string | null;
        primary_cta: string | null;
        secondary_cta: string | null;

        end_to_end_heading: string | null;

        step1_title: string | null;
        step1_body: string | null;
        step2_title: string | null;
        step2_body: string | null;
        step3_title: string | null;
        step3_body: string | null;
    };
};

export default function DashboardLandingHero({ page }: PageProps) {
    const t = useAdminT();

    const breadcrumbs: BreadcrumbItem[] = useMemo(
        () => [
            { title: t('breadcrumb.dashboard'), href: dashboard() },
            { title: t('breadcrumb.homepage_hero'), href: '/dashboard/landing-hero' },
        ],
        [t],
    );

    const { data, setData, processing, put, errors } = useForm({
        eyebrow: page.eyebrow ?? '',
        title: page.title ?? '',
        body: page.body ?? '',
        primary_cta: page.primary_cta ?? '',
        secondary_cta: page.secondary_cta ?? '',

        end_to_end_heading: page.end_to_end_heading ?? 'How we work with you',

        step1_title: page.step1_title ?? '',
        step1_body: page.step1_body ?? '',
        step2_title: page.step2_title ?? '',
        step2_body: page.step2_body ?? '',
        step3_title: page.step3_title ?? '',
        step3_body: page.step3_body ?? '',
    });

    const { props } = usePage<{
        status?: string;
    }>();

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put('/dashboard/landing-hero');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('landing_hero.meta')} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between gap-2">
                    <div>
                        <h1 className="text-lg font-semibold">{t('landing_hero.title')}</h1>
                        <p className="text-sm text-muted-foreground">{t('landing_hero.intro')}</p>
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
                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-1">
                                <label className="text-xs font-medium" htmlFor="eyebrow">
                                    {t('landing_hero.form.eyebrow')}
                                </label>
                                <input
                                    id="eyebrow"
                                    type="text"
                                    value={data.eyebrow}
                                    onChange={(e) => setData('eyebrow', e.target.value)}
                                    className="h-9 w-full rounded-md border border-sidebar-border bg-background px-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                                    required
                                />
                                {errors.eyebrow && (
                                    <p className="text-xs text-red-500">{errors.eyebrow}</p>
                                )}
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-medium" htmlFor="title">
                                    {t('landing_hero.form.main_title')}
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
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-medium" htmlFor="body">
                                {t('landing_hero.form.description')}
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

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-1">
                                <label className="text-xs font-medium" htmlFor="primary_cta">
                                    {t('landing_hero.form.primary_cta')}
                                </label>
                                <input
                                    id="primary_cta"
                                    type="text"
                                    value={data.primary_cta}
                                    onChange={(e) => setData('primary_cta', e.target.value)}
                                    className="h-9 w-full rounded-md border border-sidebar-border bg-background px-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                                    required
                                />
                                {errors.primary_cta && (
                                    <p className="text-xs text-red-500">{errors.primary_cta}</p>
                                )}
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-medium" htmlFor="secondary_cta">
                                    {t('landing_hero.form.secondary_cta')}
                                </label>
                                <input
                                    id="secondary_cta"
                                    type="text"
                                    value={data.secondary_cta}
                                    onChange={(e) => setData('secondary_cta', e.target.value)}
                                    className="h-9 w-full rounded-md border border-sidebar-border bg-background px-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                                    required
                                />
                                {errors.secondary_cta && (
                                    <p className="text-xs text-red-500">{errors.secondary_cta}</p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label
                                className="text-xs font-medium"
                                htmlFor="end_to_end_heading"
                            >
                                {t('landing_hero.form.end_to_end_heading')}
                            </label>
                            <input
                                id="end_to_end_heading"
                                type="text"
                                value={data.end_to_end_heading}
                                onChange={(e) =>
                                    setData('end_to_end_heading', e.target.value)
                                }
                                className="h-9 w-full rounded-md border border-sidebar-border bg-background px-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                                required
                            />
                            {errors.end_to_end_heading && (
                                <p className="text-xs text-red-500">
                                    {errors.end_to_end_heading}
                                </p>
                            )}
                        </div>

                        <div className="space-y-3 rounded-xl border border-border/60 bg-muted/40 p-4">
                            <div className="flex items-center justify-between gap-2">
                                <h2 className="text-sm font-semibold">{t('landing_hero.form.steps_heading')}</h2>
                                <div className="text-xs text-muted-foreground">{t('landing_hero.form.steps_range')}</div>
                            </div>

                            <div className="space-y-3 rounded-lg border border-border/60 bg-background p-4">
                                <h3 className="text-sm font-medium">{t('landing_hero.form.step_1')}</h3>
                                <div className="space-y-1">
                                    <label className="text-xs font-medium" htmlFor="step1_title">
                                        {t('landing_hero.form.main_title')}
                                    </label>
                                    <input
                                        id="step1_title"
                                        type="text"
                                        value={data.step1_title}
                                        onChange={(e) => setData('step1_title', e.target.value)}
                                        className="h-9 w-full rounded-md border border-sidebar-border bg-background px-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-medium" htmlFor="step1_body">
                                        {t('landing_hero.form.description')}
                                    </label>
                                    <TinyTextEditor
                                        id="step1_body"
                                        value={data.step1_body}
                                        onChange={(val) => setData('step1_body', val)}
                                        className="w-full"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3 rounded-lg border border-border/60 bg-background p-4">
                                <h3 className="text-sm font-medium">{t('landing_hero.form.step_2')}</h3>
                                <div className="space-y-1">
                                    <label className="text-xs font-medium" htmlFor="step2_title">
                                        {t('landing_hero.form.main_title')}
                                    </label>
                                    <input
                                        id="step2_title"
                                        type="text"
                                        value={data.step2_title}
                                        onChange={(e) => setData('step2_title', e.target.value)}
                                        className="h-9 w-full rounded-md border border-sidebar-border bg-background px-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-medium" htmlFor="step2_body">
                                        {t('landing_hero.form.description')}
                                    </label>
                                    <TinyTextEditor
                                        id="step2_body"
                                        value={data.step2_body}
                                        onChange={(val) => setData('step2_body', val)}
                                        className="w-full"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3 rounded-lg border border-border/60 bg-background p-4">
                                <h3 className="text-sm font-medium">{t('landing_hero.form.step_3')}</h3>
                                <div className="space-y-1">
                                    <label className="text-xs font-medium" htmlFor="step3_title">
                                        {t('landing_hero.form.main_title')}
                                    </label>
                                    <input
                                        id="step3_title"
                                        type="text"
                                        value={data.step3_title}
                                        onChange={(e) => setData('step3_title', e.target.value)}
                                        className="h-9 w-full rounded-md border border-sidebar-border bg-background px-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-medium" htmlFor="step3_body">
                                        {t('landing_hero.form.description')}
                                    </label>
                                    <TinyTextEditor
                                        id="step3_body"
                                        value={data.step3_body}
                                        onChange={(val) => setData('step3_body', val)}
                                        className="w-full"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center rounded-md bg-primary px-4 py-1.5 text-xs font-medium text-primary-foreground shadow-sm hover:bg-primary/90 disabled:opacity-60"
                            >
                                {t('landing_hero.form.save')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
