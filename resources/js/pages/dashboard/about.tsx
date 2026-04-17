import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
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

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard() },
    { title: 'About & Principles', href: '/dashboard/about' },
];

export default function DashboardAbout({ about, aboutItems, principles }: Props) {
    const { props } = usePage<{ locale?: string; availableLocales?: string[] }>();
    const currentLocale = props.locale ?? 'en';
    const availableLocales = props.availableLocales?.length
        ? props.availableLocales
        : ['en', 'ro'];

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
        if (!confirm('Delete this key point?')) return;
        router.delete(`/dashboard/about-items/${id}`);
    };

    const deletePrinciple = (id: number) => {
        if (!confirm('Delete this principle?')) return;
        router.delete(`/dashboard/principles/${id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="About & Principles – Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between gap-2">
                    <div>
                        <h1 className="text-lg font-semibold">About & Principles</h1>
                        <p className="text-sm text-muted-foreground">
                            Edit the About Casa Imobby section and the principles list shown on the public
                            website.
                        </p>
                    </div>
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

                <div className="rounded-xl border border-sidebar-border/70 bg-background p-6 dark:border-sidebar-border">
                    <h2 className="mb-4 text-sm font-semibold">About Casa Imobby</h2>
                    <form onSubmit={submitAbout} className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-xs font-medium" htmlFor="title">
                                Section title
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
                                Body text (intro paragraphs)
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
                                Principles block heading
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
                                Save about section
                            </button>
                        </div>
                    </form>
                </div>

                <div className="rounded-xl border border-sidebar-border/70 bg-background dark:border-sidebar-border">
                    <div className="flex items-center justify-between gap-2 border-b border-sidebar-border/70 px-4 py-3">
                        <h2 className="text-sm font-semibold">Key points (Vision, Values, etc.)</h2>
                        <Link
                            href="/dashboard/about-items/create"
                            className="inline-flex items-center rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground shadow-sm hover:bg-primary/90"
                        >
                            Add key point
                        </Link>
                    </div>
                    <div className="overflow-auto">
                        <table className="min-w-full border-collapse text-xs">
                            <thead>
                                <tr className="border-b border-sidebar-border/70 bg-muted/40 text-left text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                                    <th className="px-4 py-2">Label</th>
                                    <th className="px-4 py-2">Text</th>
                                    <th className="px-4 py-2 w-20">Order</th>
                                    <th className="px-4 py-2 w-32 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {aboutItems.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={4}
                                            className="px-4 py-6 text-center text-muted-foreground"
                                        >
                                            No key points yet. Use &quot;Add key point&quot; to create
                                            one (e.g. Vision, Values, Expertise).
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
                                                    Edit
                                                </Link>
                                                {' · '}
                                                <button
                                                    type="button"
                                                    onClick={() => deleteAboutItem(item.id)}
                                                    className="text-destructive hover:underline"
                                                >
                                                    Delete
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
                        <h2 className="text-sm font-semibold">Principles</h2>
                        <Link
                            href="/dashboard/principles/create"
                            className="inline-flex items-center rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground shadow-sm hover:bg-primary/90"
                        >
                            Add principle
                        </Link>
                    </div>
                    <div className="overflow-auto">
                        <table className="min-w-full border-collapse text-xs">
                            <thead>
                                <tr className="border-b border-sidebar-border/70 bg-muted/40 text-left text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                                    <th className="px-4 py-2">Text</th>
                                    <th className="px-4 py-2 w-20">Order</th>
                                    <th className="px-4 py-2 w-32 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {principles.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={3}
                                            className="px-4 py-6 text-center text-muted-foreground"
                                        >
                                            No principles yet. Use &quot;Add principle&quot; to create
                                            one.
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
                                                    Edit
                                                </Link>
                                                {' · '}
                                                <button
                                                    type="button"
                                                    onClick={() => deletePrinciple(p.id)}
                                                    className="text-destructive hover:underline"
                                                >
                                                    Delete
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
