import { cn } from '@/lib/utils';

/** Matches TinyTextEditor content area styling (admin + public). */
export const listingDescriptionContentClassName =
    'tiny-editor-content whitespace-pre-wrap break-words text-sm leading-7 text-justify text-foreground md:text-base ' +
    '[&>h1]:mt-3 [&>h1]:mb-2 [&>h1]:text-xl [&>h1]:font-semibold ' +
    '[&>h2]:mt-2 [&>h2]:mb-1 [&>h2]:text-lg [&>h2]:font-semibold ' +
    '[&>h3]:mt-2 [&>h3]:mb-1 [&>h3]:text-base [&>h3]:font-semibold ' +
    '[&>p]:my-2 [&>p]:leading-relaxed ' +
    '[&_a]:font-medium [&_a]:text-brand [&_a]:underline-offset-2 hover:[&_a]:underline ' +
    '[&_strong]:font-semibold [&_em]:italic ' +
    '[&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-md ' +
    '[&_table]:block [&_table]:max-w-full [&_table]:overflow-x-auto';

export function isLikelyHtmlDescription(value: string): boolean {
    return /<\s*(p|br|div|ul|ol|li|h[1-6]|strong|em|b|i|a|img|table|blockquote)\b/i.test(
        value,
    );
}

export function listingDescriptionContentClass(extra?: string): string {
    return cn(listingDescriptionContentClassName, extra);
}
