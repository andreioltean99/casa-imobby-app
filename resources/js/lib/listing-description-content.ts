import { cn } from '@/lib/utils';

/** Matches TinyTextEditor content area styling (admin + public). */
const tinyEditorReadableBaseClassName =
    'tiny-editor-content whitespace-pre-wrap break-words text-sm leading-7 text-foreground md:text-base ' +
    '[&>h1]:mt-3 [&>h1]:mb-2 [&>h1]:text-xl [&>h1]:font-semibold ' +
    '[&>h2]:mt-2 [&>h2]:mb-1 [&>h2]:text-lg [&>h2]:font-semibold ' +
    '[&>h3]:mt-2 [&>h3]:mb-1 [&>h3]:text-base [&>h3]:font-semibold ' +
    '[&>p]:my-2 [&>p]:leading-relaxed [&>div]:my-2 [&>div]:leading-relaxed ' +
    '[&_a]:font-medium [&_a]:text-brand [&_a]:underline-offset-2 hover:[&_a]:underline ' +
    '[&_strong]:font-semibold [&_b]:font-semibold [&_em]:italic [&_i]:italic [&_u]:underline ' +
    '[&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-md ' +
    '[&_table]:my-3 [&_table]:block [&_table]:max-w-full [&_table]:overflow-x-auto [&_table]:border-collapse ' +
    '[&_td]:border [&_td]:border-border [&_td]:px-2 [&_td]:py-1 [&_th]:border [&_th]:border-border [&_th]:px-2 [&_th]:py-1 [&_th]:font-semibold';

export const listingDescriptionContentClassName =
    `${tinyEditorReadableBaseClassName} text-justify`;

/** Legal pages (terms, privacy): same typography as TinyTextEditor preview in admin. */
export const legalPageContentClassName = tinyEditorReadableBaseClassName;

export function isLikelyHtmlDescription(value: string): boolean {
    return /<\s*(p|br|div|ul|ol|li|h[1-6]|strong|em|b|i|a|img|table|blockquote)\b/i.test(
        value,
    );
}

export function listingDescriptionContentClass(extra?: string): string {
    return cn(listingDescriptionContentClassName, extra);
}

export function legalPageContentClass(extra?: string): string {
    return cn(legalPageContentClassName, extra);
}
