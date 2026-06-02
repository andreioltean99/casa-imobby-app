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

const LONG_TEXT_THRESHOLD = 900;
const LONG_LINES_THRESHOLD = 8;

/**
 * Renders listing description with the same layout as TinyTextEditor in admin.
 * Plain-text descriptions (e.g. Imobiliare import) keep line breaks via whitespace-pre-wrap.
 */
export function ListingDescriptionContent({ content, className }: Props) {
    const { locale } = usePage().props as { locale?: string };
    const [expanded, setExpanded] = useState(false);
    const value = content.trim();

    const classNames = listingDescriptionContentClass(className);
    const plainTextLength = useMemo(
        () => value.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim().length,
        [value],
    );
    const explicitLines = useMemo(() => {
        const normalized = value
            .replace(/<\s*br\s*\/?>/gi, '\n')
            .replace(/<\/\s*(p|div|li|h[1-6])\s*>/gi, '\n');
        return normalized.split('\n').filter((line) => line.trim() !== '').length;
    }, [value]);
    const showToggle =
        plainTextLength > LONG_TEXT_THRESHOLD || explicitLines > LONG_LINES_THRESHOLD;

    if (value === '') {
        return null;
    }

    const showMoreLabel = locale === 'en' ? 'Show more' : 'Vezi mai mult';
    const showLessLabel = locale === 'en' ? 'Show less' : 'Vezi mai puțin';
    const isCollapsed = showToggle && !expanded;
    const contentClassName = isCollapsed
        ? `${classNames} max-h-72 overflow-hidden sm:max-h-80 lg:max-h-56`
        : classNames;

    const toggleButton = showToggle ? (
        <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="text-sm font-medium text-brand hover:underline dark:text-sky-400"
        >
            {expanded ? showLessLabel : showMoreLabel}
        </button>
    ) : null;

    if (isLikelyHtmlDescription(value)) {
        return (
            <div className="space-y-2">
                <div
                    className={contentClassName}
                    dangerouslySetInnerHTML={{ __html: value }}
                />
                {toggleButton}
            </div>
        );
    }

    return (
        <div className="space-y-2">
            <div className={contentClassName}>
                {value}
            </div>
            {toggleButton}
        </div>
    );
}
