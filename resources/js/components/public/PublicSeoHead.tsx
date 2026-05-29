import { Head, usePage } from '@inertiajs/react';

type PublicSeoHeadProps = {
    title: string;
    description: string;
    canonicalPath?: string;
    imagePath?: string;
    type?: 'website' | 'article';
    noindex?: boolean;
    jsonLd?: Record<string, unknown> | Array<Record<string, unknown>>;
};

function absoluteUrl(baseUrl: string, path?: string): string {
    if (!path || path.trim() === '') {
        return baseUrl;
    }
    if (/^https?:\/\//i.test(path)) {
        return path;
    }
    const normalized = path.startsWith('/') ? path : `/${path}`;
    return `${baseUrl}${normalized}`;
}

export function PublicSeoHead({
    title,
    description,
    canonicalPath,
    imagePath = '/logo-casa-imobby-contact.png',
    type = 'website',
    noindex = false,
    jsonLd,
}: PublicSeoHeadProps) {
    const page = usePage<{ appUrl?: string; url?: string }>();
    const appUrl = (page.props.appUrl ?? '').trim().replace(/\/+$/, '');
    const currentPath = page.props.url ?? '/';
    const canonical = absoluteUrl(appUrl, canonicalPath ?? currentPath);
    const image = absoluteUrl(appUrl, imagePath);
    const robots = noindex ? 'noindex, nofollow' : 'index, follow';

    return (
        <Head>
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta name="robots" content={robots} />
            <link rel="canonical" href={canonical} />

            <meta property="og:type" content={type} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:url" content={canonical} />
            <meta property="og:image" content={image} />

            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />

            {jsonLd ? (
                <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
            ) : null}
        </Head>
    );
}
