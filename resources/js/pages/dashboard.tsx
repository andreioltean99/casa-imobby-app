import { Head } from '@inertiajs/react';
import { useMemo } from 'react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { dashboard } from '@/routes';
import { useAdminT } from '@/hooks/use-admin-translations';
import {
    EyeOff,
    LayoutGrid,
    Sparkles,
    Star,
} from 'lucide-react';

type DashboardProps = {
    listingsPublishedCount: number;
    testimonialsPublishedCount: number;
    listingsDraftCount: number;
    listingsCreatedLast30DaysCount: number;
};

export default function Dashboard({
    listingsPublishedCount,
    testimonialsPublishedCount,
    listingsDraftCount,
    listingsCreatedLast30DaysCount,
}: DashboardProps) {
    const t = useAdminT();

    const breadcrumbs: BreadcrumbItem[] = useMemo(
        () => [
            {
                title: t('breadcrumb.dashboard'),
                href: dashboard(),
            },
        ],
        [t],
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('meta.dashboard')} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="rounded-xl border border-sidebar-border/70 bg-background/40 p-4">
                    <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-foreground">
                                {t('dashboard.intro_title')}
                            </h2>
                            <p className="mt-1 text-xs text-muted-foreground">
                                {t('dashboard.intro_body')}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid auto-rows-min gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <MetricCard
                        icon={LayoutGrid}
                        title={t('dashboard.metric_published_listings')}
                        description={t('dashboard.metric_published_listings_desc')}
                        value={listingsPublishedCount}
                        valueSuffix=""
                    />
                    <MetricCard
                        icon={Star}
                        title={t('dashboard.metric_testimonials')}
                        description={t('dashboard.metric_testimonials_desc')}
                        value={testimonialsPublishedCount}
                        valueSuffix=""
                    />
                    <MetricCard
                        icon={EyeOff}
                        title={t('dashboard.metric_drafts')}
                        description={t('dashboard.metric_drafts_desc')}
                        value={listingsDraftCount}
                        valueSuffix=""
                    />
                    <MetricCard
                        icon={Sparkles}
                        title={t('dashboard.metric_new_30d')}
                        description={t('dashboard.metric_new_30d_desc')}
                        value={listingsCreatedLast30DaysCount}
                        valueSuffix=""
                    />
                </div>
            </div>
        </AppLayout>
    );
}

type MetricCardProps = {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    description: string;
    value: number;
    valueSuffix?: string;
};

function MetricCard({
    icon: Icon,
    title,
    description,
    value,
    valueSuffix,
}: MetricCardProps) {
    return (
        <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70 bg-background p-4 dark:border-sidebar-border">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <h3 className="text-sm font-medium text-foreground">{title}</h3>
                    <p className="mt-1 text-xs text-muted-foreground">{description}</p>
                </div>
                <Icon className="h-5 w-5 text-primary" />
            </div>

            <div className="mt-4 flex items-end justify-between">
                <span className="text-3xl font-semibold text-foreground">
                    {value}
                    {valueSuffix ? <span className="text-sm font-medium">{valueSuffix}</span> : null}
                </span>
            </div>
        </div>
    );
}
