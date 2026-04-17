import { Card, CardContent } from '@/components/ui/card';
import { useEffect, useRef, useState } from 'react';

export type AboutData = {
    id: number;
    title: string;
    body: string;
    principles_heading: string | null;
} | null;

export type AboutItemData = {
    id: number;
    label: string;
    text: string;
};

export type PrincipleItem = {
    id: number;
    text: string;
};

const defaultAbout: Omit<NonNullable<AboutData>, 'id'> = {
    title: 'About Casa Imobby',
    body: "Casa Imobby is a real estate agency focused on clear communication and fair deals for buyers, sellers and tenants.\n\nWe combine local market knowledge with careful presentation of every listing, so you can decide with confidence — whether you are moving home or building a portfolio.",
    principles_heading: 'Our principles',
};

const defaultAboutItems: AboutItemData[] = [
    { id: 0, label: 'Vision', text: 'Straightforward property journeys backed by honest advice.' },
    { id: 1, label: 'Values', text: 'Transparency, respect for clients’ time and attention to detail.' },
    { id: 2, label: 'Expertise', text: 'Residential and commercial sales, lettings and investment support.' },
];

const defaultPrinciples: PrincipleItem[] = [
    { id: 0, text: 'CLARITY – we explain options, costs and timelines without jargon.' },
    { id: 1, text: 'LOCAL INSIGHT – we know the neighbourhoods we work in.' },
    { id: 2, text: 'PARTNERSHIP – we listen first, then act in your interest.' },
    { id: 3, text: 'PROFESSIONALISM – accurate marketing materials and punctual follow‑up.' },
    { id: 4, text: 'INTEGRITY – realistic pricing and discreet handling of sensitive information.' },
];

type Props = {
    about?: AboutData | null;
    aboutItems?: AboutItemData[];
    principles?: PrincipleItem[];
};

export function AboutSection({ about, aboutItems, principles }: Props) {
    const a = about ?? defaultAbout;
    const itemList = aboutItems && aboutItems.length > 0 ? aboutItems : defaultAboutItems;
    const principleList = principles && principles.length > 0 ? principles : defaultPrinciples;
    const bodyParagraphs = a.body.split(/\n\n+/).filter(Boolean);
    const sectionRef = useRef<HTMLElement | null>(null);
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
        <section
            ref={sectionRef}
            id="about"
            className={`grid gap-8 rounded-2xl border border-border/70 bg-background/80 p-6 shadow-sm transition-opacity duration-500 sm:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] sm:p-8 dark:bg-neutral-950/70 ${isVisible ? 'animate-mobile-fade-up' : ''}`}
        >
            <div className="space-y-4">
                <h2 className="text-lg font-semibold sm:text-xl">{a.title}</h2>
                {bodyParagraphs.map((para, i) => (
                    <p key={i} className="text-sm text-muted-foreground">
                        {para}
                    </p>
                ))}
                <dl className="grid gap-4 text-xs sm:grid-cols-3 sm:text-sm">
                    {itemList.map((item) => (
                        <div key={item.id}>
                            <dt className="text-muted-foreground">{item.label}</dt>
                            <dd className="mt-1">{item.text}</dd>
                        </div>
                    ))}
                </dl>
            </div>
            <Card className={`border-border/70 bg-gradient-to-br from-neutral-100 via-brand-soft/80 to-brand-accent-soft dark:from-neutral-900 dark:via-neutral-900 dark:to-brand-accent/15 ${isVisible ? 'animate-mobile-card-pop' : ''}`}>
                <CardContent className="space-y-4 p-6">
                    <h3 className="text-sm font-semibold">
                        {a.principles_heading ?? 'Our principles'}
                    </h3>
                    <ul className="space-y-3 text-xs text-muted-foreground">
                        {principleList.map((p) => (
                            <li key={p.id}>{p.text}</li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
        </section>
    );
}

