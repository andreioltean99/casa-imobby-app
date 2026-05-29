import { Link, useForm, usePage } from '@inertiajs/react';
import {
    Bell,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    FileDown,
    ImageIcon,
    Mail,
    Phone,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Header } from '@/components/public/Header';
import { Footer } from '@/components/public/Footer';
import { PublicSeoHead } from '@/components/public/PublicSeoHead';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PROPERTIES_INDEX_PATH } from '@/lib/public-properties-path';
import {
    listingPublicHref,
    listingPublicRefLabel,
} from '@/lib/listing-public-url';

type GalleryImage = {
    id: number;
    image_path: string;
    sort_order: number | null;
};

type ListingSpec = { label: string; value: string };

type PortfolioItem = {
    id: number;
    title: string;
    slug: string;
    short_description: string | null;
    description: string | null;
    listing_specs?: ListingSpec[] | null;
    external_listing_ref?: string | null;
    external_storia_url?: string | null;
    external_imobiliare_url?: string | null;
    external_olx_url?: string | null;
    image_path: string | null;
    date: string | null;
    duration: string | null;
    price?: string | number | null;
    gallery: GalleryImage[];
    property_filter_values?: Array<{
        value: string;
        property_filter?: {
            key: string;
            name_en: string;
            name_ro: string;
        };
    }>;
};

type SimilarItem = {
    id: number;
    title: string;
    slug: string | null;
    short_description: string | null;
    image_path: string | null;
    date: string | null;
    duration: string | null;
};

type Props = {
    portfolioItem: PortfolioItem;
    similarItems: SimilarItem[];
    contact: Record<string, unknown> | null;
    listingUpdated: string | null;
    portfolioPdfUrl: string;
    portfolioPriceAlertUrl: string;
};

function listingHref(item: { id: number; slug: string | null }) {
    return listingPublicHref(item);
}

function stripHtml(html: string) {
    return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

/** Same default portrait as `ContactSection` on the home page. */
const DEFAULT_CONTACT_PERSON_PHOTO = '/contact-person-default.webp';

const STORIA_LOGO_SRC = '/images/listing-external/storia.png';
const IMOBILIARE_LOGO_SRC = '/images/listing-external/imobiliare.png';
const OLX_LOGO_SRC = '/images/listing-external/olx.png';

function ExternalListingPortals({
    tPortfolio,
    storiaUrl,
    imobiliareUrl,
    olxUrl,
}: {
    tPortfolio: Record<string, string>;
    storiaUrl: string;
    imobiliareUrl: string;
    olxUrl: string;
}) {
    if (!storiaUrl && !imobiliareUrl && !olxUrl) {
        return null;
    }

    return (
        <div className="mb-6 flex flex-col gap-3 rounded-xl border border-border/80 bg-card/70 px-4 py-4 shadow-sm ring-1 ring-black/[0.04] sm:flex-row sm:items-center sm:justify-between sm:gap-5 dark:bg-card/40 dark:ring-white/[0.05]">
            <p className="shrink-0 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground sm:min-w-[8rem]">
                {tPortfolio.external_portals_heading ?? 'Also on'}
            </p>
            <div className="flex flex-wrap items-center gap-8 sm:justify-end sm:gap-10 lg:gap-12">
                {storiaUrl ? (
                    <a
                        href={storiaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex shrink-0 rounded-md ring-offset-2 transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                        aria-label={tPortfolio.external_storia_aria ?? 'Open this listing on Storia'}
                    >
                        <img
                            src={STORIA_LOGO_SRC}
                            alt=""
                            className="h-16 w-auto max-w-[14rem] object-contain object-center sm:h-[4.75rem] sm:max-w-[17rem] lg:h-[5.25rem] lg:max-w-[18rem]"
                            width={200}
                            height={52}
                        />
                    </a>
                ) : null}
                {imobiliareUrl ? (
                    <a
                        href={imobiliareUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex shrink-0 rounded-md ring-offset-2 transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                        aria-label={
                            tPortfolio.external_imobiliare_aria ?? 'Open this listing on Imobiliare.ro'
                        }
                    >
                        <img
                            src={IMOBILIARE_LOGO_SRC}
                            alt=""
                            className="h-16 w-auto max-w-[15rem] object-contain object-center sm:h-[4.75rem] sm:max-w-[17rem] lg:h-[5.25rem] lg:max-w-[19rem]"
                            width={210}
                            height={52}
                        />
                    </a>
                ) : null}
                {olxUrl ? (
                    <a
                        href={olxUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex shrink-0 rounded-md ring-offset-2 transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                        aria-label={tPortfolio.external_olx_aria ?? 'Open this listing on OLX'}
                    >
                        <img
                            src={OLX_LOGO_SRC}
                            alt=""
                            className="h-16 w-auto max-w-[7.5rem] object-contain object-center sm:h-[4.75rem] sm:max-w-[8.5rem] lg:h-[5.25rem] lg:max-w-[9.5rem]"
                            width={140}
                            height={84}
                        />
                    </a>
                ) : null}
            </div>
        </div>
    );
}

export default function PortfolioProjectPage({
    portfolioItem,
    similarItems,
    contact,
    listingUpdated,
    portfolioPdfUrl,
    portfolioPriceAlertUrl,
}: Props) {
    const {
        title,
        short_description,
        description,
        listing_specs,
        image_path,
        date,
        duration,
        price,
        gallery,
    } = portfolioItem;
    const page = usePage<{
        translations?: Record<string, unknown>;
        url?: string;
        locale?: string;
    }>();
    const { translations, locale: appLocale } = page.props;
    const tPortfolio = (translations?.portfolio as Record<string, string> | undefined) ?? {};
    const tUnits = (translations?.units as Record<string, string> | undefined) ?? {};

    const localizeDuration = useCallback(
        (value: string) => {
            if (!value) return value;
            return value
                .replace(/\byears\b/gi, tUnits.years ?? 'years')
                .replace(/\byear\b/gi, tUnits.year ?? 'year')
                .replace(/\bmonths\b/gi, tUnits.months ?? 'months')
                .replace(/\bmonth\b/gi, tUnits.month ?? 'month')
                .replace(/\bdays\b/gi, tUnits.days ?? 'days')
                .replace(/\bday\b/gi, tUnits.day ?? 'day');
        },
        [tUnits],
    );

    const c = contact ?? {};
    const emailDisplay = ((c.email as string | undefined) ?? 'office@casa-imobby.ro').toString().trim();
    const phoneRaw = ((c.phone as string | undefined) ?? '').toString().trim();
    const telHref = phoneRaw ? `tel:${phoneRaw.replace(/\s/g, '')}` : '';
    const personName = ((c.contact_person_name as string | undefined) ?? '').toString().trim();
    const personPhotoRaw = (c.contact_person_photo_url as string | null | undefined) ?? null;
    const personPhotoUrl =
        typeof personPhotoRaw === 'string' && personPhotoRaw.trim() !== '' ? personPhotoRaw.trim() : null;
    const avatarPhotoSrc = personPhotoUrl ?? DEFAULT_CONTACT_PERSON_PHOTO;

    const itemProps = portfolioItem as unknown as Record<string, unknown>;
    const externalStoriaUrl = String(
        itemProps.external_storia_url ?? itemProps.externalStoriaUrl ?? '',
    ).trim();
    const externalImobiliareUrl = String(
        itemProps.external_imobiliare_url ?? itemProps.externalImobiliareUrl ?? '',
    ).trim();
    const externalOlxUrl = String(itemProps.external_olx_url ?? itemProps.externalOlxUrl ?? '').trim();

    const [priceAlertOpen, setPriceAlertOpen] = useState(false);
    const [priceAlertPhase, setPriceAlertPhase] = useState<'form' | 'success'>('form');

    const {
        data: alertData,
        setData: setAlertData,
        post: postAlert,
        processing: alertProcessing,
        errors: alertErrors,
        reset: resetAlert,
    } = useForm<{ email: string }>({ email: '' });

    const openPriceAlert = useCallback(() => {
        setPriceAlertPhase('form');
        setPriceAlertOpen(true);
    }, []);

    const submitPriceAlert = useCallback(
        (e: React.FormEvent) => {
            e.preventDefault();
            postAlert(portfolioPriceAlertUrl, {
                preserveScroll: true,
                onSuccess: () => {
                    resetAlert();
                    setPriceAlertPhase('success');
                },
            });
        },
        [portfolioPriceAlertUrl, postAlert, resetAlert],
    );

    const slides = useMemo(() => {
        const list: { src: string }[] = [];
        if (image_path) {
            list.push({ src: `/storage/${image_path}` });
        }
        (gallery ?? []).forEach((g) => list.push({ src: `/storage/${g.image_path}` }));
        return list;
    }, [image_path, gallery]);

    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
    const hasLightbox = lightboxIndex !== null && slides.length > 0;
    const currentLightboxSrc =
        hasLightbox && lightboxIndex !== null ? slides[lightboxIndex]?.src ?? null : null;

    const onCloseLightbox = () => setLightboxIndex(null);

    const showNext = useCallback(() => {
        if (slides.length === 0 || lightboxIndex === null) return;
        setLightboxIndex((prev) => (prev === null ? prev : (prev + 1) % slides.length));
    }, [slides.length, lightboxIndex]);

    const showPrev = useCallback(() => {
        if (slides.length === 0 || lightboxIndex === null) return;
        setLightboxIndex((prev) =>
            prev === null ? prev : (prev - 1 + slides.length) % slides.length,
        );
    }, [slides.length, lightboxIndex]);

    useEffect(() => {
        if (!hasLightbox) return;

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onCloseLightbox();
            } else if (event.key === 'ArrowRight') {
                showNext();
            } else if (event.key === 'ArrowLeft') {
                showPrev();
            }
        };

        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [hasLightbox, showNext, showPrev]);

    const plainLead = short_description?.trim() ? stripHtml(short_description) : '';
    const leadText =
        plainLead.length > 280 ? `${plainLead.slice(0, 280).trimEnd()}…` : plainLead;

    const refLabel = useMemo(
        () => listingPublicRefLabel(portfolioItem, tPortfolio.listing_ref ?? 'Ref.'),
        [portfolioItem, tPortfolio.listing_ref],
    );
    const pageDescription =
        leadText ||
        (tPortfolio.section_body ?? 'Vezi detalii complete despre această proprietate publicată de Casa Imobby.');
    const canonicalPath = listingHref({ id: portfolioItem.id, slug: portfolioItem.slug });

    const normalizeSpecLabel = useCallback((label: string) => label.trim().toLocaleLowerCase(appLocale ?? 'ro'), [appLocale]);

    const characteristicRows = useMemo(() => {
        const manualRows = Array.isArray(listing_specs)
            ? listing_specs.filter(
                  (row) =>
                      row &&
                      typeof row.label === 'string' &&
                      typeof row.value === 'string' &&
                      (row.label.trim() || row.value.trim()),
              )
            : [];
        const manualLabels = new Set(manualRows.map((row) => normalizeSpecLabel(row.label)));
        const dynamicRows = (portfolioItem.property_filter_values ?? [])
            .map((row) => {
                const filter = row.property_filter;
                if (!filter || !row.value) {
                    return null;
                }
                const label =
                    appLocale === 'ro' ? filter.name_ro || filter.name_en : filter.name_en || filter.name_ro;
                if (manualLabels.has(normalizeSpecLabel(label))) {
                    return null;
                }
                return { label, value: row.value };
            })
            .filter((row): row is { label: string; value: string } => !!row);

        return [...manualRows, ...dynamicRows];
    }, [listing_specs, portfolioItem.property_filter_values, appLocale, normalizeSpecLabel]);

    const showListingDate =
        typeof date === 'string' &&
        date.trim() !== '' &&
        !/^\d{4}$/.test(date.trim());

    const formattedPrice = useMemo(() => {
        if (price === null || price === undefined || price === '') {
            return null;
        }
        const num = Number(price);
        if (Number.isNaN(num)) {
            return null;
        }
        const loc = appLocale === 'en' ? 'en-RO' : 'ro-RO';
        try {
            return new Intl.NumberFormat(loc, { style: 'currency', currency: 'EUR' }).format(num);
        } catch {
            return `${num.toLocaleString(loc)} €`;
        }
    }, [price, appLocale]);

    const specsRows = characteristicRows;

    const galleryList = gallery ?? [];

    const photoCountForBadge = (image_path ? 1 : 0) + galleryList.length;
    const galleryCountLabel = (tPortfolio.gallery_image_count ?? ':count images').replace(
        ':count',
        String(photoCountForBadge),
    );

    return (
        <>
            <PublicSeoHead
                title={`${title} – Casa Imobby`}
                description={pageDescription}
                canonicalPath={canonicalPath}
                imagePath={image_path ? `/storage/${image_path}` : '/logo-casa-imobby-contact.png'}
                type="article"
                jsonLd={{
                    '@context': 'https://schema.org',
                    '@type': 'Offer',
                    name: title,
                    description: pageDescription,
                    availability: 'https://schema.org/InStock',
                    priceCurrency: 'EUR',
                    url: canonicalPath,
                }}
            />
            <div className="min-h-screen overflow-x-hidden bg-gradient-to-b from-background via-background to-neutral-50 text-foreground dark:from-neutral-950 dark:via-neutral-950 dark:to-neutral-900">
                <Header />

                <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:py-12">
                    <nav
                        className="mb-6 flex flex-wrap items-center gap-1 text-xs text-muted-foreground sm:text-sm"
                        aria-label="Breadcrumb"
                    >
                        <Link href="/" className="font-medium hover:text-foreground">
                            {tPortfolio.breadcrumb_home ?? 'Home'}
                        </Link>
                        <ChevronRight className="size-3.5 shrink-0 opacity-60" aria-hidden />
                        <Link href={PROPERTIES_INDEX_PATH} className="font-medium hover:text-foreground">
                            {tPortfolio.breadcrumb_portfolio ?? 'Listings'}
                        </Link>
                        <ChevronRight className="size-3.5 shrink-0 opacity-60" aria-hidden />
                        <span className="max-w-[min(100%,14rem)] truncate font-medium text-foreground sm:max-w-md">
                            {title}
                        </span>
                    </nav>

                    <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
                        <div className="min-w-0 space-y-6 lg:col-span-8">
                            <header className="space-y-3">
                                <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl lg:text-[2rem] lg:leading-tight">
                                    {title}
                                </h1>
                                {leadText ? (
                                    <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
                                        {leadText}
                                    </p>
                                ) : null}
                                <div className="flex flex-wrap gap-x-4 gap-y-2 border-b border-border/70 pb-4 text-sm text-muted-foreground">
                                    <span className="font-medium text-foreground">{refLabel}</span>
                                    {listingUpdated ? (
                                        <span>
                                            {(tPortfolio.listing_updated ?? 'Updated') + ': '}
                                            <span className="text-foreground">{listingUpdated}</span>
                                        </span>
                                    ) : null}
                                    {showListingDate ? (
                                        <span>
                                            {(tPortfolio.listing_date ?? tPortfolio.pdf_meta_date ?? 'Date') + ': '}
                                            <span className="text-foreground">{date}</span>
                                        </span>
                                    ) : null}
                                    {duration ? (
                                        <span>
                                            {(tPortfolio.duration_label ?? 'Duration:') + ' '}
                                            <span className="text-foreground">{localizeDuration(duration)}</span>
                                        </span>
                                    ) : null}
                                    {formattedPrice ? (
                                        <span>
                                            <span className="font-medium text-foreground">
                                                {(tPortfolio.listing_price_label ?? 'Price') + ': '}
                                            </span>
                                            <span className="text-foreground">{formattedPrice}</span>
                                        </span>
                                    ) : null}
                                </div>
                            </header>

                            <ExternalListingPortals
                                tPortfolio={tPortfolio}
                                storiaUrl={externalStoriaUrl}
                                imobiliareUrl={externalImobiliareUrl}
                                olxUrl={externalOlxUrl}
                            />

                            {image_path ? (
                                <button
                                    type="button"
                                    className="group relative block w-full overflow-hidden rounded-xl ring-1 ring-border/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                                    onClick={() => setLightboxIndex(0)}
                                    aria-label={tPortfolio.project_gallery ?? 'Gallery'}
                                >
                                    <img
                                        src={`/storage/${image_path}`}
                                        alt=""
                                        fetchPriority="high"
                                        decoding="async"
                                        className="aspect-[4/3] w-full max-h-[min(88vh,40rem)] object-cover transition duration-300 group-hover:scale-[1.01] sm:aspect-[3/2] sm:max-h-[min(90vh,46rem)] lg:aspect-[16/10] lg:max-h-[min(92vh,52rem)]"
                                    />
                                    <span className="absolute bottom-3 right-3 rounded-full bg-black/55 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                                        {galleryCountLabel}
                                    </span>
                                </button>
                            ) : (
                                <div
                                    className="flex min-h-[12rem] flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border/80 bg-muted/25 px-6 py-12 text-center text-muted-foreground ring-1 ring-border/40 sm:min-h-[14rem]"
                                    aria-hidden
                                >
                                    <ImageIcon className="size-12 opacity-35" strokeWidth={1.25} />
                                    <p className="max-w-md text-sm leading-relaxed">
                                        {tPortfolio.gallery_hero_placeholder ??
                                            'Main photo (upload from the admin dashboard)'}
                                    </p>
                                </div>
                            )}

                            {galleryList.length > 0 ? (
                                <section className="space-y-3" aria-labelledby="listing-gallery-more-heading">
                                    <h2
                                        id="listing-gallery-more-heading"
                                        className="text-base font-semibold sm:text-lg"
                                    >
                                        {tPortfolio.project_gallery ?? 'Gallery'}
                                    </h2>
                                    <div className="-mx-1 px-1 sm:-mx-2 sm:px-2">
                                        <div
                                            className="flex touch-pan-x snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain pb-2 pt-1 [scrollbar-width:thin] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-track]:bg-transparent"
                                            aria-label={tPortfolio.project_gallery ?? 'Gallery thumbnails'}
                                            role="region"
                                        >
                                            {galleryList.map((img, index) => (
                                                <button
                                                    key={img.id}
                                                    type="button"
                                                    className="w-44 shrink-0 snap-start overflow-hidden rounded-lg ring-1 ring-border/60 transition hover:ring-brand/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand sm:w-52 lg:w-56"
                                                    onClick={() => setLightboxIndex(image_path ? index + 1 : index)}
                                                >
                                                    <img
                                                        src={`/storage/${img.image_path}`}
                                                        alt=""
                                                        loading="lazy"
                                                        decoding="async"
                                                        className="aspect-[4/3] h-full w-full object-cover"
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </section>
                            ) : null}

                            {specsRows.length > 0 ? (
                                <section className="space-y-3" aria-labelledby="listing-specs-heading">
                                    <h2
                                        id="listing-specs-heading"
                                        className="text-base font-semibold sm:text-lg"
                                    >
                                        {tPortfolio.specs_heading ?? 'Characteristics'}
                                    </h2>
                                    <dl className="divide-y divide-border/80 rounded-xl border border-border/70 bg-card/40 text-sm shadow-sm ring-1 ring-black/[0.03] dark:bg-card/30 dark:ring-white/[0.04]">
                                        {specsRows.map((row, index) => (
                                            <div
                                                key={`${row.label}-${index}`}
                                                className="grid gap-1 px-4 py-3 sm:grid-cols-[minmax(0,11rem)_1fr] sm:items-baseline sm:gap-6"
                                            >
                                                <dt className="font-medium text-foreground">{row.label}</dt>
                                                <dd className="text-muted-foreground">{row.value}</dd>
                                            </div>
                                        ))}
                                    </dl>
                                </section>
                            ) : null}

                            {description ? (
                                <section className="space-y-3">
                                    <h2 className="text-base font-semibold sm:text-lg">
                                        {tPortfolio.description_heading ?? 'Description'}
                                    </h2>
                                    <div
                                        className="prose prose-sm max-w-none text-muted-foreground dark:prose-invert sm:prose-base
                                        prose-p:leading-relaxed
                                        [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-md
                                        [&_video]:max-w-full
                                        [&_iframe]:aspect-video [&_iframe]:w-full
                                        [&_table]:block [&_table]:w-full [&_table]:overflow-x-auto
                                        [&_pre]:whitespace-pre-wrap [&_pre]:break-words"
                                        dangerouslySetInnerHTML={{ __html: description }}
                                    />
                                </section>
                            ) : null}
                        </div>

                        <aside className="lg:col-span-4">
                            <div className="space-y-4 lg:sticky lg:top-28">
                                <Card className="border-border/80 bg-card shadow-md ring-1 ring-black/[0.04] dark:ring-white/[0.06]">
                                    <CardContent className="p-5 sm:p-6">
                                        <div className="space-y-4">
                                            <div>
                                                <h2 className="text-base font-semibold">
                                                    {tPortfolio.sidebar_interested_title ??
                                                        'Interested in this listing?'}
                                                </h2>
                                                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                                    {tPortfolio.sidebar_interested_body ??
                                                        'Leave us your contact details and we will help you with next steps.'}
                                                </p>
                                            </div>
                                            {personName || personPhotoUrl ? (
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={avatarPhotoSrc}
                                                        alt=""
                                                        className="size-12 shrink-0 rounded-full object-cover object-center ring-1 ring-border/80"
                                                    />
                                                    {personName ? (
                                                        <p className="min-w-0 text-sm font-medium leading-snug text-foreground">
                                                            {personName}
                                                        </p>
                                                    ) : null}
                                                </div>
                                            ) : null}
                                        </div>
                                        <div className="mt-8 flex flex-col gap-2">
                                            {phoneRaw ? (
                                                <Button
                                                    asChild
                                                    size="lg"
                                                    className="w-full justify-center gap-2 border-0 bg-gradient-to-r from-brand to-brand-accent text-white shadow-md transition-[filter,box-shadow] hover:brightness-105 hover:shadow-lg focus-visible:ring-white/40 dark:hover:brightness-110"
                                                >
                                                    <a href={telHref}>
                                                        <Phone className="size-4 shrink-0" aria-hidden />
                                                        {tPortfolio.cta_phone ?? 'Call'} {phoneRaw}
                                                    </a>
                                                </Button>
                                            ) : null}
                                            <Button asChild variant="outline" className="w-full justify-center gap-2">
                                                <a href={`mailto:${emailDisplay}`}>
                                                    <Mail className="size-4 shrink-0" aria-hidden />
                                                    {emailDisplay}
                                                </a>
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                                <div className="flex flex-col gap-2">
                                    <Button
                                        type="button"
                                        size="lg"
                                        className="w-full justify-center gap-2 border border-amber-300/70 bg-amber-100 font-semibold text-amber-950 shadow-sm hover:bg-amber-200/90 dark:border-amber-700/50 dark:bg-amber-950/45 dark:text-amber-50 dark:hover:bg-amber-900/55"
                                        onClick={openPriceAlert}
                                    >
                                        <Bell className="size-4 shrink-0" aria-hidden />
                                        {tPortfolio.price_drop_cta ?? 'Notify me if the price drops'}
                                    </Button>
                                    <Button
                                        asChild
                                        size="lg"
                                        className="w-full justify-center gap-2 border-0 bg-primary font-semibold text-primary-foreground shadow-md hover:bg-primary/90"
                                    >
                                        <a href={portfolioPdfUrl} target="_blank" rel="noopener noreferrer">
                                            <FileDown className="size-4 shrink-0" aria-hidden />
                                            {tPortfolio.download_pdf ?? 'Download PDF'}
                                        </a>
                                    </Button>
                                </div>
                            </div>
                        </aside>
                    </div>

                    {similarItems.length > 0 ? (
                        <section className="mt-12 border-t border-border/70 pt-10 sm:mt-14 sm:pt-12">
                            <h2 className="text-lg font-semibold sm:text-xl">
                                {tPortfolio.similar_heading ?? 'Similar listings'}
                            </h2>
                            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                {similarItems.map((item) => (
                                    <Link
                                        key={item.id}
                                        href={listingHref(item)}
                                        className="group block rounded-xl border border-border/70 bg-card/90 p-3 shadow-sm ring-1 ring-black/[0.03] transition hover:-translate-y-0.5 hover:border-brand/35 hover:shadow-md dark:bg-card/50 dark:ring-white/[0.04]"
                                    >
                                        {item.image_path ? (
                                            <div className="aspect-[4/3] overflow-hidden rounded-lg">
                                                <img
                                                    src={`/storage/${item.image_path}`}
                                                    alt=""
                                                    loading="lazy"
                                                    decoding="async"
                                                    className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                                                />
                                            </div>
                                        ) : (
                                            <div className="aspect-[4/3] rounded-lg bg-gradient-to-br from-muted to-brand-soft/40 dark:from-neutral-800 dark:to-brand/10" />
                                        )}
                                        <p className="mt-3 line-clamp-2 text-sm font-semibold leading-snug text-foreground group-hover:text-brand">
                                            {item.title}
                                        </p>
                                        {item.date ? (
                                            <p className="mt-1 text-xs text-muted-foreground">{item.date}</p>
                                        ) : null}
                                        <p className="mt-2 text-xs font-medium text-brand dark:text-sky-400">
                                            {tPortfolio.view_listing ?? 'View listing'} →
                                        </p>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    ) : null}

                    <p className="mt-10 text-center sm:mt-12">
                        <Link
                            href={PROPERTIES_INDEX_PATH}
                            className="text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                        >
                            {tPortfolio.back_link ?? '← Back to unit list'}
                        </Link>
                    </p>
                </main>

                {hasLightbox && currentLightboxSrc && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/88 px-2 sm:px-4"
                        onClick={onCloseLightbox}
                        role="presentation"
                    >
                        <button
                            type="button"
                            className="absolute right-3 top-3 z-30 rounded-full bg-white/15 px-3 py-1.5 text-sm font-medium text-white backdrop-blur-sm hover:bg-white/25 sm:right-5 sm:top-5"
                            onClick={(e) => {
                                e.stopPropagation();
                                onCloseLightbox();
                            }}
                        >
                            {tPortfolio.lightbox_close ?? 'Close'}
                        </button>
                        <div
                            className="relative z-[1] mx-auto flex max-h-[92vh] max-w-[min(100vw-1rem,1400px)] items-center justify-center"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {slides.length > 1 ? (
                                <div className="absolute inset-0 z-0 flex min-h-[min(60vh,22rem)]">
                                    <button
                                        type="button"
                                        className="h-full min-h-[12rem] flex-1 cursor-w-resize bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 sm:min-h-0"
                                        aria-label={tPortfolio.lightbox_prev ?? 'Previous image'}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            showPrev();
                                        }}
                                    />
                                    <button
                                        type="button"
                                        className="h-full min-h-[12rem] flex-1 cursor-e-resize bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 sm:min-h-0"
                                        aria-label={tPortfolio.lightbox_next ?? 'Next image'}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            showNext();
                                        }}
                                    />
                                </div>
                            ) : null}
                            <img
                                src={currentLightboxSrc}
                                alt=""
                                className="relative z-10 max-h-[min(90vh,52rem)] max-w-full rounded-lg object-contain shadow-2xl pointer-events-none select-none"
                            />
                            {slides.length > 1 ? (
                                <>
                                    <button
                                        type="button"
                                        className="absolute left-1 top-1/2 z-20 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-white shadow-md backdrop-blur-sm transition hover:bg-black/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 sm:left-3 sm:size-12"
                                        aria-label={tPortfolio.lightbox_prev ?? 'Previous image'}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            showPrev();
                                        }}
                                    >
                                        <ChevronLeft className="size-7 sm:size-8" strokeWidth={2} aria-hidden />
                                    </button>
                                    <button
                                        type="button"
                                        className="absolute right-1 top-1/2 z-20 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-white shadow-md backdrop-blur-sm transition hover:bg-black/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 sm:right-3 sm:size-12"
                                        aria-label={tPortfolio.lightbox_next ?? 'Next image'}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            showNext();
                                        }}
                                    >
                                        <ChevronRight className="size-7 sm:size-8" strokeWidth={2} aria-hidden />
                                    </button>
                                    <p className="pointer-events-none absolute bottom-2 left-1/2 z-20 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-xs font-medium text-white/95 backdrop-blur-sm">
                                        {lightboxIndex !== null ? lightboxIndex + 1 : 0} / {slides.length}
                                    </p>
                                </>
                            ) : null}
                        </div>
                    </div>
                )}

                <Dialog
                    open={priceAlertOpen}
                    onOpenChange={(open) => {
                        setPriceAlertOpen(open);
                        if (!open) {
                            setPriceAlertPhase('form');
                        }
                    }}
                >
                    <DialogContent className="sm:max-w-md">
                        {priceAlertPhase === 'success' ? (
                            <div className="flex flex-col items-center gap-4 py-2 text-center">
                                <CheckCircle2
                                    className="size-14 shrink-0 text-emerald-600 dark:text-emerald-400"
                                    aria-hidden
                                />
                                <DialogHeader className="sm:text-center">
                                    <DialogTitle>
                                        {tPortfolio.price_alert_success_title ?? 'Your request was saved'}
                                    </DialogTitle>
                                    <DialogDescription className="text-base text-muted-foreground">
                                        {tPortfolio.price_alert_success ??
                                            'Thank you! We will email you when the price drops.'}
                                    </DialogDescription>
                                </DialogHeader>
                                <Button
                                    type="button"
                                    className="mt-1 w-full sm:w-auto"
                                    onClick={() => {
                                        setPriceAlertOpen(false);
                                        setPriceAlertPhase('form');
                                    }}
                                >
                                    {tPortfolio.price_alert_ok ?? 'OK'}
                                </Button>
                            </div>
                        ) : (
                            <form onSubmit={submitPriceAlert}>
                                <DialogHeader>
                                    <DialogTitle>
                                        {tPortfolio.price_alert_modal_title ?? 'Notify me if the price drops'}
                                    </DialogTitle>
                                    <DialogDescription>
                                        {tPortfolio.price_alert_modal_description ??
                                            'Enter your email address. We will email you if the price is reduced.'}
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-2 py-2">
                                    <Label htmlFor="price-alert-email">
                                        {tPortfolio.price_alert_email_label ?? 'Email address'}
                                    </Label>
                                    <Input
                                        id="price-alert-email"
                                        type="email"
                                        autoComplete="email"
                                        value={alertData.email}
                                        placeholder={
                                            tPortfolio.price_alert_email_placeholder ?? 'you@example.com'
                                        }
                                        onChange={(e) => setAlertData('email', e.target.value)}
                                        required
                                    />
                                    {alertErrors.email ? (
                                        <p className="text-sm text-destructive">{alertErrors.email}</p>
                                    ) : null}
                                </div>
                                <DialogFooter>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setPriceAlertOpen(false)}
                                    >
                                        {tPortfolio.price_alert_cancel ?? 'Cancel'}
                                    </Button>
                                    <Button type="submit" disabled={alertProcessing}>
                                        {tPortfolio.price_alert_submit ?? 'Subscribe'}
                                    </Button>
                                </DialogFooter>
                            </form>
                        )}
                    </DialogContent>
                </Dialog>

                <Footer />
            </div>
        </>
    );
}
