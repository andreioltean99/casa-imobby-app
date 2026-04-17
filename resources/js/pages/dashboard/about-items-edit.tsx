import { Head, Link, useForm, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { dashboard } from '@/routes';

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
    const { props } = usePage<{ locale?: string; availableLocales?: string[] }>();
    const currentLocale = props.locale ?? 'en';
    const availableLocales = props.availableLocales?.length
        ? props.availableLocales
        : ['en', 'ro'];

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: dashboard() },
        { title: 'About & Principles', href: '/dashboard/about' },
        {
            title: 'Edit key point',
            href: `/dashboard/about-items/${aboutItem.id}/edit`,
        },
    ];

    const { data, setData, put, processing, errors, delete: destroy } = useForm({
        label: aboutItem.label ?? '',
        text: aboutItem.text ?? '',
        sort_order:
            aboutItem.sort_order != null ? String(aboutItem.sort_order) : '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/dashboard/about-items/${aboutItem.id}`);
    };

    const onDelete = () => {
        if (!confirm('Delete this key point?')) return;
        destroy(`/dashboard/about-items/${aboutItem.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit key point – Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between gap-2">
                    <div>
                        <h1 className="text-lg font-semibold">Edit key point</h1>
                        <p className="text-sm text-muted-foreground">
                            Update this key point shown in the About section.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
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
                        <button
                            type="button"
                            onClick={onDelete}
                            className="inline-flex items-center rounded-md border border-destructive/40 bg-destructive/10 px-3 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/20"
                        >
                            Delete
                        </button>
                        <Link
                            href="/dashboard/about"
                            className="text-xs font-medium text-muted-foreground hover:text-foreground"
                        >
                            Back to About & Principles
                        </Link>
                    </div>
                </div>

                <div className="relative flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 bg-background p-6 text-sm dark:border-sidebar-border">
                    <form onSubmit={submit} className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-xs font-medium" htmlFor="label">
                                Label (e.g. Vision, Values, Expertise)
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
                                Text
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
                        <div className="space-y-1">
                            <label className="text-xs font-medium" htmlFor="sort_order">
                                Sort order (optional)
                            </label>
                            <input
                                id="sort_order"
                                type="number"
                                min={0}
                                value={data.sort_order}
                                onChange={(e) => setData('sort_order', e.target.value)}
                                className="h-9 w-full max-w-[120px] rounded-md border border-sidebar-border bg-background px-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                            />
                            {errors.sort_order && (
                                <p className="text-xs text-red-500">
                                    {errors.sort_order}
                                </p>
                            )}
                        </div>
                        <div className="flex justify-end gap-2 pt-2">
                            <Link
                                href="/dashboard/about"
                                className="inline-flex items-center rounded-md border border-sidebar-border bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
                            >
                                Cancel
                            </Link>
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
