import {
    isLikelyHtmlDescription,
    legalPageContentClass,
} from '@/lib/listing-description-content';

type Props = {
    content: string;
    className?: string;
};

/**
 * Renders legal page HTML with the same layout as TinyTextEditor in admin
 * (paragraph spacing, headings, lists, images, line breaks).
 */
export function LegalPageContent({ content, className }: Props) {
    const value = content.trim();

    if (value === '') {
        return null;
    }

    const classNames = legalPageContentClass(className);

    if (isLikelyHtmlDescription(value)) {
        return (
            <article
                className={classNames}
                dangerouslySetInnerHTML={{ __html: value }}
            />
        );
    }

    return <article className={classNames}>{value}</article>;
}
