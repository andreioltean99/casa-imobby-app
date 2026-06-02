import { useMemo, useState } from 'react';
import { usePage } from '@inertiajs/react';

export type PropertySpecRow = {
    key: string;
    label: string;
    value: string;
};

const HIGHLIGHT_KEY_ORDER = [
    'camere',
    'suprafata_utila',
    'suprafata_teren',
    'tip_imobil',
    'nr_bai',
    'etaj',
    'anul_constructiei',
    'locuri_parcare',
] as const;

const HIGHLIGHT_KEYS = new Set<string>(HIGHLIGHT_KEY_ORDER);

type Props = {
    rows: PropertySpecRow[];
    heading?: string;
    detailsHeading?: string;
    showMoreLabel?: string;
    showLessLabel?: string;
    initialDetailsVisible?: number;
    showHighlights?: boolean;
    showDetails?: boolean;
};

function matchesHighlight(row: PropertySpecRow): boolean {
    if (HIGHLIGHT_KEYS.has(row.key)) {
        return true;
    }

    const haystack = `${row.key} ${row.label}`.toLowerCase();

    if (haystack.includes('camere') || haystack.includes('nr. cam')) {
        return true;
    }
    if (haystack.includes('suprafata utila') || haystack.includes('suprafață utilă')) {
        return true;
    }
    if (haystack.includes('suprafata teren') || haystack.includes('suprafață teren')) {
        return true;
    }
    if (haystack.includes('tip imobil') || haystack.includes('tip prop')) {
        return true;
    }

    return false;
}

function compactLabel(row: PropertySpecRow, locale: string): string {
    const label = row.label.toLowerCase();
    const key = row.key.toLowerCase();

    if (key === 'camere' || label.includes('nr. cam') || label.includes('camere')) {
        return locale === 'ro' ? 'Nr. camere' : 'Rooms';
    }
    if (key === 'suprafata_utila' || label.includes('suprafață utilă') || label.includes('suprafata')) {
        return locale === 'ro' ? 'Sup. utilă' : 'Usable area';
    }
    if (key === 'suprafata_teren' || label.includes('suprafață teren') || label.includes('sup. teren')) {
        return locale === 'ro' ? 'Sup. teren' : 'Land area';
    }
    if (key === 'tip_imobil' || label.includes('tip prop') || label.includes('tip imobil')) {
        return locale === 'ro' ? 'Tip prop.' : 'Property type';
    }
    if (key === 'nr_bai' || label.includes('băi') || label.includes('bai')) {
        return locale === 'ro' ? 'Nr. băi' : 'Bathrooms';
    }
    if (key === 'etaj' || label.includes('etaj')) {
        return locale === 'ro' ? 'Etaj' : 'Floor';
    }
    if (key === 'anul_constructiei' || label.includes('an construc')) {
        return locale === 'ro' ? 'An construcție' : 'Year built';
    }
    if (key === 'locuri_parcare' || label.includes('parcare')) {
        return locale === 'ro' ? 'Parcare' : 'Parking';
    }

    return row.label;
}

function sortHighlights(rows: PropertySpecRow[]): PropertySpecRow[] {
    const order = new Map(HIGHLIGHT_KEY_ORDER.map((key, index) => [key, index]));

    return [...rows].sort((a, b) => {
        const ai = order.get(a.key) ?? 999;
        const bi = order.get(b.key) ?? 999;
        return ai - bi;
    });
}

export function PropertySpecsDisplay({
    rows,
    heading,
    detailsHeading,
    showMoreLabel,
    showLessLabel,
    initialDetailsVisible = 10,
    showHighlights = true,
    showDetails = true,
}: Props) {
    const { locale } = usePage().props as { locale?: string };
    const appLocale = locale === 'en' ? 'en' : 'ro';
    const [showAllDetails, setShowAllDetails] = useState(false);

    const { highlights, details } = useMemo(() => {
        const highlightRows: PropertySpecRow[] = [];
        const detailRows: PropertySpecRow[] = [];

        for (const row of rows) {
            if (matchesHighlight(row)) {
                highlightRows.push(row);
            } else {
                detailRows.push(row);
            }
        }

        return {
            highlights: sortHighlights(highlightRows),
            details: detailRows,
        };
    }, [rows]);

    if (highlights.length === 0 && details.length === 0) {
        return null;
    }

    const visibleHighlights = showHighlights ? highlights : [];
    const hasHighlightGrid = visibleHighlights.length > 0;
    const detailRows = showDetails ? (hasHighlightGrid ? details : rows) : [];
    const visibleDetails = showAllDetails
        ? detailRows
        : detailRows.slice(0, initialDetailsVisible);
    const hiddenCount = Math.max(0, detailRows.length - initialDetailsVisible);

    return (
        <section className="space-y-4" aria-labelledby="listing-specs-heading">
            {heading ? (
                <h2
                    id="listing-specs-heading"
                    className="text-base font-semibold sm:text-lg"
                >
                    {heading}
                </h2>
            ) : null}

            {hasHighlightGrid ? (
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                    {visibleHighlights.map((row) => (
                        <div
                            key={row.key}
                            className="rounded-lg border border-border/60 bg-muted/20 px-3 py-2.5"
                        >
                            <p className="text-[11px] leading-tight text-muted-foreground">
                                {compactLabel(row, appLocale)}
                            </p>
                            <p className="mt-0.5 text-sm font-semibold leading-snug text-foreground">
                                {row.value}
                            </p>
                        </div>
                    ))}
                </div>
            ) : null}

            {detailRows.length > 0 ? (
                <div
                    className={
                        hasHighlightGrid
                            ? 'space-y-3 border-t border-border/60 pt-4'
                            : 'space-y-3'
                    }
                >
                    {hasHighlightGrid ? (
                        <h3 className="text-sm font-medium text-muted-foreground">
                            {detailsHeading ?? 'Detalii'}
                        </h3>
                    ) : null}
                    <ul className="divide-y divide-border/50 rounded-md border border-border/50">
                        {visibleDetails.map((row) => (
                            <li
                                key={row.key}
                                className="flex items-start justify-between gap-4 px-3 py-2.5 text-sm"
                            >
                                <span className="text-muted-foreground">{row.label}</span>
                                <span className="max-w-[55%] text-right font-medium text-foreground">
                                    {row.value}
                                </span>
                            </li>
                        ))}
                    </ul>
                    {hiddenCount > 0 ? (
                        <button
                            type="button"
                            onClick={() => setShowAllDetails((v) => !v)}
                            className="text-sm font-medium text-brand hover:underline dark:text-sky-400"
                        >
                            {showAllDetails
                                ? (showLessLabel ?? 'Show less')
                                : (showMoreLabel?.replace(':count', String(hiddenCount)) ??
                                      `+${hiddenCount} more`)}
                        </button>
                    ) : null}
                </div>
            ) : null}
        </section>
    );
}
