import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Header } from '@/components/public/Header';
import { Footer } from '@/components/public/Footer';

type GalleryImage = {
    id: number;
    image_path: string;
    sort_order: number | null;
};

type PortfolioItem = {
    id: number;
    title: string;
    slug: string;
    description: string | null;
    image_path: string | null;
    date: string | null;
    duration: string | null;
    gallery: GalleryImage[];
};

type Props = {
    portfolioItem: PortfolioItem;
};

export default function PortfolioProjectPage({ portfolioItem }: Props) {
    const { title, description, image_path, date, duration, gallery } = portfolioItem;
    const { translations } = usePage().props as { translations?: any };
    const tPortfolio = translations?.portfolio ?? {};
    const tUnits = translations?.units ?? {};
    const localizeDuration = (value: string) => {
        if (!value) return value;
        return value
            .replace(/\byears\b/gi, tUnits.years ?? 'years')
            .replace(/\byear\b/gi, tUnits.year ?? 'year')
            .replace(/\bmonths\b/gi, tUnits.months ?? 'months')
            .replace(/\bmonth\b/gi, tUnits.month ?? 'month')
            .replace(/\bdays\b/gi, tUnits.days ?? 'days')
            .replace(/\bday\b/gi, tUnits.day ?? 'day');
    };
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    const hasLightbox = lightboxIndex !== null && gallery && gallery.length > 0;
    const currentLightboxSrc =
        hasLightbox && lightboxIndex !== null
            ? `/storage/${gallery[lightboxIndex].image_path}`
            : null;

    const onCloseLightbox = () => setLightboxIndex(null);

    const showNext = () => {
        if (!gallery || gallery.length === 0 || lightboxIndex === null) return;
        setLightboxIndex((prev) =>
            prev === null ? prev : (prev + 1) % gallery.length
        );
    };

    const showPrev = () => {
        if (!gallery || gallery.length === 0 || lightboxIndex === null) return;
        setLightboxIndex((prev) =>
            prev === null ? prev : (prev - 1 + gallery.length) % gallery.length
        );
    };

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

        return () => {
            window.removeEventListener('keydown', onKeyDown);
        };
    }, [hasLightbox, showNext, showPrev]);

    return (
        <>
            <Head title={`${title} – Portfolio – Casa Imobby`} />
            <div className="min-h-screen overflow-x-hidden bg-gradient-to-b from-background via-background to-neutral-50 text-foreground dark:from-neutral-950 dark:via-neutral-950 dark:to-neutral-900">
                <Header />

                <main className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-10 sm:px-6 sm:py-16 lg:py-20">
                    <div className="flex flex-col gap-2">
                        <Link
                            href="/portfolio"
                            className="text-xs font-medium text-muted-foreground hover:text-foreground"
                        >
                            {tPortfolio.back_link ?? '← Back to portfolio'}
                        </Link>
                        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                            {title}
                        </h1>
                        {(date || duration) && (
                            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                {date && <span>{date}</span>}
                                {duration && (
                                    <span>
                                        {(tPortfolio.duration_label ?? 'Duration:') + ' '}
                                        {localizeDuration(duration)}
                                    </span>
                                )}
                            </div>
                        )}
                    </div>

                    {image_path && (
                        <div className="mx-auto w-full max-w-2xl overflow-hidden rounded-xl ring-1 ring-border/60">
                            <img
                                src={`/storage/${image_path}`}
                                alt={title}
                                className="h-56 w-full object-cover sm:h-72 lg:h-80"
                            />
                        </div>
                    )}

                    {description && (
                        <div
                            className="max-w-3xl overflow-x-hidden text-sm leading-relaxed text-muted-foreground sm:text-base break-words [overflow-wrap:anywhere]
                            [&_*]:max-w-full
                            [&_img]:h-auto [&_img]:rounded-md
                            [&_video]:h-auto
                            [&_iframe]:w-full
                            [&_table]:block [&_table]:w-full [&_table]:overflow-x-auto
                            [&_pre]:whitespace-pre-wrap [&_pre]:break-words"
                            dangerouslySetInnerHTML={{ __html: description }}
                        />
                    )}

                    {gallery && gallery.length > 0 && (
                        <section className="space-y-4">
                            <h2 className="text-lg font-semibold">
                                {tPortfolio.project_gallery ?? 'Project gallery'}
                            </h2>
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {gallery.map((img, index) => (
                                    <div
                                        key={img.id}
                                        className="overflow-hidden rounded-lg ring-1 ring-border/60 cursor-zoom-in"
                                        onClick={() => setLightboxIndex(index)}
                                    >
                                        <img
                                            src={`/storage/${img.image_path}`}
                                            alt=""
                                            className="h-44 w-full object-cover sm:h-52"
                                        />
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </main>

                {hasLightbox && currentLightboxSrc && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4"
                        onClick={onCloseLightbox}
                    >
                        <button
                            type="button"
                            className="absolute right-4 top-4 rounded-full bg-black/60 px-3 py-1 text-sm font-medium text-white"
                            onClick={(e) => {
                                e.stopPropagation();
                                onCloseLightbox();
                            }}
                        >
                            Close
                        </button>
                        {gallery && gallery.length > 1 && (
                            <>
                                <button
                                    type="button"
                                    className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/60 px-3 py-1 text-sm font-medium text-white"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        showPrev();
                                    }}
                                >
                                    Prev
                                </button>
                                <button
                                    type="button"
                                    className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/60 px-3 py-1 text-sm font-medium text-white"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        showNext();
                                    }}
                                >
                                    Next
                                </button>
                            </>
                        )}
                        <img
                            src={currentLightboxSrc}
                            alt=""
                            className="max-h-[95vh] max-w-[100vw] rounded-lg object-contain"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                )}

                <Footer />
            </div>
        </>
    );
}
