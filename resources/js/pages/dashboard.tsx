import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { dashboard } from '@/routes';
import {
    EyeOff,
    LayoutGrid,
    Sparkles,
    Star,
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
    },
];

type DashboardProps = {
    projectsPublishedCount: number;
    testimonialsPublishedCount: number;
    projectsDraftCount: number;
    projectsCreatedLast30DaysCount: number;
};

export default function Dashboard({
    projectsPublishedCount,
    testimonialsPublishedCount,
    projectsDraftCount,
    projectsCreatedLast30DaysCount,
}: DashboardProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="rounded-xl border border-sidebar-border/70 bg-background/40 p-4">
                    <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-foreground">
                                Dashboard insights
                            </h2>
                            <p className="mt-1 text-xs text-muted-foreground">
                                Counts for the current site locale, updated from your database.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid auto-rows-min gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <MetricCard
                        icon={LayoutGrid}
                        title="Published projects"
                        description="Portfolio items visible on the public website"
                        value={projectsPublishedCount}
                        valueSuffix=""
                    />
                    <MetricCard
                        icon={Star}
                        title="Published testimonials"
                        description="Testimonials currently shown publicly"
                        value={testimonialsPublishedCount}
                        valueSuffix=""
                    />
                    <MetricCard
                        icon={EyeOff}
                        title="Draft projects"
                        description="Portfolio items not yet published for this locale"
                        value={projectsDraftCount}
                        valueSuffix=""
                    />
                    <MetricCard
                        icon={Sparkles}
                        title="Projects created (30 days)"
                        description="New portfolio items for this locale"
                        value={projectsCreatedLast30DaysCount}
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
