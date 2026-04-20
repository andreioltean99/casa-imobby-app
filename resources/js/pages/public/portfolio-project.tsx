import { Head, Link, usePage } from '@inertiajs/react';
import { Bell, ChevronRight, FileDown, Mail, Phone } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Header } from '@/components/public/Header';
import { Footer } from '@/components/public/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

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
    listing_pdf_path?: string | null;
    image_path: string | null;
    date: string | null;
    duration: string | null;
    gallery: GalleryImage[];
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
};

function listingHref(item: { id: number; slug: string | null }) {
    if (item.slug && item.slug.trim().length > 0) {
        return `/portfolio/${item.slug}`;
    }
    return `/portfolio/${item.id}`;
}

function stripHtml(html: string) {
    return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

export default function PortfolioProjectPage({
    portfolioItem,
    similarItems,
    contact,
    listingUpdated,
}: Props) {
    const {
        title,
        short_description,
        description,
        listing_specs,
        external_listing_ref,
        listing_pdf_path,
        image_path,
        date,
        duration,
        gallery,
    } = portfolioItem;
    const page = usePage<{ translations?: Record<string, unknown>; url?: string }>();
    const { translations } = page.props;
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

    const refLabel = `${tPortfolio.listing_ref ?? 'Ref.'} CIM-${portfolioItem.id}`;

    const listingLinkForMail =
        typeof window !== 'undefined' ? window.location.href : (page.props.url ?? '').toString();

    const priceDropMailto = useMemo(() => {
        const subject = tPortfolio.price_drop_subject ?? 'Price notification';
        const bodyTemplate = tPortfolio.price_drop_body ?? '';
        const body = bodyTemplate.replaceAll(':ref', refLabel).replaceAll(':link', listingLinkForMail);
        return `mailto:${emailDisplay}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    }, [emailDisplay, listingLinkForMail, refLabel, tPortfolio.price_drop_body, tPortfolio.price_drop_subject]);

    const specsRows = useMemo(() => {
        if (!Array.isArray(listing_specs)) {
            return [];
        }
        return listing_specs.filter(
            (row) =>
                row &&
                typeof row.label === 'string' &&
                typeof row.value === 'string' &&
                (row.label.trim() || row.value.trim()),
        );
    }, [listing_specs]);

    return (
        <>
            <Head title={`${title} – Casa Imobby`} />
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
                        <Link href="/portfolio" className="font-medium hover:text-foreground">
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
                                    {date ? <span>{date}</span> : null}
                                    {duration ? (
                                        <span>
                                            {(tPortfolio.duration_label ?? 'Duration:') + ' '}
                                            <span className="text-foreground">{localizeDuration(duration)}</span>
                                        </span>
                                    ) : null}
                                </div>
                            </header>

                            {image_path ? (
                                gallery && gallery.length > 0 ? (
                                    <button
                                        type="button"
                                        className="group relative block w-full overflow-hidden rounded-xl ring-1 ring-border/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                                        onClick={() => setLightboxIndex(0)}
                                        aria-label={tPortfolio.project_gallery ?? 'Gallery'}
                                    >
                                        <img
                                            src={`/storage/${image_path}`}
                                            alt=""
                                            className="aspect-[21/9] max-h-[min(70vh,28rem)] w-full object-cover transition duration-300 group-hover:scale-[1.02] sm:aspect-[2/1] sm:max-h-[32rem]"
                                        />
                                        <span className="absolute bottom-3 right-3 rounded-full bg-black/55 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                                            {gallery.length + 1}{' '}
                                            {tPortfolio.gallery_images_suffix ?? 'images'}
                                        </span>
                                    </button>
                                ) : (
                                    <div className="overflow-hidden rounded-xl ring-1 ring-border/60">
                                        <img
                                            src={`/storage/${image_path}`}
                                            alt=""
                                            className="aspect-[21/9] max-h-[min(70vh,28rem)] w-full object-cover sm:aspect-[2/1] sm:max-h-[32rem]"
                                        />
                                    </div>
                                )
                            ) : null}

                            {gallery && gallery.length > 0 ? (
                                <section className="space-y-3">
                                    <h2 className="text-base font-semibold sm:text-lg">
                                        {tPortfolio.project_gallery ?? 'Gallery'}
                                    </h2>
                                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4">
                                        {gallery.map((img, index) => (
                                            <button
                                                key={img.id}
                                                type="button"
                                                className="overflow-hidden rounded-lg ring-1 ring-border/60 transition hover:ring-brand/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                                                onClick={() =>
                                                    setLightboxIndex(image_path ? index + 1 : index)
                                                }
                                            >
                                                <img
                                                    src={`/storage/${img.image_path}`}
                                                    alt=""
                                                    className="aspect-[4/3] h-full w-full object-cover"
                                                />
                                            </button>
                                        ))}
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
                                    {external_listing_ref?.trim() ? (
                                        <p className="border-t border-border/60 pt-4 text-sm text-muted-foreground">
                                            <span className="font-medium text-foreground">
                                                {tPortfolio.external_ref_label ?? 'External ID'}
                                                {': '}
                                            </span>
                                            {external_listing_ref.trim()}
                                        </p>
                                    ) : null}
                                </section>
                            ) : external_listing_ref?.trim() ? (
                                <section className="rounded-xl border border-border/70 bg-muted/20 px-4 py-3 text-sm text-muted-foreground">
                                    <span className="font-medium text-foreground">
                                        {tPortfolio.external_ref_label ?? 'External ID'}
                                        {': '}
                                    </span>
                                    {external_listing_ref.trim()}
                                </section>
                            ) : null}
                        </div>

                        <aside className="lg:col-span-4">
                            <div className="lg:sticky lg:top-28">
                                <Card className="border-border/80 bg-card shadow-md ring-1 ring-black/[0.04] dark:ring-white/[0.06]">
                                    <CardContent className="space-y-4 p-5 sm:p-6">
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
                                        {personName ? (
                                            <p className="text-sm font-medium text-foreground">{personName}</p>
                                        ) : null}
                                        <div className="flex flex-col gap-2">
                                            {phoneRaw ? (
                                                <Button asChild className="w-full justify-center gap-2" size="lg">
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
                                            <Button asChild variant="secondary" className="w-full">
                                                <Link href="/contact">{tPortfolio.cta_contact ?? 'Contact us'}</Link>
                                            </Button>
                                            <Button asChild variant="outline" className="w-full justify-center gap-2">
                                                <a href={priceDropMailto}>
                                                    <Bell className="size-4 shrink-0" aria-hidden />
                                                    {tPortfolio.price_drop_cta ?? 'Notify me if the price drops'}
                                                </a>
                                            </Button>
                                            {listing_pdf_path?.trim() ? (
                                                <Button asChild variant="outline" className="w-full justify-center gap-2">
                                                    <a
                                                        href={`/storage/${listing_pdf_path}`}
                                                        download
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        <FileDown className="size-4 shrink-0" aria-hidden />
                                                        {tPortfolio.download_pdf ?? 'Download PDF'}
                                                    </a>
                                                </Button>
                                            ) : null}
                                        </div>
                                    </CardContent>
                                </Card>
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
                            href="/portfolio"
                            className="text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                        >
                            {tPortfolio.back_link ?? '← Back to unit list'}
                        </Link>
                    </p>
                </main>

                {hasLightbox && currentLightboxSrc && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 px-4"
                        onClick={onCloseLightbox}
                        role="presentation"
                    >
                        <button
                            type="button"
                            className="absolute right-4 top-4 rounded-full bg-white/10 px-3 py-1.5 text-sm font-medium text-white backdrop-blur-sm"
                            onClick={(e) => {
                                e.stopPropagation();
                                onCloseLightbox();
                            }}
                        >
                            {tPortfolio.lightbox_close ?? 'Close'}
                        </button>
                        {slides.length > 1 ? (
                            <>
                                <button
                                    type="button"
                                    className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 px-3 py-2 text-sm font-medium text-white backdrop-blur-sm sm:left-4"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        showPrev();
                                    }}
                                >
                                    {tPortfolio.lightbox_prev ?? 'Previous'}
                                </button>
                                <button
                                    type="button"
                                    className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 px-3 py-2 text-sm font-medium text-white backdrop-blur-sm sm:right-4"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        showNext();
                                    }}
                                >
                                    {tPortfolio.lightbox_next ?? 'Next'}
                                </button>
                            </>
                        ) : null}
                        <img
                            src={currentLightboxSrc}
                            alt=""
                            className="max-h-[92vh] max-w-full rounded-lg object-contain shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                )}

                <Footer />
            </div>
        </>
    );
}
