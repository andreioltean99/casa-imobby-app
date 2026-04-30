import { Link } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PROPERTIES_INDEX_PATH, propertiesIndexUrl } from '@/lib/public-properties-path';

export type PropertiesFilterState = {
    category: string | null;
    deal: string | null;
    type: string | null;
    city: string | null;
    q: string | null;
    dynamic?: Record<string, string | null>;
};

type PropertySearchLabels = {
    deal_sale: string;
    deal_rent: string;
    type_apartment: string;
    type_house: string;
    type_office: string;
    type_commercial: string;
    type_industrial: string;
    type_land: string;
    city_any: string;
    city_cluj: string;
    city_bucharest: string;
    city_brasov: string;
    city_timisoara: string;
    city_sibiu: string;
    city_iasi: string;
    city_oradea: string;
    city_other: string;
};

type PortfolioFilterLabels = {
    filters_title: string;
    filters_reset: string;
    filters_categories: string;
    filters_category_all: string;
    filters_transaction: string;
    filters_transaction_all: string;
    filters_sale: string;
    filters_rent: string;
    filters_property_type: string;
    filters_type_any: string;
    filters_city: string;
    filters_city_any: string;
    filters_keyword: string;
    filters_keyword_placeholder: string;
    filters_apply: string;
    filters_listings_count: string;
};

const defaultPf: PortfolioFilterLabels = {
    filters_title: 'Filters',
    filters_reset: 'Reset',
    filters_categories: 'Categories',
    filters_category_all: 'All categories',
    filters_transaction: 'Transaction',
    filters_transaction_all: 'All',
    filters_sale: 'For sale',
    filters_rent: 'For rent',
    filters_property_type: 'Property type',
    filters_type_any: 'All types',
    filters_city: 'City / area',
    filters_city_any: 'Any location',
    filters_keyword: 'Keyword',
    filters_keyword_placeholder: 'Search…',
    filters_apply: 'Search',
    filters_listings_count: ':count listings',
};

type Props = {
    filterState: PropertiesFilterState;
    listingsCount: number;
    portfolioFilterLabels?: Partial<PortfolioFilterLabels>;
    propertySearchLabels?: Partial<PropertySearchLabels>;
    searchablePropertyFilters?: Array<{ id: number; key: string; label: string; values: string[] }>;
    cityZoneOptions?: string[];
};

const typeKeys = ['apartment', 'house', 'office', 'commercial', 'industrial', 'land'] as const;

function filterParams(
    state: PropertiesFilterState,
    patch: Partial<PropertiesFilterState & { category?: string | null }>,
): Record<string, string> {
    const merged: PropertiesFilterState = {
        category: patch.category !== undefined ? patch.category : state.category,
        deal: patch.deal !== undefined ? patch.deal : state.deal,
        type: patch.type !== undefined ? patch.type : state.type,
        city: patch.city !== undefined ? patch.city : state.city,
        q: patch.q !== undefined ? patch.q : state.q,
        dynamic: patch.dynamic !== undefined ? patch.dynamic : state.dynamic,
    };

    if (merged.category) {
        return { category: merged.category };
    }

    const out: Record<string, string> = {};
    if (merged.deal) {
        out.deal = merged.deal;
    }
    if (merged.type) {
        out.type = merged.type;
    }
    if (merged.city) {
        out.city = merged.city;
    }
    if (merged.q) {
        out.q = merged.q;
    }
    Object.entries(merged.dynamic ?? {}).forEach(([key, value]) => {
        if (value) {
            out[`pf_${key}`] = value;
        }
    });

    return out;
}

function navLinkClass(active: boolean) {
    return cn(
        'block rounded-md border px-2.5 py-1.5 text-xs transition-colors sm:text-[13px]',
        active
            ? 'border-brand bg-brand/10 font-medium text-brand dark:border-sky-400/50 dark:bg-sky-400/10 dark:text-sky-100'
            : 'border-transparent text-muted-foreground hover:border-border/80 hover:bg-muted/40 hover:text-foreground',
    );
}

export function PropertiesFiltersSidebar({
    filterState,
    listingsCount,
    portfolioFilterLabels: pfIn,
    propertySearchLabels: psIn,
    searchablePropertyFilters,
    cityZoneOptions = [],
}: Props) {
    const pf = { ...defaultPf, ...pfIn };
    const ps = psIn ?? {};
    const [dynamicDraft, setDynamicDraft] = useState<Record<string, string>>(
        () =>
            Object.entries(filterState.dynamic ?? {}).reduce(
                (acc, [k, v]) => ({ ...acc, [k]: v ?? '' }),
                {},
            ),
    );
    const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
        custom: true,
        transaction: true,
        type: true,
        city: true,
    });

    useEffect(() => {
        setDynamicDraft(
            Object.entries(filterState.dynamic ?? {}).reduce(
                (acc, [k, v]) => ({ ...acc, [k]: v ?? '' }),
                {},
            ),
        );
    }, [filterState.dynamic]);

    const typeLabels = useMemo(
        () =>
            ({
                apartment: ps.type_apartment ?? 'Apartment',
                house: ps.type_house ?? 'House',
                office: ps.type_office ?? 'Office',
                commercial: ps.type_commercial ?? 'Commercial',
                industrial: ps.type_industrial ?? 'Industrial',
                land: ps.type_land ?? 'Land',
            }) as Record<(typeof typeKeys)[number], string>,
        [ps],
    );

    const countLabel = pf.filters_listings_count.replace(':count', String(listingsCount));
    const toggleGroup = (key: string) => {
        setOpenGroups((curr) => ({ ...curr, [key]: !curr[key] }));
    };

    return (
        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <div>
                <h2 className="text-sm font-semibold tracking-tight text-foreground">{pf.filters_title}</h2>
                <p className="mt-1 text-xs text-muted-foreground">{countLabel}</p>
            </div>

            <Link
                href={PROPERTIES_INDEX_PATH}
                className="inline-flex text-xs font-medium text-brand hover:underline dark:text-sky-400"
            >
                {pf.filters_reset}
            </Link>

            {searchablePropertyFilters && searchablePropertyFilters.length > 0 ? (
                <div className="space-y-2">
                    <button type="button" onClick={() => toggleGroup('custom')} className="flex w-full items-center justify-between text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                        <span>Caracteristici proprietate</span>
                        <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', openGroups.custom ? 'rotate-180' : '')} />
                    </button>
                    {openGroups.custom ? (
                        <form method="get" action={PROPERTIES_INDEX_PATH} className="space-y-3 border-l border-border/60 pl-2">
                            {filterState.deal ? <input type="hidden" name="deal" value={filterState.deal} /> : null}
                            {filterState.type ? <input type="hidden" name="type" value={filterState.type} /> : null}
                            {filterState.city ? <input type="hidden" name="city" value={filterState.city} /> : null}
                            {filterState.category ? (
                                <input type="hidden" name="category" value={filterState.category} />
                            ) : null}
                            {filterState.q ? <input type="hidden" name="q" value={filterState.q} /> : null}
                            {searchablePropertyFilters.map((filter) => (
                                <div key={filter.id} className="space-y-1.5">
                                    <label className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                                        {filter.label}
                                    </label>
                                    <select
                                        name={`pf_${filter.key}`}
                                        value={dynamicDraft[filter.key] ?? ''}
                                        onChange={(e) =>
                                            setDynamicDraft((curr) => ({
                                                ...curr,
                                                [filter.key]: e.target.value,
                                            }))
                                        }
                                        className="h-9 w-full rounded-md border border-border bg-background px-2 text-xs outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-brand"
                                    >
                                        <option value="">{pf.filters_type_any}</option>
                                        {filter.values.map((value) => (
                                            <option key={value} value={value}>
                                                {value}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            ))}
                            <button
                                type="submit"
                                className="w-full rounded-md bg-brand px-3 py-2 text-xs font-semibold text-white hover:bg-brand/90 dark:bg-sky-500 dark:hover:bg-sky-500/90"
                            >
                                {pf.filters_apply}
                            </button>
                        </form>
                    ) : null}
                </div>
            ) : null}

            <div className="space-y-2">
                <button type="button" onClick={() => toggleGroup('transaction')} className="flex w-full items-center justify-between text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    <span>{pf.filters_transaction}</span>
                    <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', openGroups.transaction ? 'rotate-180' : '')} />
                </button>
                {openGroups.transaction ? <nav className="flex flex-col gap-0.5 border-l border-border/60 pl-2">
                    <Link href={PROPERTIES_INDEX_PATH} className={navLinkClass(!filterState.deal && !filterState.category)}>
                        {pf.filters_transaction_all}
                    </Link>
                    <Link
                        href={propertiesIndexUrl(
                            filterParams(filterState, { category: null, deal: 'sale', type: null }),
                        )}
                        className={navLinkClass(filterState.deal === 'sale' && !filterState.category)}
                    >
                        {pf.filters_sale}
                    </Link>
                    <Link
                        href={propertiesIndexUrl(
                            filterParams(filterState, { category: null, deal: 'rent', type: null }),
                        )}
                        className={navLinkClass(filterState.deal === 'rent' && !filterState.category)}
                    >
                        {pf.filters_rent}
                    </Link>
                </nav> : null}
            </div>

            <div className="space-y-2">
                <button type="button" onClick={() => toggleGroup('type')} className="flex w-full items-center justify-between text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    <span>{pf.filters_property_type}</span>
                    <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', openGroups.type ? 'rotate-180' : '')} />
                </button>
                {openGroups.type ? <nav className="flex flex-col gap-0.5 border-l border-border/60 pl-2">
                    <Link
                        href={propertiesIndexUrl(
                            filterParams(filterState, { category: null, type: null }),
                        )}
                        className={navLinkClass(!filterState.type && !filterState.category)}
                    >
                        {pf.filters_type_any}
                    </Link>
                    {typeKeys.map((tk) => (
                        <Link
                            key={tk}
                            href={propertiesIndexUrl(
                                filterParams(filterState, {
                                    category: null,
                                    type: tk,
                                    deal: filterState.deal ?? 'sale',
                                }),
                            )}
                            className={navLinkClass(filterState.type === tk && !filterState.category)}
                        >
                            {typeLabels[tk]}
                        </Link>
                    ))}
                </nav> : null}
            </div>

            <div className="space-y-2">
                <button type="button" onClick={() => toggleGroup('city')} className="flex w-full items-center justify-between text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    <span>{pf.filters_city}</span>
                    <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', openGroups.city ? 'rotate-180' : '')} />
                </button>
                {openGroups.city ? <nav className="flex flex-col gap-0.5 border-l border-border/60 pl-2">
                    <Link
                        href={propertiesIndexUrl(
                            filterParams(filterState, {
                                category: null,
                                city: null,
                            }),
                        )}
                        className={navLinkClass(!filterState.city && !filterState.category)}
                    >
                        {pf.filters_city_any}
                    </Link>
                    {cityZoneOptions.map((zone) => (
                        <Link
                            key={zone}
                            href={propertiesIndexUrl(
                                filterParams(filterState, {
                                    category: null,
                                    city: zone,
                                }),
                            )}
                            className={navLinkClass(filterState.city === zone && !filterState.category)}
                        >
                            {zone}
                        </Link>
                    ))}
                </nav> : null}
            </div>

        </aside>
    );
}
