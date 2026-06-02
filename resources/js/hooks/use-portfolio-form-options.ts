import { useCallback, useEffect, useRef, useState } from 'react';
import type { ListingCategoryOption } from '@/lib/portfolioListingCategories';

export type PropertyFilterOption = {
    id: number;
    key: string;
    label: string;
    is_searchable: boolean;
    is_active: boolean;
};

type PortfolioFormOptionsResponse = {
    propertyFilterOptions: PropertyFilterOption[];
    listingCategoryOptions: ListingCategoryOption[];
};

type InitialOptions = {
    propertyFilterOptions?: PropertyFilterOption[];
    listingCategoryOptions?: ListingCategoryOption[];
};

const FORM_OPTIONS_URL = '/dashboard/portfolio/form-options';
const STALE_MS = 8_000;

async function fetchFormOptions(): Promise<PortfolioFormOptionsResponse> {
    const response = await fetch(FORM_OPTIONS_URL, {
        headers: {
            Accept: 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
        },
        credentials: 'same-origin',
    });

    if (!response.ok) {
        throw new Error(`Failed to load form options (${response.status})`);
    }

    return response.json() as Promise<PortfolioFormOptionsResponse>;
}

export function usePortfolioFormOptions(initial: InitialOptions = {}) {
    const [propertyFilterOptions, setPropertyFilterOptions] = useState<PropertyFilterOption[]>(
        initial.propertyFilterOptions ?? [],
    );
    const [listingCategoryOptions, setListingCategoryOptions] = useState<ListingCategoryOption[]>(
        initial.listingCategoryOptions ?? [],
    );
    const [optionsLoading, setOptionsLoading] = useState(false);
    const [optionsError, setOptionsError] = useState<string | null>(null);
    const lastFetchedAt = useRef(0);
    const inFlight = useRef<Promise<void> | null>(null);

    const refresh = useCallback(async (force = false) => {
        const now = Date.now();
        if (!force && inFlight.current) {
            await inFlight.current;
            return;
        }
        if (!force && now - lastFetchedAt.current < STALE_MS) {
            return;
        }

        const run = async () => {
            setOptionsLoading(true);
            try {
                const data = await fetchFormOptions();
                setPropertyFilterOptions(data.propertyFilterOptions ?? []);
                setListingCategoryOptions(data.listingCategoryOptions ?? []);
                setOptionsError(null);
                lastFetchedAt.current = Date.now();
            } catch {
                setOptionsError('load_failed');
            } finally {
                setOptionsLoading(false);
                inFlight.current = null;
            }
        };

        inFlight.current = run();
        await inFlight.current;
    }, []);

    useEffect(() => {
        void refresh(true);
    }, [refresh]);

    const refreshOnDropdownFocus = useCallback(() => {
        void refresh(false);
    }, [refresh]);

    return {
        propertyFilterOptions,
        listingCategoryOptions,
        optionsLoading,
        optionsError,
        refreshOnDropdownFocus,
        refreshOptions: () => refresh(true),
    };
}
