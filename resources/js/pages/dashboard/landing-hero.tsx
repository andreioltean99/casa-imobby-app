import { Head, useForm, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { TinyTextEditor } from '@/components/tiny-text-editor';

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

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Landing hero', href: '/dashboard/landing-hero' },
];

export default function DashboardLandingHero({ page }: PageProps) {
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
        locale?: string;
        availableLocales?: string[];
    }>();

    const currentLocale = props.locale ?? 'en';
    const availableLocales = props.availableLocales?.length
        ? props.availableLocales
        : ['en', 'ro'];

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put('/dashboard/landing-hero');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Landing hero – Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between gap-2">
                    <div>
                        <h1 className="text-lg font-semibold">Landing hero</h1>
                        <p className="text-sm text-muted-foreground">
                            Edit the first homepage section (hero text, CTAs and “how we work” steps).
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        {props.status && (
                            <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200">
                                {props.status}
                            </div>
                        )}
                        <div className="flex items-center gap-1 rounded-full border border-border bg-background/80 px-1 py-0.5 text-[11px] font-medium text-muted-foreground">
                            {availableLocales.map((code) => {
                                const isActive = code === currentLocale;
                                return (
                                    <a
                                        key={code}
                                        href={`/lang/${code}`}
                                        className={[
                                            'inline-flex h-6 items-center justify-center rounded-full px-2 transition-colors',
                                            isActive
                                                ? 'bg-foreground text-background'
                                                : 'hover:bg-muted hover:text-foreground',
                                        ].join(' ')}
                                    >
                                        {code.toUpperCase()}
                                    </a>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="relative flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 bg-background p-6 text-sm dark:border-sidebar-border">
                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-1">
                                <label className="text-xs font-medium" htmlFor="eyebrow">
                                    Eyebrow
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
                                    Title
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
                                Description
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
                                    Primary CTA
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
                                    Secondary CTA
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
                                End-to-end heading
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
                                <h2 className="text-sm font-semibold">End-to-end steps</h2>
                                <div className="text-xs text-muted-foreground">1–3</div>
                            </div>

                            <div className="space-y-3 rounded-lg border border-border/60 bg-background p-4">
                                <h3 className="text-sm font-medium">Step 1</h3>
                                <div className="space-y-1">
                                    <label className="text-xs font-medium" htmlFor="step1_title">
                                        Title
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
                                        Description
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
                                <h3 className="text-sm font-medium">Step 2</h3>
                                <div className="space-y-1">
                                    <label className="text-xs font-medium" htmlFor="step2_title">
                                        Title
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
                                        Description
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
                                <h3 className="text-sm font-medium">Step 3</h3>
                                <div className="space-y-1">
                                    <label className="text-xs font-medium" htmlFor="step3_title">
                                        Title
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
                                        Description
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
                                Save changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}

