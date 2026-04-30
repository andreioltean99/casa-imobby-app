import { Link, usePage } from '@inertiajs/react';
import { PROPERTIES_INDEX_PATH } from '@/lib/public-properties-path';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useEffect, useRef, useState, type CSSProperties } from 'react';

export type PortfolioItemData = {
    id: number;
    title: string;
    slug?: string;
    short_description?: string | null;
    description: string | null;
    image_path: string | null;
    date: string | null;
    duration: string | null;
    price?: string | number | null;
};

const defaultProjects: PortfolioItemData[] = [
    { id: 0, title: 'Heat recovery system – Enerc', short_description: 'Short description summarizing the client needs, the implemented solution and impact on efficiency.', description: 'Short description summarizing the client needs, the implemented solution and impact on efficiency.', image_path: null, date: '31 August 2024', duration: '6 months' },
    { id: 1, title: 'Steam distribution – Chemi', short_description: 'Short description summarizing the client needs, the implemented solution and impact on efficiency.', description: 'Short description summarizing the client needs, the implemented solution and impact on efficiency.', image_path: null, date: '31 August 2024', duration: '6 months' },
    { id: 2, title: 'Thermal systems modernization – Helios Group', short_description: 'Short description summarizing the client needs, the implemented solution and impact on efficiency.', description: 'Short description summarizing the client needs, the implemented solution and impact on efficiency.', image_path: null, date: '31 August 2024', duration: '6 months' },
];

type Props = {
    portfolioItems?: PortfolioItemData[];
    /** On home page we show a subset and "View full portfolio"; on /portfolio we show all and can hide the button */
    showViewAll?: boolean;
    /** When false, hides the in-section title/body (e.g. properties index already has a page heading). */
    showSectionIntro?: boolean;
};

export function PortfolioSection({
    portfolioItems,
    showViewAll = true,
    showSectionIntro = true,
}: Props) {
    const { translations, locale: pageLocale } = usePage().props as {
        translations?: Record<string, unknown>;
        locale?: string;
    };
    const tPortfolio = translations?.portfolio ?? {};
    const tUnits = translations?.units ?? {};
    const localizeDuration = (value: string) => {
        if (!value) return value;
        return value
            .replace(/\byears\b/gi, tUnits.years ?? 'years')
            .replace(/\byear\b/gi, tUnits.year ?? 'year')
            .replace(/\bmonths\b/gi, tUnits.months ?? 'months')
            .replace(/\bmonth\b/gi, tUnits.month ?? 'month')
            .replace(/\bdays\b/gi, tUnits.days ?? 'days')
            .replace(/\bday\b/gi, tUnits.day ?? 'day');
    };
    const stripHtml = (value: string) =>
        value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

    const getDescriptionPreview = (value: string | null) => {
        if (!value) return '';
        const normalized = stripHtml(value);
        if (normalized.length <= 140) return normalized;
        return `${normalized.slice(0, 140).trimEnd()}...`;
    };

    const formatCardPrice = (raw: string | number | null | undefined) => {
        if (raw === null || raw === undefined || raw === '') return null;
        const num = Number(raw);
        if (Number.isNaN(num)) return null;
        const loc = pageLocale === 'en' ? 'en-RO' : 'ro-RO';
        try {
            return new Intl.NumberFormat(loc, { style: 'currency', currency: 'EUR' }).format(num);
        } catch {
            return `${num} €`;
        }
    };
    const items =
        portfolioItems && portfolioItems.length > 0 ? portfolioItems : defaultProjects;
    const sectionRef = useRef<HTMLElement | null>(null);
    const lastScrollYRef = useRef(0);
    const hasAnimatedRef = useRef(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (!sectionRef.current) {
            return;
        }

        lastScrollYRef.current = typeof window !== 'undefined' ? window.scrollY : 0;
        const observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[0];
                const currentY = typeof window !== 'undefined' ? window.scrollY : 0;
                const scrollingDown = currentY >= lastScrollYRef.current;
                lastScrollYRef.current = currentY;

                if (hasAnimatedRef.current) {
                    return;
                }

                if (entry?.isIntersecting && scrollingDown) {
                    hasAnimatedRef.current = true;
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            { threshold: 0.05, rootMargin: '0px 0px -10% 0px' },
        );

        observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <section
            ref={sectionRef}
            id="units"
            className={`space-y-6 transition-opacity duration-500 ${isVisible ? 'animate-mobile-fade-up' : ''}`}
        >
            {showSectionIntro ? (
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                    <div>
                        <h2 className="text-lg font-semibold sm:text-xl">
                            {tPortfolio.section_title ?? 'Selected projects'}
                        </h2>
                        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                            {tPortfolio.section_body ??
                                'Recent implementations that showcase our approach to heat recovery, process optimization and modernisation.'}
                        </p>
                    </div>
                    {showViewAll && (
                        <Button asChild variant="outline" size="sm">
                            <a href={PROPERTIES_INDEX_PATH}>
                                {tPortfolio.view_all ?? 'View all properties'}
                            </a>
                        </Button>
                    )}
                </div>
            ) : null}

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((project, index) => {
                    const cardContent = (
                        <Card
                            key={project.id}
                            className={`group flex h-full cursor-pointer flex-col justify-between border-border/70 bg-background/80 transition hover:-translate-y-0.5 hover:border-brand-accent/50 hover:shadow-md dark:bg-neutral-950/70 ${isVisible ? 'animate-mobile-card-pop' : ''}`}
                            style={
                                isVisible
                                    ? ({
                                          ['--mobile-card-stagger' as string]: `${index * 90}ms`,
                                      } as CSSProperties)
                                    : undefined
                            }
                        >
                            <CardContent className="space-y-3 p-4">
                                {project.image_path ? (
                                    <div className="h-28 overflow-hidden rounded-lg ring-1 ring-border/60">
                                        <img
                                            src={`/storage/${project.image_path}`}
                                            alt={project.title}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                ) : (
                                    <div className="h-28 rounded-lg bg-gradient-to-br from-neutral-100 via-neutral-50 to-brand-accent-soft ring-1 ring-border/60 dark:from-neutral-900 dark:via-neutral-900 dark:to-brand-accent/15 dark:ring-border/40" />
                                )}
                                <div className="space-y-1">
                                    <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                                        {(tPortfolio.list_item_prefix ?? 'Unit') + ' #' + (index + 1)}
                                    </p>
                                    <h3 className="text-sm font-semibold">{project.title}</h3>
                                    {formatCardPrice(project.price) ? (
                                        <p className="text-sm font-semibold text-foreground">
                                            {formatCardPrice(project.price)}
                                        </p>
                                    ) : null}
                                    {(project.short_description || project.description) && (
                                        <p className="text-xs text-muted-foreground">
                                            {getDescriptionPreview(project.short_description ?? project.description)}
                                        </p>
                                    )}
                                </div>
                                <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                                    {project.date && <span>{project.date}</span>}
                                    {project.duration && (
                                        <span>
                                            {(tPortfolio.duration_label ?? 'Duration:') + ' '}
                                            {localizeDuration(project.duration)}
                                        </span>
                                    )}
                                </div>
                                {((project.slug && project.slug.trim().length > 0) || project.id) && (
                                    <div className="pt-1 text-xs font-medium text-brand transition-colors group-hover:text-brand/90 dark:text-sky-400 dark:group-hover:text-sky-300">
                                        {tPortfolio.view_project ?? 'Vezi detalii'} &rarr;
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    );

                    const projectHref =
                        project.slug && project.slug.trim().length > 0
                            ? `/portfolio/${project.slug}`
                            : `/portfolio/${project.id}`;

                    return (
                        <Link key={project.id} href={projectHref} className="block h-full cursor-pointer">
                            {cardContent}
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}

