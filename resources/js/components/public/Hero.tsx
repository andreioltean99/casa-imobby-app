import { usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { useEffect, useRef, useState } from 'react';
import { openLeadOfferModal } from '@/components/public/LeadOfferModal';

export function Hero() {
    const { translations, hero } = usePage().props as {
        translations?: any;
        hero?: any;
    };
    /** Prefer property-search “Request offer” copy; falls back to hero / translations. */
    const offerCtaLabel =
        translations?.property_search?.submit_offer ??
        hero?.secondary_cta ??
        translations?.hero?.secondary_cta ??
        'Request offer';

    const t = translations?.hero ?? {};
    const h = hero ?? {};
    const sectionRef = useRef<HTMLDivElement | null>(null);
    const lastScrollYRef = useRef(0);
    const hasAnimatedRef = useRef(false);
    const [isVisible, setIsVisible] = useState(false);

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

    return (
        <div ref={sectionRef} className="w-full space-y-4 sm:space-y-5">
            <p className={`${isVisible ? 'animate-mobile-fade-up' : ''} text-xs font-semibold uppercase tracking-[0.2em] text-brand-accent dark:text-emerald-400`}>
                {h.eyebrow ?? t.eyebrow ?? 'Modernization & Sustainability'}
            </p>
            <h1 className={`${isVisible ? 'animate-mobile-fade-up-delayed' : ''} max-w-none text-pretty text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-[clamp(1.75rem,2.2vw+1rem,2.75rem)] lg:leading-snug`}>
                {h.title ?? t.title ?? 'Design and execution of high‑efficiency thermo‑energy systems.'}
            </h1>
            <div
                className={`${isVisible ? 'animate-mobile-fade-up-later' : ''} max-w-none text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base lg:text-[0.98rem]`}
                dangerouslySetInnerHTML={{
                    __html:
                        h.body ??
                        t.body ??
                        'Casa Imobby is a Romanian real estate agency guiding clients through buying, selling and renting — from first viewing to signing, with clear advice at every step.',
                }}
            />
            <div className={`${isVisible ? 'animate-mobile-fade-up-later' : ''} flex flex-wrap gap-3`}>
                <Button type="button" onClick={() => openLeadOfferModal()}>
                    {offerCtaLabel}
                </Button>
            </div>
        </div>
    );
}

