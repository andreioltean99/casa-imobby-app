import { Link, usePage } from '@inertiajs/react';
import { MapPin, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { MobileFilterSelect } from '@/components/public/MobileFilterSelect';
import { SearchableFilterSelect, type SearchableFilterOption } from '@/components/public/SearchableFilterSelect';
import { cn } from '@/lib/utils';
import { propertiesIndexUrl } from '@/lib/public-properties-path';

type Deal = 'sale' | 'rent';

type PropertySearchCopy = {
    heading: string;
    subheading: string;
    deal_sale: string;
    deal_rent: string;
    type_label: string;
    type_apartment: string;
    type_house: string;
    type_office: string;
    type_commercial: string;
    type_industrial: string;
    type_land: string;
    city_label: string;
    city_any: string;
    city_cluj: string;
    city_bucharest: string;
    city_brasov: string;
    city_timisoara: string;
    city_sibiu: string;
    city_iasi: string;
    city_oradea: string;
    city_other: string;
    filter_no_results: string;
    filter_city_placeholder: string;
    submit_search: string;
};

const defaultCopy: PropertySearchCopy = {
    heading: 'Find a property',
    subheading: 'Tell us what you are looking for — we will match you with suitable listings.',
    deal_sale: 'For sale',
    deal_rent: 'For rent',
    type_label: 'Property type',
    type_apartment: 'Apartment',
    type_house: 'House',
    type_office: 'Office space',
    type_commercial: 'Commercial space',
    type_industrial: 'Industrial space',
    type_land: 'Land',
    city_label: 'City / area',
    city_any: 'Any city',
    city_cluj: 'Cluj-Napoca',
    city_bucharest: 'Bucharest',
    city_brasov: 'Brașov',
    city_timisoara: 'Timișoara',
    city_sibiu: 'Sibiu',
    city_iasi: 'Iași',
    city_oradea: 'Oradea',
    city_other: 'Other areas',
    filter_no_results: 'No matching options',
    filter_city_placeholder: 'Search city or area…',
    submit_search: 'Search',
};

function buildPortfolioHref(deal: Deal, city: string, propertyType: string | null): string {
    const params: Record<string, string> = { deal };
    if (propertyType) {
        params.type = propertyType;
    }
    if (city && city !== 'any') {
        params.city = city;
    }
    return propertiesIndexUrl(params);
}

export function PropertySearchStrip() {
    const page = usePage();
    const pageProps = page.props as {
        translations?: { property_search?: Partial<PropertySearchCopy> };
        propertySearchOptions?: { types?: string[]; cityZones?: string[] };
    };
    const raw = pageProps.translations
        ?.property_search;
    const t = { ...defaultCopy, ...raw };
    const [deal, setDeal] = useState<Deal>('sale');
    const [propertyType, setPropertyType] = useState<string | null>(null);
    const [city, setCity] = useState('any');

    const availableTypes = pageProps.propertySearchOptions?.types ?? [];
    const typeLabelByKey = useMemo(
        () => ({
            apartment: t.type_apartment,
            house: t.type_house,
            office: t.type_office,
            commercial: t.type_commercial,
            industrial: t.type_industrial,
            land: t.type_land,
        }),
        [t],
    );
    const typeChips = useMemo(
        () =>
            availableTypes
                .filter((value) => value in typeLabelByKey)
                .map((value) => ({
                    value,
                    label: typeLabelByKey[value as keyof typeof typeLabelByKey],
                })),
        [availableTypes, typeLabelByKey],
    );

    const cityZones = pageProps.propertySearchOptions?.cityZones ?? [];
    const cityOptions: SearchableFilterOption[] = useMemo(
        () => [
            { value: 'any', label: t.city_any },
            ...cityZones.map((zone) => ({ value: zone, label: zone })),
        ],
        [t, cityZones],
    );

    const portfolioHref = useMemo(
        () => buildPortfolioHref(deal, city, propertyType),
        [deal, city, propertyType],
    );

    return (
        <section
            aria-label={t.heading}
            className="relative overflow-hidden rounded-xl border border-border/60 bg-gradient-to-b from-card to-background/90 p-4 shadow-md ring-1 ring-black/[0.03] dark:from-neutral-950 dark:to-neutral-950/85 dark:ring-white/[0.05] sm:p-5"
        >
            <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/25 to-transparent"
            />
            <div className="relative flex w-full flex-col items-stretch gap-4">
                <header className="w-full space-y-1 text-left md:max-w-2xl">
                    <h2 className="text-balance text-base font-semibold tracking-tight text-foreground sm:text-lg">
                        {t.heading}
                    </h2>
                    <p className="text-pretty text-xs leading-snug text-muted-foreground sm:text-sm">{t.subheading}</p>
                </header>

                <div className="flex w-full flex-col items-start gap-2.5">
                    <div
                        className="inline-flex shrink-0 rounded-lg border border-border/70 bg-muted/40 p-0.5 dark:bg-muted/25"
                        role="tablist"
                        aria-label={`${t.deal_sale} / ${t.deal_rent}`}
                    >
                        <button
                            type="button"
                            role="tab"
                            aria-selected={deal === 'sale'}
                            className={cn(
                                'rounded-md px-4 py-2 text-xs font-semibold transition-all sm:px-5 sm:text-sm',
                                deal === 'sale'
                                    ? 'bg-background text-foreground shadow-sm ring-1 ring-border/60 dark:bg-neutral-900 dark:ring-white/10'
                                    : 'text-muted-foreground hover:text-foreground',
                            )}
                            onClick={() => setDeal('sale')}
                        >
                            {t.deal_sale}
                        </button>
                        <button
                            type="button"
                            role="tab"
                            aria-selected={deal === 'rent'}
                            className={cn(
                                'rounded-md px-4 py-2 text-xs font-semibold transition-all sm:px-5 sm:text-sm',
                                deal === 'rent'
                                    ? 'bg-background text-foreground shadow-sm ring-1 ring-border/60 dark:bg-neutral-900 dark:ring-white/10'
                                    : 'text-muted-foreground hover:text-foreground',
                            )}
                            onClick={() => setDeal('rent')}
                        >
                            {t.deal_rent}
                        </button>
                    </div>

                    <fieldset className="w-full">
                        <legend className="sr-only">{t.type_label}</legend>
                        <div
                            className="flex flex-wrap justify-start gap-1.5 sm:gap-2"
                            role="group"
                            aria-label={t.type_label}
                        >
                            {typeChips.map(({ value, label }) => {
                                const selected = propertyType === value;
                                return (
                                    <button
                                        key={value}
                                        type="button"
                                        aria-pressed={selected}
                                        onClick={() =>
                                            setPropertyType((prev) => (prev === value ? null : value))
                                        }
                                        className={cn(
                                            'rounded-full border px-2.5 py-1.5 text-xs font-medium transition-colors sm:px-3 sm:text-[13px]',
                                            selected
                                                ? 'border-brand bg-brand/10 text-brand shadow-sm dark:border-sky-400/60 dark:bg-sky-400/15 dark:text-sky-100'
                                                : 'border-border/70 bg-background/90 text-muted-foreground hover:border-brand/35 hover:text-foreground dark:bg-neutral-950/80',
                                        )}
                                    >
                                        {label}
                                    </button>
                                );
                            })}
                        </div>
                    </fieldset>
                </div>

                <div className="w-full space-y-3">
                    <div className="space-y-3 md:hidden">
                        <MobileFilterSelect
                            inputId="property-search-city"
                            label={t.city_label}
                            value={city === 'any' ? '' : city}
                            onChange={(next) => setCity(next || 'any')}
                            options={cityZones.map((zone) => ({
                                value: zone,
                                label: zone,
                            }))}
                            placeholder={t.filter_city_placeholder}
                            noOptionsMessage={t.filter_no_results}
                            clearLabel={t.city_any}
                        />
                        <Button
                            asChild
                            className="h-12 w-full touch-manipulation gap-1.5 rounded-lg text-base font-semibold"
                        >
                            <Link href={portfolioHref} prefetch>
                                <Search className="size-4 opacity-90" />
                                {t.submit_search}
                            </Link>
                        </Button>
                    </div>
                    <div className="hidden md:block">
                        <SearchableFilterSelect
                            id="property-search-city-desktop"
                            label={t.city_label}
                            value={city}
                            onValueChange={setCity}
                            options={cityOptions}
                            placeholder={t.filter_city_placeholder}
                            noResultsLabel={t.filter_no_results}
                            leadingIcon={
                                <MapPin className="size-4 shrink-0" strokeWidth={2} aria-hidden />
                            }
                            inlineEnd={
                                <Button
                                    asChild
                                    className="h-11 shrink-0 gap-1.5 rounded-lg px-5 text-sm font-semibold whitespace-nowrap"
                                >
                                    <Link href={portfolioHref} prefetch>
                                        <Search className="size-4 opacity-90" />
                                        {t.submit_search}
                                    </Link>
                                </Button>
                            }
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
