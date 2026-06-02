import { useMemo, useState } from 'react';
import { useAdminT } from '@/hooks/use-admin-translations';
import type { ListingCategoryOption } from '@/lib/portfolioListingCategories';
import {
    listingCategoryKeyFromDealAndType,
    parseListingCategoryKey,
    propertyTypesForDeal,
    type ListingDeal,
    type ListingPropertyType,
} from '@/lib/listing-category-deal-type';

type Props = {
    value: string;
    onChange: (categoryKey: string) => void;
    categoryOptions?: ListingCategoryOption[];
    error?: string;
    optionsLoading?: boolean;
    onSelectFocus?: () => void;
};

function resolveInitialState(
    value: string,
): { deal: ListingDeal; type: ListingPropertyType } {
    const parsed = value ? parseListingCategoryKey(value) : null;
    if (parsed) {
        return parsed;
    }

    return { deal: 'sale', type: 'apartment' };
}

export function ListingTypeSelector({
    value,
    onChange,
    categoryOptions = [],
    error,
    optionsLoading = false,
    onSelectFocus,
}: Props) {
    const t = useAdminT();
    const initial = resolveInitialState(value);
    const [deal, setDeal] = useState<ListingDeal>(initial.deal);
    const [propertyType, setPropertyType] = useState<ListingPropertyType>(initial.type);

    const activeKeys = useMemo(
        () =>
            new Set(
                categoryOptions
                    .filter((opt) => opt.is_active !== false)
                    .map((opt) => opt.value),
            ),
        [categoryOptions],
    );

    const categoryLabelByKey = useMemo(() => {
        const map: Record<string, string> = {};
        for (const opt of categoryOptions) {
            map[opt.value] = opt.label;
        }
        return map;
    }, [categoryOptions]);

    const applySelection = (nextDeal: ListingDeal, nextType: ListingPropertyType) => {
        setDeal(nextDeal);
        const allowedTypes = propertyTypesForDeal(nextDeal);
        const type = allowedTypes.includes(nextType) ? nextType : allowedTypes[0];
        setPropertyType(type);
        const key = listingCategoryKeyFromDealAndType(nextDeal, type);
        onChange(key && activeKeys.has(key) ? key : '');
    };

    const typeOptions = useMemo(() => propertyTypesForDeal(deal), [deal]);

    const selectedKey = listingCategoryKeyFromDealAndType(deal, propertyType);
    const selectedLabel = selectedKey ? categoryLabelByKey[selectedKey] : null;
    const combinationInvalid = selectedKey !== '' && !activeKeys.has(selectedKey);

    const typeLabel = (type: ListingPropertyType) => {
        const key = `portfolio.form.listing_property_${type}` as const;
        return t(key);
    };

    return (
        <div className="space-y-3 rounded-md border border-sidebar-border/70 bg-muted/20 p-3">
            <div>
                <div className="flex flex-wrap items-center gap-2">
                    <p className="text-xs font-medium">{t('portfolio.form.listing_type_label')}</p>
                    {optionsLoading ? (
                        <span className="text-[11px] text-muted-foreground">
                            {t('portfolio.form.options_loading')}
                        </span>
                    ) : null}
                </div>
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                    {t('portfolio.form.listing_type_hint')}
                </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                    <label className="text-xs font-medium" htmlFor="listing-deal">
                        {t('portfolio.form.listing_transaction_label')}
                    </label>
                    <select
                        id="listing-deal"
                        value={deal}
                        onChange={(e) => applySelection(e.target.value as ListingDeal, propertyType)}
                        onFocus={onSelectFocus}
                        className="h-9 w-full rounded-md border border-sidebar-border bg-background px-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                    >
                        <option value="sale">{t('portfolio.form.listing_transaction_sale')}</option>
                        <option value="rent">{t('portfolio.form.listing_transaction_rent')}</option>
                    </select>
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-medium" htmlFor="listing-property-type">
                        {t('portfolio.form.listing_property_type_label')}
                    </label>
                    <select
                        id="listing-property-type"
                        value={propertyType}
                        onChange={(e) =>
                            applySelection(deal, e.target.value as ListingPropertyType)
                        }
                        onFocus={onSelectFocus}
                        className="h-9 w-full rounded-md border border-sidebar-border bg-background px-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                    >
                        {typeOptions.map((type) => (
                            <option key={type} value={type}>
                                {typeLabel(type)}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            {selectedLabel && !combinationInvalid ? (
                <p className="text-[11px] text-muted-foreground">
                    {t('portfolio.form.listing_type_resolved')}:{' '}
                    <span className="font-medium text-foreground">{selectedLabel}</span>
                </p>
            ) : null}
            {combinationInvalid ? (
                <p className="text-xs text-amber-600 dark:text-amber-400">
                    {t('portfolio.form.listing_type_unavailable')}
                </p>
            ) : null}
            {error ? <p className="text-xs text-red-500">{error}</p> : null}
        </div>
    );
}
