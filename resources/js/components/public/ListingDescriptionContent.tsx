import { usePage } from '@inertiajs/react';
import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
    isLikelyHtmlDescription,
    listingDescriptionContentClass,
} from '@/lib/listing-description-content';

type Props = {
    content: string;
    className?: string;
};

const LONG_TEXT_THRESHOLD = 750;

/**
 * Renders listing description with the same layout as TinyTextEditor in admin.
 * Plain-text descriptions (e.g. Imobiliare import) keep line breaks via whitespace-pre-wrap.
 */
export function ListingDescriptionContent({ content, className }: Props) {
    const { locale } = usePage().props as { locale?: string };
    const [expanded, setExpanded] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);
    const value = content.trim();

    const classNames = listingDescriptionContentClass(className);
    const plainTextLength = useMemo(
        () => value.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim().length,
        [value],
    );
    const longByCharacters = plainTextLength > LONG_TEXT_THRESHOLD;
    const [showToggle, setShowToggle] = useState(longByCharacters);

    useLayoutEffect(() => {
        const el = contentRef.current;
        if (!el || value === '') {
            setShowToggle(false);
            return;
        }

        if (expanded) {
            setShowToggle(longByCharacters);
            return;
        }

        const overflows = el.scrollHeight > el.clientHeight + 4;
        setShowToggle(longByCharacters || overflows);
    }, [value, expanded, longByCharacters]);

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
                    ref={contentRef}
                    className={contentClassName}
                    dangerouslySetInnerHTML={{ __html: value }}
                />
                {toggleButton}
            </div>
        );
    }

    return (
        <div className="space-y-2">
            <div ref={contentRef} className={contentClassName}>
                {value}
            </div>
            {toggleButton}
        </div>
    );
}
