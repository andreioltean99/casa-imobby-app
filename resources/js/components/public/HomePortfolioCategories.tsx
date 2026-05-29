import { Link, usePage } from '@inertiajs/react';
import { Card, CardContent } from '@/components/ui/card';
import type { PortfolioItemData } from '@/components/public/PortfolioSection';
import { listingPublicHref } from '@/lib/listing-public-url';
import { propertiesIndexUrl } from '@/lib/public-properties-path';

export type PortfolioCategoryBlock = {
    category: string;
    items: PortfolioItemData[];
};

type Props = {
    blocks: PortfolioCategoryBlock[];
    /** From database (current locale); falls back to `translations.portfolio.listing_category_titles` if omitted. */
    categoryTitles?: Record<string, string>;
};

export function HomePortfolioCategories({ blocks, categoryTitles: categoryTitlesProp }: Props) {
    const { translations, locale: pageLocale } = usePage().props as {
        translations?: Record<string, unknown>;
        locale?: string;
    };
    const tPortfolio = (translations?.portfolio as Record<string, unknown>) ?? {};
    const tUnits = (translations?.units as Record<string, string> | undefined) ?? {};
    const categoryTitlesFromLang =
        (tPortfolio.listing_category_titles as Record<string, string> | undefined) ?? {};
    const categoryTitles =
        categoryTitlesProp !== undefined && Object.keys(categoryTitlesProp).length > 0
            ? categoryTitlesProp
            : categoryTitlesFromLang;

    const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

    const getDescriptionPreview = (value: string | null) => {
        if (!value) return '';
        const normalized = stripHtml(value);
        const max = 100;
        if (normalized.length <= max) return normalized;
        return `${normalized.slice(0, max).trimEnd()}…`;
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

    const viewMore = (tPortfolio.home_listings_view_more as string | undefined) ?? 'See more';

    if (!blocks.length) {
        return null;
    }

    const imageBlock = (imagePath: string | null, priceLabel: string | null) => (
        <div className="relative aspect-video overflow-hidden rounded-md ring-1 ring-border/50">
            {imagePath ? (
                <img
                    src={`/storage/${imagePath}`}
                    alt=""
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                />
            ) : (
                <div className="h-full w-full bg-gradient-to-br from-muted to-brand-soft/35 dark:from-neutral-800 dark:to-brand/10" />
            )}
            {priceLabel ? (
                <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent px-2 pb-1.5 pt-8">
                    <p className="text-xs font-semibold tabular-nums tracking-tight text-white sm:text-sm">
                        {priceLabel}
                    </p>
                </div>
            ) : null}
        </div>
    );

    return (
        <div className="space-y-9 sm:space-y-10">
            {blocks.map((block) => (
                <section
                    key={block.category}
                    className="space-y-3 border-b border-border/60 pb-9 last:border-b-0 last:pb-0 sm:space-y-4"
                    aria-labelledby={`home-cat-${block.category}`}
                >
                    <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
                        <h2
                            id={`home-cat-${block.category}`}
                            className="text-base font-semibold tracking-tight text-foreground sm:text-lg"
                        >
                            {categoryTitles[block.category] ?? block.category}
                        </h2>
                        <Link
                            href={propertiesIndexUrl({ category: block.category })}
                            className="shrink-0 text-sm font-medium text-brand hover:underline dark:text-sky-400"
                        >
                            {viewMore} →
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
                        {block.items.map((project) => {
                            const href = listingPublicHref(project);
                            const priceLabel = formatCardPrice(project.price);
                            const hasMeta = Boolean(project.date || project.duration);
                            return (
                                <Link key={project.id} href={href} className="group block h-full">
                                    <Card className="h-full border-border/60 bg-card/90 transition hover:border-brand/35 hover:shadow-md dark:bg-card/50">
                                        <CardContent className="space-y-2 p-2.5 sm:p-3">
                                            {imageBlock(project.image_path, priceLabel)}
                                            <div className="space-y-1">
                                                <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-foreground group-hover:text-brand">
                                                    {project.title}
                                                </h3>
                                                {(project.short_description || project.description) && (
                                                    <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                                                        {getDescriptionPreview(
                                                            project.short_description ?? project.description,
                                                        )}
                                                    </p>
                                                )}
                                            </div>
                                            {hasMeta ? (
                                                <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground">
                                                    {project.date ? <span>{project.date}</span> : null}
                                                    {project.duration ? (
                                                        <span>
                                                            {(tPortfolio.duration_label as string | undefined) ??
                                                                'Duration:'}{' '}
                                                            {localizeDuration(project.duration)}
                                                        </span>
                                                    ) : null}
                                                </div>
                                            ) : null}
                                        </CardContent>
                                    </Card>
                                </Link>
                            );
                        })}
                    </div>
                </section>
            ))}
        </div>
    );
}
