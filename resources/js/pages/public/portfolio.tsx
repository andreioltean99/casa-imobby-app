import { Link, usePage } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { Header } from '@/components/public/Header';
import {
    PropertiesFiltersSidebar,
    type PropertiesFilterState,
} from '@/components/public/PropertiesFiltersSidebar';
import { PortfolioSection, type PortfolioItemData } from '@/components/public/PortfolioSection';
import { Footer } from '@/components/public/Footer';
import { PublicSeoHead } from '@/components/public/PublicSeoHead';
import { PROPERTIES_INDEX_PATH } from '@/lib/public-properties-path';

type SearchablePropertyFilter = { id: number; key: string; label: string; values: string[] };

type Props = {
    portfolioItems?: PortfolioItemData[];
    activeListingCategory?: string | null;
    filterState?: PropertiesFilterState;
    searchablePropertyFilters?: SearchablePropertyFilter[];
    cityZoneOptions?: string[];
};

export default function PortfolioPage({
    portfolioItems,
    activeListingCategory,
    filterState,
    searchablePropertyFilters = [],
    cityZoneOptions = [],
}: Props) {
    const { props } = usePage<{ translations?: Record<string, unknown> }>();
    const backLabel = (props.translations?.common as Record<string, string> | undefined)?.back ?? 'Back';
    const tPortfolio = (props.translations?.portfolio as Record<string, unknown> | undefined) ?? {};
    const tPropertySearch = (props.translations?.property_search as Record<string, string> | undefined) ?? {};
    const pageTitle = `${(tPortfolio.section_title as string | undefined) ?? 'Properties'} – Casa Imobby`;

    const filters = filterState ?? {
        category: activeListingCategory ?? null,
        deal: null,
        type: null,
        city: null,
        q: null,
        dynamic: {},
    };

    const pfLabels = {
        filters_title: tPortfolio.filters_title as string | undefined,
        filters_reset: tPortfolio.filters_reset as string | undefined,
        filters_categories: tPortfolio.filters_categories as string | undefined,
        filters_category_all: tPortfolio.filters_category_all as string | undefined,
        filters_transaction: tPortfolio.filters_transaction as string | undefined,
        filters_transaction_all: tPortfolio.filters_transaction_all as string | undefined,
        filters_sale: tPortfolio.filters_sale as string | undefined,
        filters_rent: tPortfolio.filters_rent as string | undefined,
        filters_property_type: tPortfolio.filters_property_type as string | undefined,
        filters_type_any: tPortfolio.filters_type_any as string | undefined,
        filters_city: tPortfolio.filters_city as string | undefined,
        filters_city_any: tPortfolio.filters_city_any as string | undefined,
        filters_keyword: tPortfolio.filters_keyword as string | undefined,
        filters_keyword_placeholder: tPortfolio.filters_keyword_placeholder as string | undefined,
        filters_apply: tPortfolio.filters_apply as string | undefined,
        filters_listings_count: tPortfolio.filters_listings_count as string | undefined,
    };

    const count = portfolioItems?.length ?? 0;
    const countLabel =
        (pfLabels.filters_listings_count as string | undefined)?.replace(
            ':count',
            String(count),
        ) ?? `${count} listings`;

    return (
        <>
            <PublicSeoHead
                title={pageTitle}
                description="Explorează proprietățile Casa Imobby: apartamente, case, spații comerciale și terenuri. Folosește filtre avansate după tip, tranzacție, oraș și caracteristici."
                canonicalPath={PROPERTIES_INDEX_PATH}
            />
            <div className="min-h-screen bg-gradient-to-b from-background via-background to-neutral-50 text-foreground dark:from-neutral-950 dark:via-neutral-950 dark:to-neutral-900">
                <Header />

                <main className="mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-10 lg:py-12">
                    <div className="mb-4 flex items-center sm:mb-6">
                        <button
                            type="button"
                            onClick={() => window.history.back()}
                            className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground"
                            aria-label={backLabel}
                        >
                            <ArrowLeft className="h-4 w-4" />
                            {backLabel}
                        </button>
                    </div>

                    <div className="mb-5 space-y-2 sm:mb-6 sm:space-y-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-accent dark:text-emerald-400">
                            {(tPortfolio.page_kicker as string | undefined) ??
                                (tPortfolio.section_title as string | undefined) ??
                                'Properties'}
                        </p>
                        <h1 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl lg:text-4xl">
                            {(tPortfolio.section_title as string | undefined) ?? 'Properties'}
                        </h1>
                        <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
                            {(tPortfolio.section_body as string | undefined) ??
                                'Browse listings and use the filters to refine your search.'}
                        </p>
                        {filters.q ? (
                            <p className="text-sm text-muted-foreground">
                                <span className="font-medium text-foreground">
                                    {(tPortfolio.filters_keyword as string | undefined) ?? 'Keyword'}:
                                </span>{' '}
                                {filters.q}
                            </p>
                        ) : null}
                    </div>

                    <form
                        method="get"
                        action={PROPERTIES_INDEX_PATH}
                        className="mb-5 rounded-xl border border-border/70 bg-background/90 p-4 shadow-sm sm:mb-8"
                    >
                        {filters.deal ? <input type="hidden" name="deal" value={filters.deal} /> : null}
                        {filters.type ? <input type="hidden" name="type" value={filters.type} /> : null}
                        {filters.city ? <input type="hidden" name="city" value={filters.city} /> : null}
                        {filters.category ? <input type="hidden" name="category" value={filters.category} /> : null}
                        {Object.entries(filters.dynamic ?? {}).map(([key, value]) =>
                            value ? <input key={key} type="hidden" name={`pf_${key}`} value={value} /> : null,
                        )}
                        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                            {(tPortfolio.filters_keyword as string | undefined) ?? 'Search'}
                        </p>
                        <div className="flex flex-col gap-2 sm:flex-row">
                            <input
                                name="q"
                                type="search"
                                inputMode="search"
                                enterKeyHint="search"
                                autoComplete="off"
                                defaultValue={filters.q ?? ''}
                                placeholder={
                                    (tPortfolio.filters_keyword_placeholder as string | undefined) ??
                                    'Search by property name or any characteristic...'
                                }
                                className="h-11 w-full rounded-md border border-border bg-background px-3 text-base outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-brand sm:text-sm"
                            />
                            <button
                                type="submit"
                                className="h-11 shrink-0 rounded-md bg-brand px-5 text-sm font-semibold text-white hover:bg-brand/90 dark:bg-sky-500 dark:hover:bg-sky-500/90"
                            >
                                {(tPortfolio.filters_apply as string | undefined) ?? 'Search'}
                            </button>
                        </div>
                    </form>

                    <div className="flex flex-col gap-5 lg:grid lg:grid-cols-[minmax(0,16rem)_minmax(0,1fr)] lg:gap-12">
                        <PropertiesFiltersSidebar
                            filterState={filters}
                            listingsCount={count}
                            portfolioFilterLabels={pfLabels}
                            propertySearchLabels={tPropertySearch}
                            searchablePropertyFilters={searchablePropertyFilters}
                            cityZoneOptions={cityZoneOptions}
                        />
                        <div className="min-w-0">
                            <div className="mb-3 lg:hidden">
                                <p className="text-sm font-medium text-muted-foreground">
                                    {countLabel}
                                </p>
                            </div>
                            <PortfolioSection
                                portfolioItems={portfolioItems}
                                showViewAll={false}
                                showSectionIntro={false}
                            />
                        </div>
                    </div>
                </main>

                <Footer />
            </div>
        </>
    );
}
