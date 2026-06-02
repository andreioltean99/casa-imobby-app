/** Matches public property search / portfolio index filters. */
export type ListingDeal = 'sale' | 'rent';

export type ListingPropertyType =
    | 'apartment'
    | 'house'
    | 'land'
    | 'office'
    | 'commercial'
    | 'industrial';

const CATEGORY_TO_DEAL_TYPE: Record<string, { deal: ListingDeal; type: ListingPropertyType }> = {
    apartment_sale: { deal: 'sale', type: 'apartment' },
    apartment_rent: { deal: 'rent', type: 'apartment' },
    case_sale: { deal: 'sale', type: 'house' },
    house_rent: { deal: 'rent', type: 'house' },
    land_sale: { deal: 'sale', type: 'land' },
    office_sale: { deal: 'sale', type: 'office' },
    commercial_sale: { deal: 'sale', type: 'commercial' },
    commercial_rent: { deal: 'rent', type: 'commercial' },
    industrial_sale: { deal: 'sale', type: 'industrial' },
    industrial_rent: { deal: 'rent', type: 'industrial' },
};

export function listingCategoryKeyFromDealAndType(
    deal: ListingDeal,
    type: ListingPropertyType,
): string {
    const suffix = deal === 'rent' ? '_rent' : '_sale';

    switch (type) {
        case 'apartment':
            return `apartment${suffix}`;
        case 'house':
            return deal === 'rent' ? 'house_rent' : 'case_sale';
        case 'land':
            return deal === 'rent' ? '' : 'land_sale';
        case 'office':
            return deal === 'rent' ? '' : 'office_sale';
        case 'commercial':
            return `commercial${suffix}`;
        case 'industrial':
            return `industrial${suffix}`;
        default:
            return '';
    }
}

export function parseListingCategoryKey(
    key: string,
): { deal: ListingDeal; type: ListingPropertyType } | null {
    return CATEGORY_TO_DEAL_TYPE[key] ?? null;
}

export function propertyTypesForDeal(deal: ListingDeal): ListingPropertyType[] {
    if (deal === 'rent') {
        return ['apartment', 'house', 'commercial', 'industrial'];
    }

    return ['apartment', 'house', 'land', 'office', 'commercial', 'industrial'];
}
