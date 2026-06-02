import { Link, router } from '@inertiajs/react';
import { useEffect, useMemo, useState, type Dispatch, type SetStateAction } from 'react';
import { ChevronDown, SlidersHorizontal } from 'lucide-react';
import { PublicSearchableSelect } from '@/components/public/PublicSearchableSelect';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
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
    filter_no_results?: string;
    filter_city_placeholder?: string;
    filter_value_placeholder?: string;
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
    filters_open?: string;
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
    filters_open: 'Open filters',
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

    const out: Record<string, string> = {};

    if (merged.category) {
        out.category = merged.category;
    }
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
        'flex min-h-11 touch-manipulation items-center rounded-md border px-3 py-2.5 text-sm transition-colors lg:min-h-0 lg:px-2.5 lg:py-1.5 lg:text-[13px]',
        active
            ? 'border-brand bg-brand/10 font-medium text-brand dark:border-sky-400/50 dark:bg-sky-400/10 dark:text-sky-100'
            : 'border-transparent text-muted-foreground hover:border-border/80 hover:bg-muted/40 hover:text-foreground',
    );
}

function groupToggleClass() {
    return 'flex min-h-11 w-full touch-manipulation items-center justify-between rounded-md px-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground lg:min-h-0 lg:px-0 lg:text-[11px]';
}

type ContentProps = Props & {
    pf: PortfolioFilterLabels;
    ps: Partial<PropertySearchLabels>;
    dynamicDraft: Record<string, string>;
    setDynamicDraft: Dispatch<SetStateAction<Record<string, string>>>;
    openGroups: Record<string, boolean>;
    toggleGroup: (key: string) => void;
    filterNoResults: string;
    filterCityPlaceholder: string;
    filterValuePlaceholder: string;
    citySelectOptions: Array<{ value: string; label: string }>;
    typeLabels: Record<(typeof typeKeys)[number], string>;
    navigateWithFilters: (
        patch: Partial<PropertiesFilterState & { category?: string | null }>,
    ) => void;
    showHeader?: boolean;
};

function PropertiesFiltersContent({
    filterState,
    listingsCount,
    pf,
    searchablePropertyFilters,
    dynamicDraft,
    setDynamicDraft,
    openGroups,
    toggleGroup,
    filterNoResults,
    filterCityPlaceholder,
    filterValuePlaceholder,
    citySelectOptions,
    typeLabels,
    navigateWithFilters,
    showHeader = true,
}: ContentProps) {
    const countLabel = pf.filters_listings_count.replace(':count', String(listingsCount));

    return (
        <div className="space-y-5 lg:space-y-6">
            {showHeader ? (
                <div>
                    <h2 className="text-base font-semibold tracking-tight text-foreground lg:text-sm">
                        {pf.filters_title}
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground lg:text-xs">{countLabel}</p>
                </div>
            ) : null}

            <Link
                href={PROPERTIES_INDEX_PATH}
                className="inline-flex min-h-10 touch-manipulation items-center text-sm font-medium text-brand hover:underline lg:min-h-0 lg:text-xs dark:text-sky-400"
            >
                {pf.filters_reset}
            </Link>

            {searchablePropertyFilters && searchablePropertyFilters.length > 0 ? (
                <div className="space-y-2">
                    <button
                        type="button"
                        onClick={() => toggleGroup('custom')}
                        className={groupToggleClass()}
                    >
                        <span>Caracteristici proprietate</span>
                        <ChevronDown
                            className={cn(
                                'h-4 w-4 transition-transform lg:h-3.5 lg:w-3.5',
                                openGroups.custom ? 'rotate-180' : '',
                            )}
                        />
                    </button>
                    {openGroups.custom ? (
                        <form
                            method="get"
                            action={PROPERTIES_INDEX_PATH}
                            className="space-y-4 border-l border-border/60 pl-3 lg:space-y-3 lg:pl-2"
                        >
                            {filterState.deal ? (
                                <input type="hidden" name="deal" value={filterState.deal} />
                            ) : null}
                            {filterState.type ? (
                                <input type="hidden" name="type" value={filterState.type} />
                            ) : null}
                            {filterState.city ? (
                                <input type="hidden" name="city" value={filterState.city} />
                            ) : null}
                            {filterState.category ? (
                                <input type="hidden" name="category" value={filterState.category} />
                            ) : null}
                            {filterState.q ? (
                                <input type="hidden" name="q" value={filterState.q} />
                            ) : null}
                            {searchablePropertyFilters.map((filter) => {
                                const draftValue = dynamicDraft[filter.key] ?? '';

                                return (
                                    <div key={filter.id}>
                                        {draftValue ? (
                                            <input
                                                type="hidden"
                                                name={`pf_${filter.key}`}
                                                value={draftValue}
                                            />
                                        ) : null}
                                        <PublicSearchableSelect
                                            inputId={`pf-filter-${filter.key}`}
                                            label={filter.label}
                                            value={draftValue}
                                            onChange={(next) =>
                                                setDynamicDraft((curr) => ({
                                                    ...curr,
                                                    [filter.key]: next,
                                                }))
                                            }
                                            options={filter.values.map((value) => ({
                                                value,
                                                label: value,
                                            }))}
                                            placeholder={filterValuePlaceholder}
                                            noOptionsMessage={filterNoResults}
                                            anyOptionLabel={filterValuePlaceholder}
                                        />
                                    </div>
                                );
                            })}
                            <button
                                type="submit"
                                className="h-11 w-full touch-manipulation rounded-md bg-brand px-3 text-sm font-semibold text-white hover:bg-brand/90 lg:h-auto lg:py-2 lg:text-xs dark:bg-sky-500 dark:hover:bg-sky-500/90"
                            >
                                {pf.filters_apply}
                            </button>
                        </form>
                    ) : null}
                </div>
            ) : null}

            <div className="space-y-2">
                <button
                    type="button"
                    onClick={() => toggleGroup('transaction')}
                    className={groupToggleClass()}
                >
                    <span>{pf.filters_transaction}</span>
                    <ChevronDown
                        className={cn(
                            'h-4 w-4 transition-transform lg:h-3.5 lg:w-3.5',
                            openGroups.transaction ? 'rotate-180' : '',
                        )}
                    />
                </button>
                {openGroups.transaction ? (
                    <nav className="flex flex-col gap-1 border-l border-border/60 pl-3 lg:gap-0.5 lg:pl-2">
                        <Link
                            href={PROPERTIES_INDEX_PATH}
                            className={navLinkClass(!filterState.deal && !filterState.category)}
                        >
                            {pf.filters_transaction_all}
                        </Link>
                        <Link
                            href={propertiesIndexUrl(
                                filterParams(filterState, {
                                    category: null,
                                    deal: 'sale',
                                    type: null,
                                }),
                            )}
                            className={navLinkClass(
                                filterState.deal === 'sale' && !filterState.category,
                            )}
                        >
                            {pf.filters_sale}
                        </Link>
                        <Link
                            href={propertiesIndexUrl(
                                filterParams(filterState, {
                                    category: null,
                                    deal: 'rent',
                                    type: null,
                                }),
                            )}
                            className={navLinkClass(
                                filterState.deal === 'rent' && !filterState.category,
                            )}
                        >
                            {pf.filters_rent}
                        </Link>
                    </nav>
                ) : null}
            </div>

            <div className="space-y-2">
                <button
                    type="button"
                    onClick={() => toggleGroup('type')}
                    className={groupToggleClass()}
                >
                    <span>{pf.filters_property_type}</span>
                    <ChevronDown
                        className={cn(
                            'h-4 w-4 transition-transform lg:h-3.5 lg:w-3.5',
                            openGroups.type ? 'rotate-180' : '',
                        )}
                    />
                </button>
                {openGroups.type ? (
                    <nav className="flex flex-col gap-1 border-l border-border/60 pl-3 lg:gap-0.5 lg:pl-2">
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
                                className={navLinkClass(
                                    filterState.type === tk && !filterState.category,
                                )}
                            >
                                {typeLabels[tk]}
                            </Link>
                        ))}
                    </nav>
                ) : null}
            </div>

            <div className="space-y-2">
                <button
                    type="button"
                    onClick={() => toggleGroup('city')}
                    className={groupToggleClass()}
                >
                    <span>{pf.filters_city}</span>
                    <ChevronDown
                        className={cn(
                            'h-4 w-4 transition-transform lg:h-3.5 lg:w-3.5',
                            openGroups.city ? 'rotate-180' : '',
                        )}
                    />
                </button>
                {openGroups.city ? (
                    <div className="border-l border-border/60 pl-3 lg:pl-2">
                        <PublicSearchableSelect
                            inputId="portfolio-filter-city"
                            value={filterState.city ?? ''}
                            onChange={(city) =>
                                navigateWithFilters({
                                    city: city || null,
                                })
                            }
                            options={citySelectOptions}
                            placeholder={filterCityPlaceholder}
                            noOptionsMessage={filterNoResults}
                            anyOptionLabel={pf.filters_city_any}
                        />
                    </div>
                ) : null}
            </div>
        </div>
    );
}

export function PropertiesFiltersSidebar(props: Props) {
    const pf = { ...defaultPf, ...props.portfolioFilterLabels };
    const ps = props.propertySearchLabels ?? {};
    const [dynamicDraft, setDynamicDraft] = useState<Record<string, string>>(() =>
        Object.entries(props.filterState.dynamic ?? {}).reduce(
            (acc, [k, v]) => ({ ...acc, [k]: v ?? '' }),
            {},
        ),
    );
    const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
        custom: false,
        transaction: true,
        type: false,
        city: false,
    });
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        setDynamicDraft(
            Object.entries(props.filterState.dynamic ?? {}).reduce(
                (acc, [k, v]) => ({ ...acc, [k]: v ?? '' }),
                {},
            ),
        );
    }, [props.filterState.dynamic]);

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

    const filterNoResults = ps.filter_no_results ?? 'No matching options';
    const filterCityPlaceholder = ps.filter_city_placeholder ?? pf.filters_city_any;
    const filterValuePlaceholder = ps.filter_value_placeholder ?? pf.filters_type_any;

    const citySelectOptions = useMemo(
        () => props.cityZoneOptions?.map((zone) => ({ value: zone, label: zone })) ?? [],
        [props.cityZoneOptions],
    );

    const preserveCategoryPatch = (
        patch: Partial<PropertiesFilterState & { category?: string | null }>,
    ): Partial<PropertiesFilterState & { category?: string | null }> => {
        if (props.filterState.category && patch.category === undefined) {
            return { ...patch, category: props.filterState.category };
        }

        return patch;
    };

    const navigateWithFilters = (
        patch: Partial<PropertiesFilterState & { category?: string | null }>,
    ) => {
        setMobileOpen(false);
        router.visit(
            propertiesIndexUrl(filterParams(props.filterState, preserveCategoryPatch(patch))),
            {
                preserveScroll: true,
            },
        );
    };

    const toggleGroup = (key: string) => {
        setOpenGroups((curr) => ({ ...curr, [key]: !curr[key] }));
    };

    const contentProps: ContentProps = {
        ...props,
        pf,
        ps,
        dynamicDraft,
        setDynamicDraft,
        openGroups,
        toggleGroup,
        filterNoResults,
        filterCityPlaceholder,
        filterValuePlaceholder,
        citySelectOptions,
        typeLabels,
        navigateWithFilters,
    };

    const countLabel = pf.filters_listings_count.replace(
        ':count',
        String(props.listingsCount),
    );

    return (
        <>
            <div className="lg:hidden">
                <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                    <SheetTrigger asChild>
                        <Button
                            type="button"
                            variant="outline"
                            className="h-12 w-full touch-manipulation justify-between gap-3 rounded-xl border-border/80 bg-background px-4 text-base font-medium shadow-sm"
                        >
                            <span className="inline-flex min-w-0 items-center gap-2">
                                <SlidersHorizontal className="size-4 shrink-0" aria-hidden />
                                <span className="truncate">{pf.filters_title}</span>
                            </span>
                            <span className="shrink-0 text-sm font-normal text-muted-foreground">
                                {countLabel}
                            </span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent
                        side="bottom"
                        className="flex max-h-[min(92vh,760px)] flex-col gap-0 rounded-t-2xl p-0 [&>button]:top-3.5 [&>button]:right-3.5"
                    >
                        <SheetHeader className="border-b border-border/70 px-4 py-4 pr-12 text-left">
                            <SheetTitle className="text-base font-semibold">
                                {pf.filters_title}
                            </SheetTitle>
                            <p className="text-sm text-muted-foreground">{countLabel}</p>
                        </SheetHeader>
                        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
                            <PropertiesFiltersContent
                                {...contentProps}
                                showHeader={false}
                            />
                        </div>
                    </SheetContent>
                </Sheet>
            </div>

            <aside className="hidden lg:sticky lg:top-24 lg:block lg:self-start">
                <PropertiesFiltersContent {...contentProps} />
            </aside>
        </>
    );
}
