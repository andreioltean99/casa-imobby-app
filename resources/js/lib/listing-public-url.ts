export const LISTING_REF_PREFIX = 'CIMB';

type ListingLinkItem = {
    id: number;
    slug?: string | null;
};

type ListingRefItem = ListingLinkItem & {
    external_listing_ref?: string | null;
};

export function listingPublicReference(item: ListingRefItem): string {
    const externalRef = String(item.external_listing_ref ?? '').trim();
    if (externalRef !== '') {
        return externalRef;
    }
    return `${LISTING_REF_PREFIX}-${item.id}`;
}

export function listingPublicHref(item: ListingLinkItem): string {
    const slug = String(item.slug ?? '').trim();
    if (slug !== '') {
        return `/portfolio/${slug}`;
    }
    return `/portfolio/${LISTING_REF_PREFIX.toLowerCase()}-${item.id}`;
}

export function listingPublicRefLabel(
    item: ListingRefItem,
    refWord: string = 'Ref.',
): string {
    return `${refWord} ${listingPublicReference(item)}`;
}
