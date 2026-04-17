import { Head, Link, router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { dashboard } from '@/routes';

type PortfolioRow = {
    id: number;
    title: string;
    description: string | null;
    image_path: string | null;
    date: string | null;
    duration: string | null;
    is_published: boolean;
    sort_order: number | null;
};

type Props = {
    portfolioItems: PortfolioRow[];
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard() },
    { title: 'Portfolio', href: '/dashboard/portfolio' },
];

export default function DashboardPortfolio({ portfolioItems }: Props) {
    const { props } = usePage<{ locale?: string; availableLocales?: string[] }>();
    const currentLocale = props.locale ?? 'en';
    const availableLocales = props.availableLocales?.length
        ? props.availableLocales
        : ['en', 'ro'];

    const deleteItem = (id: number) => {
        if (!confirm('Delete this portfolio project?')) return;
        router.delete(`/dashboard/portfolio/${id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Portfolio – Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between gap-2">
                    <div>
                        <h1 className="text-lg font-semibold">Portfolio</h1>
                        <p className="text-sm text-muted-foreground">
                            Manage projects shown in the portfolio section on the public website.
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
                        <Link
                            href="/dashboard/portfolio/create"
                            className="inline-flex items-center rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground shadow-sm hover:bg-primary/90"
                        >
                            Add project
                        </Link>
                    </div>
                </div>

                <div className="relative flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 bg-background dark:border-sidebar-border">
                    <div className="border-b border-sidebar-border/70 px-4 py-3 text-xs font-medium text-muted-foreground">
                        {portfolioItems.length} project{portfolioItems.length === 1 ? '' : 's'}
                    </div>
                    <div className="overflow-auto">
                        <table className="min-w-full border-collapse text-xs">
                            <thead>
                                <tr className="border-b border-sidebar-border/70 bg-muted/40 text-left text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                                    <th className="px-4 py-2">Title</th>
                                    <th className="px-4 py-2 w-24">Published</th>
                                    <th className="px-4 py-2 w-20">Order</th>
                                    <th className="px-4 py-2 w-32 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {portfolioItems.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={4}
                                            className="px-4 py-6 text-center text-muted-foreground"
                                        >
                                            No portfolio projects yet. Use &quot;Add project&quot; to create one.
                                        </td>
                                    </tr>
                                ) : (
                                    portfolioItems.map((item) => (
                                        <tr
                                            key={item.id}
                                            className="border-b border-sidebar-border/50 hover:bg-muted/30"
                                        >
                                            <td className="max-w-md truncate px-4 py-2">
                                                {item.title}
                                            </td>
                                            <td className="px-4 py-2">
                                                {item.is_published ? (
                                                    <span className="inline-flex rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-300">
                                                        Published
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex rounded-full bg-neutral-500/10 px-2 py-0.5 text-[11px] font-medium text-neutral-600 dark:text-neutral-300">
                                                        Hidden
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-4 py-2 text-muted-foreground">
                                                {item.sort_order ?? '–'}
                                            </td>
                                            <td className="px-4 py-2 text-right">
                                                <Link
                                                    href={`/dashboard/portfolio/${item.id}/edit`}
                                                    className="text-primary hover:underline"
                                                >
                                                    Edit
                                                </Link>
                                                {' · '}
                                                <button
                                                    type="button"
                                                    onClick={() => deleteItem(item.id)}
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
