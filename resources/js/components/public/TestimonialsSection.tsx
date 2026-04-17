import { usePage } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';

export type TestimonialItem = {
    id?: number;
    name: string;
    role?: string | null;
    quote: string;
    image_path?: string | null;
};

const fallbackTestimonials: TestimonialItem[] = [
    {
        name: 'Elena M.',
        role: 'Buyer, Bucharest',
        quote:
            'Casa Imobby guided us from the first viewing to the notary — calm, organised and always reachable.',
    },
    {
        name: 'Andrei P.',
        role: 'Seller',
        quote:
            'Professional photos, serious viewers and realistic pricing advice. The sale closed without surprises.',
    },
    {
        name: 'Gheorghe Ștefan',
        role: 'Investor',
        quote:
            'They know the local market and short‑listed only properties that matched our brief.',
    },
    {
        name: 'Maria I.',
        role: 'Tenant',
        quote:
            'Transparent lease terms and quick responses — exactly what we needed when relocating.',
    },
];

const CARDS_PER_VIEW_DESKTOP = 3;
const CARDS_PER_VIEW_MOBILE = 1;

type Props = {
    testimonials?: TestimonialItem[];
};

export function TestimonialsSection({ testimonials }: Props) {
    const items =
        testimonials && testimonials.length > 0 ? testimonials : fallbackTestimonials;
    const { translations } = usePage().props as { translations?: any };
    const t = translations?.testimonials ?? {};

    const [currentIndex, setCurrentIndex] = useState(0);
    const [hasMounted, setHasMounted] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLElement | null>(null);
    const lastScrollYRef = useRef(0);
    const hasAnimatedRef = useRef(false);

    const cardsPerView = isMobile ? CARDS_PER_VIEW_MOBILE : CARDS_PER_VIEW_DESKTOP;
    const showCarousel = items.length > cardsPerView;
    const totalSlides = Math.max(1, items.length - cardsPerView + 1);

    const visible = useMemo(() => {
        const start = showCarousel ? currentIndex : 0;
        return items.slice(start, start + cardsPerView);
    }, [cardsPerView, currentIndex, items, showCarousel]);

    useEffect(() => {
        setHasMounted(true);
    }, []);

    useEffect(() => {
        if (!sectionRef.current) {
            return;
        }

        lastScrollYRef.current = typeof window !== 'undefined' ? window.scrollY : 0;
        const observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[0];
                const currentY = typeof window !== 'undefined' ? window.scrollY : 0;
                const scrollingDown = currentY >= lastScrollYRef.current;
                lastScrollYRef.current = currentY;

                if (hasAnimatedRef.current) {
                    return;
                }

                if (entry?.isIntersecting && scrollingDown) {
                    hasAnimatedRef.current = true;
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            { threshold: 0.05, rootMargin: '0px 0px -10% 0px' },
        );

        observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        const media = window.matchMedia('(max-width: 639px)');
        const update = () => setIsMobile(media.matches);

        update();
        media.addEventListener('change', update);
        return () => media.removeEventListener('change', update);
    }, []);

    useEffect(() => {
        setCurrentIndex((index) => Math.min(index, totalSlides - 1));
    }, [totalSlides]);

    const goPrev = () => {
        setCurrentIndex((i) => Math.max(0, i - 1));
    };
    const goNext = () => {
        setCurrentIndex((i) => Math.min(totalSlides - 1, i + 1));
    };

    return (
        <section
            ref={sectionRef}
            className={`space-y-8 py-12 sm:py-16 transition-opacity duration-700 ease-out ${
                hasMounted ? 'opacity-100' : 'opacity-0'
            }`}
        >
            <div className="text-center">
                <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                    {t.section_title ?? 'What our clients say'}
                </h2>
                <div className="mx-auto mt-2 h-1 w-16 rounded-full bg-brand-accent" />
                {t.section_body && (
                    <p className="mx-auto mt-4 max-w-2xl text-sm text-muted-foreground">
                        {t.section_body}
                    </p>
                )}
            </div>

            <div className="relative mx-auto max-w-6xl px-0 sm:px-6 lg:px-8">
                {showCarousel && (
                    <>
                        <button
                            type="button"
                            onClick={goPrev}
                            className="absolute left-1 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background/95 text-muted-foreground shadow-sm transition hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 sm:left-0 sm:h-10 sm:w-10"
                            aria-label="Previous testimonials"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button
                            type="button"
                            onClick={goNext}
                            className="absolute right-1 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background/95 text-muted-foreground shadow-sm transition hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 sm:right-0 sm:h-10 sm:w-10"
                            aria-label="Next testimonials"
                        >
                            <ChevronRight className="h-5 w-5" />
                        </button>
                    </>
                )}

                <div
                    className={`grid gap-4 sm:gap-6 ${
                        cardsPerView === 1 ? 'grid-cols-1' : 'sm:grid-cols-3'
                    } ${showCarousel ? 'mx-11 sm:mx-14' : 'mx-4 sm:mx-0'} ${
                        cardsPerView === 1 ? 'max-w-none' : ''
                    }`}
                    style={
                        isVisible
                            ? ({
                                  animationName: 'testimonial-fade-in',
                                  animationDuration: '0.5s',
                                  animationTimingFunction: 'ease-out',
                                  animationFillMode: 'forwards',
                              } as CSSProperties)
                            : undefined
                    }
                >
                    {visible.map((item, cardIndex) => {
                        const staggerMs = cardIndex * 60;
                        const cardAnim: CSSProperties | undefined = !isVisible
                            ? undefined
                            : isMobile
                              ? {
                                    animationName: 'mobile-card-pop',
                                    animationDuration: '0.65s',
                                    animationTimingFunction: 'cubic-bezier(0.22, 0.61, 0.36, 1)',
                                    animationFillMode: 'both',
                                    animationDelay: `${staggerMs}ms`,
                                }
                              : {
                                    animationName: 'testimonial-card-in',
                                    animationDuration: '0.45s',
                                    animationTimingFunction: 'ease-out',
                                    animationFillMode: 'forwards',
                                    animationDelay: `${staggerMs}ms`,
                                };

                        return (
                        <div
                            key={`slot-${cardIndex}`}
                            className="flex min-w-0 flex-col rounded-xl border border-border/60 bg-background p-5 shadow-sm transition-transform duration-300 ease-out hover:-translate-y-0.5 sm:p-6"
                            style={cardAnim}
                        >
                            <span
                                className="font-brand text-4xl leading-none text-brand-accent"
                                aria-hidden
                            >
                                “
                            </span>
                            <p className="mt-2 flex-1 break-words text-sm leading-relaxed text-foreground">
                                {item.quote}
                            </p>
                            <div className="mt-4 flex items-center gap-3">
                                {item.image_path ? (
                                    <span className="flex h-12 w-12 shrink-0 overflow-hidden rounded-full border border-border/60 bg-muted">
                                        <img
                                            src={`/storage/${item.image_path}`}
                                            alt={item.name}
                                            className="h-full w-full object-cover"
                                        />
                                    </span>
                                ) : (
                                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-border/60 bg-muted text-sm font-semibold text-muted-foreground">
                                        {item.name.charAt(0)}
                                    </span>
                                )}
                                <div className="min-w-0">
                                    <p className="truncate font-semibold text-foreground">
                                        {item.name}
                                    </p>
                                    {item.role && (
                                        <p className="truncate text-xs text-muted-foreground">
                                            {item.role}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                        );
                    })}
                </div>

                {/* Pagination dots */}
                {showCarousel && totalSlides > 1 && (
                    <div className="mt-6 flex justify-center gap-2">
                        {Array.from({ length: totalSlides }, (_, i) => (
                            <button
                                key={i}
                                type="button"
                                onClick={() => setCurrentIndex(i)}
                                className={`h-2 rounded-full transition-all ${
                                    i === currentIndex
                                        ? 'w-6 bg-brand-accent'
                                        : 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'
                                }`}
                                aria-label={`Go to slide ${i + 1}`}
                                aria-current={i === currentIndex ? 'true' : undefined}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
