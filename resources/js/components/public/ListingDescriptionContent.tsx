import { usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import {
    isLikelyHtmlDescription,
    listingDescriptionContentClass,
} from '@/lib/listing-description-content';

type Props = {
    content: string;
    className?: string;
};

/**
 * Renders listing description with the same layout as TinyTextEditor in admin.
 * Plain-text descriptions (e.g. Imobiliare import) keep line breaks via whitespace-pre-wrap.
 */
export function ListingDescriptionContent({ content, className }: Props) {
    const { locale } = usePage().props as { locale?: string };
    const [expanded, setExpanded] = useState(false);
    const value = content.trim();
    if (value === '') {
        return null;
    }

    const classNames = listingDescriptionContentClass(className);
    const plainTextLength = useMemo(
        () => value.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim().length,
        [value],
    );
    const shouldCollapse = plainTextLength > 1200;
    const showMoreLabel = locale === 'en' ? 'Show more' : 'Vezi mai mult';
    const showLessLabel = locale === 'en' ? 'Show less' : 'Vezi mai puțin';
    const contentClassName =
        shouldCollapse && !expanded ? `${classNames} max-h-80 overflow-hidden` : classNames;

    if (isLikelyHtmlDescription(value)) {
        return (
            <div className="space-y-2">
                <div
                    className={contentClassName}
                    dangerouslySetInnerHTML={{ __html: value }}
                />
                {shouldCollapse ? (
                    <button
                        type="button"
                        onClick={() => setExpanded((v) => !v)}
                        className="text-sm font-medium text-brand hover:underline dark:text-sky-400"
                    >
                        {expanded ? showLessLabel : showMoreLabel}
                    </button>
                ) : null}
            </div>
        );
    }

    return (
        <div className="space-y-2">
            <div className={contentClassName}>{value}</div>
            {shouldCollapse ? (
                <button
                    type="button"
                    onClick={() => setExpanded((v) => !v)}
                    className="text-sm font-medium text-brand hover:underline dark:text-sky-400"
                >
                    {expanded ? showLessLabel : showMoreLabel}
                </button>
            ) : null}
        </div>
    );
}
