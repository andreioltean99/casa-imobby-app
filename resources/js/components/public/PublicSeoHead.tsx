import { Head, usePage } from '@inertiajs/react';
import {
    absolutePublicUrl,
    normalizeJsonLd,
    resolveAppOrigin,
} from '@/lib/site-origin';

type PublicSeoHeadProps = {
    title: string;
    description: string;
    canonicalPath?: string;
    imagePath?: string;
    type?: 'website' | 'article';
    noindex?: boolean;
    jsonLd?: Record<string, unknown> | Array<Record<string, unknown>>;
};

export function PublicSeoHead({
    title,
    description,
    canonicalPath,
    imagePath = '/logo-casa-imobby-contact.png',
    type = 'website',
    noindex = false,
    jsonLd,
}: PublicSeoHeadProps) {
    const page = usePage<{
        appUrl?: string;
        url?: string;
        locale?: string;
        websiteUi?: { brand?: { site_name?: string } };
        translations?: { brand?: { site_name?: string } };
    }>();
    const appUrl = resolveAppOrigin(page.props.appUrl);
    const currentPath = page.props.url ?? '/';
    const canonical = absolutePublicUrl(appUrl, canonicalPath ?? currentPath);
    const image = absolutePublicUrl(appUrl, imagePath);
    const robots = noindex ? 'noindex, nofollow' : 'index, follow';
    const siteName =
        page.props.websiteUi?.brand?.site_name ??
        page.props.translations?.brand?.site_name ??
        'Casa Imobby';
    const ogLocale = (page.props.locale ?? 'ro') === 'en' ? 'en_RO' : 'ro_RO';
    const structuredData = jsonLd ? normalizeJsonLd(jsonLd, appUrl) : null;

    return (
        <Head>
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta name="robots" content={robots} />
            <link rel="canonical" href={canonical} />

            <meta property="og:type" content={type} />
            <meta property="og:site_name" content={siteName} />
            <meta property="og:locale" content={ogLocale} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:url" content={canonical} />
            <meta property="og:image" content={image} />

            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />

            {structuredData ? (
                <script type="application/ld+json">
                    {JSON.stringify(structuredData)}
                </script>
            ) : null}
        </Head>
    );
}
